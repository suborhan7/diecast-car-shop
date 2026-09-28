"use client";

import { useCart } from "./CartProvider";

export function WishButton({ id, className = "" }: { id: string; className?: string }) {
  const { wishlist, toggleWish, ready } = useCart();
  const on = ready && wishlist.includes(id);
  return (
    <button
      type="button"
      className={`wish ${on ? "on" : ""} ${className}`}
      aria-label={on ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={on}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWish(id);
      }}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M12 21s-7.5-4.6-9.5-9.3C1.2 8.4 3.3 5 6.8 5c2 0 3.4 1.1 4.2 2.4h2C13.8 6.1 15.2 5 17.2 5c3.5 0 5.6 3.4 4.3 6.7C19.5 16.4 12 21 12 21z" />
      </svg>
    </button>
  );
}
