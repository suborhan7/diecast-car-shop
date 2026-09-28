"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = { id: string; qty: number };

type CartCtx = {
  lines: CartLine[];
  count: number;
  ready: boolean;
  add: (id: string, qty: number, max: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  toast: string | null;
  wishlist: string[];
  toggleWish: (id: string) => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "diecast-cart-v1";
const WISH_KEY = "diecast-wishlist-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setLines(JSON.parse(saved));
      const wish = localStorage.getItem(WISH_KEY);
      if (wish) setWishlist(JSON.parse(wish));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
      localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
    } catch {}
  }, [lines, wishlist, ready]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const add = useCallback((id: string, qty: number, max: number) => {
    setLines((ls) => {
      const existing = ls.find((l) => l.id === id);
      const next = Math.min(max, (existing?.qty ?? 0) + qty);
      return existing ? ls.map((l) => (l.id === id ? { ...l, qty: next } : l)) : [...ls, { id, qty: next }];
    });
    setToast("Added to cart");
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((ls) => (qty <= 0 ? ls.filter((l) => l.id !== id) : ls.map((l) => (l.id === id ? { ...l, qty } : l))));
  }, []);

  const remove = useCallback((id: string) => setLines((ls) => ls.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setLines([]), []);

  const toggleWish = useCallback((id: string) => {
    setWishlist((w) => {
      const has = w.includes(id);
      setToast(has ? "Removed from wishlist" : "Saved to wishlist");
      return has ? w.filter((x) => x !== id) : [...w, id];
    });
  }, []);

  const value = useMemo(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      ready,
      add,
      setQty,
      remove,
      clear,
      toast,
      wishlist,
      toggleWish,
    }),
    [lines, ready, add, setQty, remove, clear, toast, wishlist, toggleWish],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
