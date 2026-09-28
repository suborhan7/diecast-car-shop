import data from "@/data/products.json";
import type { Product } from "./types";

export const products = (data as Product[]).filter((p) => !p.hidden);

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export const inStock = () => products.filter((p) => p.status !== "preorder");
export const preorders = () => products.filter((p) => p.status === "preorder");

export function related(p: Product, n = 4) {
  return products
    .filter((o) => o.id !== p.id && o.status !== "sold-out")
    .sort((a, b) => Number(b.series === p.series) - Number(a.series === p.series))
    .slice(0, n);
}

export function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
