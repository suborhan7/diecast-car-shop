export const revalidate = 60;

import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { HeroVideo } from "@/components/HeroVideo";
import { ProductCard } from "@/components/ProductCard";
import { inStock, preorders, products } from "@/lib/products";
import { CATEGORIES, formatPrice, PRICE_BRACKETS, site } from "@/lib/site";

export default function Home() {
  const live = inStock();
  const featured = live.filter((p) => p.featured).slice(0, 8);
  const latest = [...live].sort((a, b) => (b.addedOn ?? "").localeCompare(a.addedOn ?? "")).slice(0, 8);
  const upcoming = preorders().slice(0, 4);
  const saleOn = site.flashSaleEndsAt && new Date(site.flashSaleEndsAt).getTime() > Date.now();
  const deals = saleOn ? live.filter((p) => p.compareAtPrice).slice(0, 4) : [];
  return (
    <>
      <HeroVideo count={live.length} />

      <section className="perks">
        <div className="container perks-row">
          <div className="perk perk-feature">
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 9h15v13H3zM18 13h6l4 5v4H18z" />
              <circle cx="9" cy="24" r="2.5" fill="currentColor" />
              <circle cx="23" cy="24" r="2.5" fill="currentColor" />
            </svg>
            <div>
              <strong>Free delivery over {formatPrice(site.freeShippingThreshold)}</strong>
              <span>
                {formatPrice(site.shipping.insideDhaka)} in Dhaka, {formatPrice(site.shipping.outsideDhaka)} outside
              </span>
            </div>
          </div>
          <div className="perk">
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="4" y="8" width="24" height="16" rx="3" />
              <circle cx="16" cy="16" r="3.5" />
            </svg>
            <div>
              <strong>Cash on delivery</strong>
              <span>Pay when the car arrives</span>
            </div>
          </div>
          <div className="perk">
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="9" y="3" width="14" height="26" rx="3" />
              <path d="M14 24h4" />
            </svg>
            <div>
              <strong>bKash and Nagad</strong>
              <span>Send Money to {site.bkash}</span>
            </div>
          </div>
          <div className="perk">
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M16 3l3.6 7.3 8 1.2-5.8 5.6 1.4 8L16 21.3 8.8 25.1l1.4-8-5.8-5.6 8-1.2z" />
            </svg>
            <div>
              <strong>Hand-graded C5 to C10</strong>
              <span>Real photos of every car</span>
            </div>
          </div>
        </div>
      </section>

      {deals.length > 0 && (
        <section className="container section">
          <div className="deals">
            <div className="section-head deals-head">
              <div>
                <span className="eyebrow">Flash sale</span>
                <h2>Today&apos;s limited deals</h2>
                <p className="muted">Discounted castings while stock lasts.</p>
              </div>
              <Countdown to={site.flashSaleEndsAt!} />
            </div>
            <div className="grid">
              {deals.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container section">
        <div className="section-head">
          <h2>Just landed</h2>
          <Link href="/shop?sort=new" className="link-btn">View all →</Link>
        </div>
        <div className="grid">
          {latest.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="preorder-band">
          <div>
            <span className="eyebrow">Preorders open</span>
            <h2>Reserve upcoming releases with a {site.preorderDepositPct}% advance</h2>
            <p>
              Pay a small advance by bKash or Nagad, the rest on delivery. Looking for something we don&apos;t list?
              Tell us and we&apos;ll try to source it.
            </p>
          </div>
          <Link href="/preorders" className="btn btn-lg btn-primary">See preorders</Link>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Collector picks</h2>
          <Link href="/shop" className="link-btn">Shop all →</Link>
        </div>
        <div className="grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Shop by budget</h2>
        </div>
        <div className="budget">
          {PRICE_BRACKETS.map((b) => (
            <Link key={b.id} href={`/shop?price=${b.id}`} className="budget-tile">
              {b.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Shop by category</h2>
        </div>
        <div className="cats">
          {CATEGORIES.map((c) => {
            const n = products.filter((p) => p.category === c.id).length;
            return (
              <Link key={c.id} href={`/shop?category=${c.id}`} className={`cat cat-${c.id}`}>
                <strong>{c.name}</strong>
                <span>{c.blurb}</span>
                <em>{n ? `${n} items` : "Coming soon"}</em>
              </Link>
            );
          })}
        </div>
      </section>

      {upcoming.length > 0 && (
        <section className="container section">
          <div className="section-head">
            <h2>Coming soon</h2>
            <Link href="/preorders" className="link-btn">All preorders →</Link>
          </div>
          <div className="grid">
            {upcoming.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="container section">
        <div className="how">
          <h2>How ordering works</h2>
          <ol className="steps">
            <li><strong>Add to cart</strong><span>Pick your cars and place the order. No payment online.</span></li>
            <li><strong>We confirm</strong><span>We call or WhatsApp you to confirm stock and address.</span></li>
            <li>
              <strong>Pay your way</strong>
              <span>Cash on delivery, bKash or Nagad. Free delivery over {formatPrice(site.freeShippingThreshold)}.</span>
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}
