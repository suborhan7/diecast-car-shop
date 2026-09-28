"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";

export function CardActions({ product }: { product: Product }) {
  const { add, lines, available } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const inCart = lines.find((l) => l.id === product.id)?.qty ?? 0;
  const left = available(product.id, product.stock);
  const full = inCart >= left;
  if (product.status === "sold-out" || product.stock <= 0) return null;
  if (left <= 0)
    return (
      <div className="card-actions">
        <button className="btn btn-sm" disabled>Sold out</button>
      </div>
    );

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  return (
    <div className="card-actions">
      <button
        className="btn btn-primary btn-sm"
        disabled={full && !added}
        onClick={(e) => {
          stop(e);
          if (full) return;
          add(product.id, 1, left);
          setAdded(true);
          setTimeout(() => setAdded(false), 1800);
        }}
      >
        {added ? "Added!" : full ? "In your cart" : product.status === "preorder" ? "Preorder" : "Add to cart"}
      </button>
      <button
        className="btn btn-outline btn-sm"
        onClick={(e) => {
          stop(e);
          if (!full) add(product.id, 1, left);
          router.push("/checkout");
        }}
      >
        Order now
      </button>
    </div>
  );
}
