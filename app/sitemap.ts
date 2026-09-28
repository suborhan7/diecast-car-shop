import type { MetadataRoute } from "next";
import { products } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return [
    ...["", "/shop", "/preorders", "/grading", "/policies", "/preorder-terms", "/hot-wheels-bangladesh"].map((p) => ({ url: base + p })),
    ...products.map((p) => ({ url: `${base}/product/${p.slug}` })),
  ];
}
