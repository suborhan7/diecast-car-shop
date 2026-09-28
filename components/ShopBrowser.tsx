"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, PRICE_BRACKETS } from "@/lib/site";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

type Sort = "featured" | "new" | "price-asc" | "price-desc" | "grade" | "newest";

export function ShopBrowser({
  products,
  initialCategory,
  initialSort,
  initialPrice,
}: {
  products: Product[];
  initialCategory?: string;
  initialSort?: string;
  initialPrice?: string;
}) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState(initialCategory ?? "all");
  const [series, setSeries] = useState<string[]>([]);
  const [minGrade, setMinGrade] = useState(0);
  const [sealedOnly, setSealedOnly] = useState(false);
  const [hideSold, setHideSold] = useState(false);
  const [sort, setSort] = useState<Sort>(initialSort === "new" ? "new" : "featured");
  const [price, setPrice] = useState(initialPrice ?? "all");
  const [scale, setScale] = useState("all");
  const [brands, setBrands] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const allSeries = useMemo(
    () => [...new Set(products.map((p) => p.subseries ?? p.series))].sort(),
    [products],
  );
  const allBrands = useMemo(() => [...new Set(products.map((p) => p.brand))].sort(), [products]);
  const allScales = useMemo(() => [...new Set(products.map((p) => p.scale))].sort(), [products]);
  const bracket = PRICE_BRACKETS.find((b) => b.id === price);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const r = products.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (series.length === 0 || series.includes(p.subseries ?? p.series)) &&
        (!bracket || (p.price >= bracket.min && p.price <= bracket.max)) &&
        (scale === "all" || p.scale === scale) &&
        (brands.length === 0 || brands.includes(p.brand)) &&
        p.condition.score >= minGrade &&
        (!sealedOnly || p.condition.packaging.startsWith("Sealed")) &&
        (!hideSold || (p.status !== "sold-out" && p.stock > 0)) &&
        (!term || `${p.name} ${p.color} ${p.series} ${p.subseries ?? ""} ${p.year} ${p.brand}`.toLowerCase().includes(term)),
    );
    const by: Record<Sort, (a: Product, b: Product) => number> = {
      featured: (a, b) => Number(!!b.featured) - Number(!!a.featured),
      new: (a, b) => (b.addedOn ?? "").localeCompare(a.addedOn ?? ""),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      grade: (a, b) => b.condition.score - a.condition.score,
      newest: (a, b) => b.year - a.year,
    };
    return [...r].sort(by[sort]);
  }, [products, q, category, series, bracket, scale, brands, minGrade, sealedOnly, hideSold, sort]);

  const toggleSeries = (s: string) =>
    setSeries((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  const reset = () => {
    setQ("");
    setCategory("all");
    setSeries([]);
    setMinGrade(0);
    setSealedOnly(false);
    setHideSold(false);
    setPrice("all");
    setScale("all");
    setBrands([]);
  };

  return (
    <div className="shop">
      <aside className={`filters ${filtersOpen ? "open" : ""}`}>
        <div className="filter-group">
          <h4>Category</h4>
          {[{ id: "all", name: "All" }, ...CATEGORIES].map((c) => (
            <label key={c.id} className="radio">
              <input type="radio" name="cat" checked={category === c.id} onChange={() => setCategory(c.id)} />
              {c.name}
              <span className="count">
                {c.id === "all" ? products.length : products.filter((p) => p.category === c.id).length}
              </span>
            </label>
          ))}
        </div>
        {allBrands.length > 1 && (
          <div className="filter-group">
            <h4>Brand</h4>
            {allBrands.map((b) => (
              <label key={b} className="check">
                <input
                  type="checkbox"
                  checked={brands.includes(b)}
                  onChange={() => setBrands((cur) => (cur.includes(b) ? cur.filter((x) => x !== b) : [...cur, b]))}
                />
                {b}
                <span className="count">{products.filter((p) => p.brand === b).length}</span>
              </label>
            ))}
          </div>
        )}
        <div className="filter-group">
          <h4>Price</h4>
          {[{ id: "all", label: "Any price" }, ...PRICE_BRACKETS].map((b) => (
            <label key={b.id} className="radio">
              <input type="radio" name="price" checked={price === b.id} onChange={() => setPrice(b.id)} />
              {b.label}
            </label>
          ))}
        </div>
        <div className="filter-group">
          <h4>Scale</h4>
          <div className="pills">
            {["all", ...allScales].map((sc) => (
              <button key={sc} className={`pill ${scale === sc ? "on" : ""}`} onClick={() => setScale(sc)}>
                {sc === "all" ? "All" : sc}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <h4>Series</h4>
          {allSeries.map((s) => (
            <label key={s} className="check">
              <input type="checkbox" checked={series.includes(s)} onChange={() => toggleSeries(s)} />
              {s}
            </label>
          ))}
        </div>
        <div className="filter-group">
          <h4>Minimum condition</h4>
          <select value={minGrade} onChange={(e) => setMinGrade(Number(e.target.value))}>
            <option value={0}>Any grade</option>
            <option value={10}>C10 Gem Mint</option>
            <option value={9}>C9 Near Mint and up</option>
            <option value={8}>C8 Excellent and up</option>
            <option value={7}>C7 Very Good and up</option>
          </select>
          <label className="check">
            <input type="checkbox" checked={sealedOnly} onChange={(e) => setSealedOnly(e.target.checked)} />
            Sealed on card only
          </label>
          <label className="check">
            <input type="checkbox" checked={hideSold} onChange={(e) => setHideSold(e.target.checked)} />
            Hide sold out
          </label>
        </div>
        <button className="link-btn" onClick={reset}>
          Clear all filters
        </button>
      </aside>

      <div className="shop-main">
        <div className="shop-toolbar">
          <input
            className="search"
            type="search"
            placeholder="Search castings, colours, years…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn btn-ghost filters-toggle" onClick={() => setFiltersOpen((o) => !o)}>
            Filters
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort">
            <option value="featured">Featured</option>
            <option value="new">Just landed</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="grade">Best condition</option>
            <option value="newest">Newest year</option>
          </select>
        </div>
        <p className="muted result-count">
          {results.length} {results.length === 1 ? "item" : "items"}
        </p>
        {results.length ? (
          <div className="grid">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h3>Nothing here yet</h3>
            <p className="muted">
              {category === "rc" || category === "diecast" || category === "collectibles"
                ? "This section is coming soon. Check back after our next restock."
                : "No items match these filters."}
            </p>
            <button className="btn" onClick={reset}>
              Show everything
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
