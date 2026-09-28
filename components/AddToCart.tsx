"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";

export function AddToCart({ product }: { product: Product }) {
  const { add, lines } = useCart();
  const [qty, setQty] = useState(1);
  const inCart = lines.find((l) => l.id === product.id)?.qty ?? 0;
  const available = Math.max(0, product.stock - inCart);
  const soldOut = product.status === "sold-out" || product.stock <= 0;

  if (soldOut) return <button className="btn btn-lg" disabled>Sold out</button>;

  return (
    <div className="buy">
      {product.stock > 1 && (
        <div className="qty">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
          <span>{qty}</span>
          <button onClick={() => setQty((q) => Math.min(available || 1, q + 1))} aria-label="Increase">+</button>
        </div>
      )}
      <button className="btn btn-lg btn-primary" disabled={available === 0} onClick={() => add(product.id, qty, product.stock)}>
        {available === 0 ? "All in your cart" : product.status === "preorder" ? "Preorder now" : "Add to cart"}
      </button>
      {inCart > 0 && (
        <Link href="/cart" className="link-btn">
          View cart ({inCart})
        </Link>
      )}
    </div>
  );
}
