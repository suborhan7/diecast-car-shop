import type { Metadata } from "next";
import { ShopBrowser } from "@/components/ShopBrowser";
import { products } from "@/lib/products";

export const metadata: Metadata = { title: "Shop" };

export default async function Shop({ searchParams }: { searchParams: Promise<{ category?: string; sort?: string; price?: string }> }) {
  const { category, sort, price } = await searchParams;
  return (
    <div className="container page">
      <h1>Shop</h1>
      <ShopBrowser key={`${category}-${sort}-${price}`} products={products} initialCategory={category} initialSort={sort} initialPrice={price} />
    </div>
  );
}
