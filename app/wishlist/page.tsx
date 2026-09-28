"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { ProductCard } from "@/components/ProductCard";
import { getProductById } from "@/lib/products";

export default function Wishlist() {
  const { wishlist, ready } = useCart();
  const items = wishlist.map(getProductById).filter((p) => !!p);
  return (
    <div className="container page">
      <h1>Wishlist</h1>
      {!ready ? null : items.length ? (
        <div className="grid">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h3>Nothing saved yet</h3>
          <p className="muted">Tap the heart on any car to keep it here.</p>
          <Link href="/shop" className="btn btn-primary">Browse the shop</Link>
        </div>
      )}
    </div>
  );
}
