import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Tiny key-value store for orders.
 * - On Vercel: Upstash Redis (free tier), connected from the Vercel dashboard. Vercel adds
 *   KV_REST_API_URL / KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL / _TOKEN) automatically.
 * - Locally, or before a database is connected: a JSON file. On Vercel that file lives in /tmp
 *   and is wiped regularly, so the admin page warns until Redis is connected.
 */
const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export const persistent = Boolean(url && token);

type Cmd = (string | number)[];

async function redis(cmds: Cmd[]): Promise<unknown[]> {
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Database error ${res.status}`);
  const out = (await res.json()) as { result?: unknown; error?: string }[];
  return out.map((r) => {
    if (r.error) throw new Error(r.error);
    return r.result;
  });
}

// ---- File fallback -------------------------------------------------------
type FileData = { kv: Record<string, string>; list: { id: string; score: number }[]; hash: Record<string, number> };
const file = path.join(process.env.VERCEL ? "/tmp" : process.cwd(), ".data", "orders.json");
let queue = Promise.resolve();

async function readFile(): Promise<FileData> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return { kv: {}, list: [], hash: {} };
  }
}
function withFile<T>(fn: (d: FileData) => T | Promise<T>, write = false): Promise<T> {
  const run = queue.then(async () => {
    const d = await readFile();
    const out = await fn(d);
    if (write) {
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, JSON.stringify(d));
    }
    return out;
  });
  queue = run.then(() => undefined, () => undefined);
  return run;
}

// ---- Public API ------------------------------------------------------------
export async function putJSON(key: string, value: unknown, indexScore?: number, indexKey = "orders") {
  const v = JSON.stringify(value);
  if (persistent) {
    const cmds: Cmd[] = [["SET", key, v]];
    if (indexScore !== undefined) cmds.push(["ZADD", indexKey, indexScore, key]);
    await redis(cmds);
    return;
  }
  await withFile((d) => {
    d.kv[key] = v;
    if (indexScore !== undefined && !d.list.some((x) => x.id === key)) d.list.push({ id: key, score: indexScore });
  }, true);
}

export async function getJSON<T>(key: string): Promise<T | null> {
  if (persistent) {
    const [v] = await redis([["GET", key]]);
    return v ? (JSON.parse(v as string) as T) : null;
  }
  return withFile((d) => (d.kv[key] ? (JSON.parse(d.kv[key]) as T) : null));
}

/** Newest first. */
export async function listJSON<T>(limit = 500, indexKey = "orders"): Promise<T[]> {
  if (persistent) {
    const [keys] = (await redis([["ZREVRANGE", indexKey, 0, limit - 1]])) as string[][];
    if (!keys?.length) return [];
    const [vals] = (await redis([["MGET", ...keys]])) as (string | null)[][];
    return vals.filter(Boolean).map((v) => JSON.parse(v as string) as T);
  }
  return withFile((d) =>
    [...d.list]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => d.kv[x.id])
      .filter(Boolean)
      .map((v) => JSON.parse(v) as T),
  );
}

/** Adds `by` to a counter field and returns the new value. */
export async function incr(hashKey: string, field: string, by: number): Promise<number> {
  if (persistent) {
    const [v] = await redis([["HINCRBY", hashKey, field, by]]);
    return Number(v);
  }
  return withFile((d) => {
    const k = `${hashKey}:${field}`;
    d.hash[k] = (d.hash[k] ?? 0) + by;
    return d.hash[k];
  }, true);
}

export async function counters(hashKey: string): Promise<Record<string, number>> {
  if (persistent) {
    const [flat] = (await redis([["HGETALL", hashKey]])) as string[][];
    const out: Record<string, number> = {};
    for (let i = 0; i + 1 < (flat?.length ?? 0); i += 2) out[flat[i]] = Number(flat[i + 1]);
    return out;
  }
  return withFile((d) => {
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(d.hash)) if (k.startsWith(hashKey + ":")) out[k.slice(hashKey.length + 1)] = v;
    return out;
  });
}
