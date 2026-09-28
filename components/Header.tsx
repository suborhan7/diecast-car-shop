"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site";
import { useCart } from "./CartProvider";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=hot-wheels", label: "Hot Wheels" },
  { href: "/shop?sort=new", label: "New arrivals" },
  { href: "/preorders", label: "Preorders" },
  { href: "/grading", label: "Grading" },
];

export function Header() {
  const { count, ready, wishlist } = useCart();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="container header-row">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          <span className="logo-mark">BDC</span>
          <span className="logo-text">
            <span className="logo-a">{site.name.split(" ")[0]}</span>{" "}
            <span className="logo-b">{site.name.split(" ").slice(1).join(" ")}</span>
          </span>
        </Link>
        <nav className={`nav ${open ? "open" : ""}`}>
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={path === n.href.split("?")[0] && !n.href.includes("?") ? "active" : ""}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <Link href="/wishlist" className="cart-btn" aria-label={`Wishlist, ${wishlist.length} items`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-7.5-4.6-9.5-9.3C1.2 8.4 3.3 5 6.8 5c2 0 3.4 1.1 4.2 2.4h2C13.8 6.1 15.2 5 17.2 5c3.5 0 5.6 3.4 4.3 6.7C19.5 16.4 12 21 12 21z" />
            </svg>
            {ready && wishlist.length > 0 && <span className="cart-count">{wishlist.length}</span>}
          </Link>
          <Link href="/cart" className="cart-btn" aria-label={`Cart, ${count} items`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6h15l-1.5 9h-12z M6 6L5 3H2 M9 20a1 1 0 100-2 1 1 0 000 2z M18 20a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            {ready && count > 0 && <span className="cart-count">{count}</span>}
          </Link>
          <button className="menu-btn" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
