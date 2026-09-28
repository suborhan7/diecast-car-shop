import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { siteUrl } from "@/lib/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    ...["", "/shop", "/preorders", "/grading", "/policies", "/preorder-terms", "/hot-wheels-bangladesh"].map((p) => ({ url: base + p })),
    ...products.map((p) => ({ url: `${base}/product/${p.slug}` })),
  ];
}
