"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";

export function CardActions({ product }: { product: Product }) {
  const { add, lines } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const inCart = lines.find((l) => l.id === product.id)?.qty ?? 0;
  const full = inCart >= product.stock;
  if (product.status === "sold-out" || product.stock <= 0) return null;

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
          add(product.id, 1, product.stock);
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
          if (!full) add(product.id, 1, product.stock);
          router.push("/checkout");
        }}
      >
        Order now
      </button>
    </div>
  );
}
