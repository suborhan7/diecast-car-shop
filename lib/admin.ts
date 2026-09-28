import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "bdc_admin";
const password = () => process.env.ADMIN_PASSWORD ?? "";

function sign(value: string) {
  return createHmac("sha256", password()).update(value).digest("hex");
}

export const adminConfigured = () => password().length >= 6;

export function checkPassword(input: string) {
  const a = Buffer.from(sign(input)), b = Buffer.from(sign(password()));
  return adminConfigured() && timingSafeEqual(a, b);
}

export async function setSession() {
  const exp = String(Date.now() + 1000 * 60 * 60 * 24 * 30);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const v = (await cookies()).get(COOKIE)?.value ?? "";
  const [exp, sig] = v.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const a = Buffer.from(sig), b = Buffer.from(sign(exp));
  return a.length === b.length && timingSafeEqual(a, b);
}
