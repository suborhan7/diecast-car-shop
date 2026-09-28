// The site's public address. NEXT_PUBLIC_SITE_URL may be unset, empty, or
// missing "https://", so fall back to Vercel's own URL and never throw.
export function siteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim() ||
    "localhost:3000";
  const withProtocol = /^https?:\/\//i.test(raw)
    ? raw
    : `${raw.startsWith("localhost") ? "http" : "https"}://${raw}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return "http://localhost:3000";
  }
}
