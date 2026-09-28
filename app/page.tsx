export const revalidate = 60;

import Link from "next/link";
import { CarArt } from "@/components/CarArt";
import { Countdown } from "@/components/Countdown";
import { ProductCard } from "@/components/ProductCard";
import { inStock, preorders, products } from "@/lib/products";
import { CATEGORIES, formatPrice, PRICE_BRACKETS, site } from "@/lib/site";

export default function Home() {
  const live = inStock();
  const heroes = live.filter((p) => p.images.length && p.featured).slice(0, 3);
  const featured = live.filter((p) => p.featured).slice(0, 8);
  const latest = [...live].sort((a, b) => (b.addedOn ?? "").localeCompare(a.addedOn ?? "")).slice(0, 8);
  const upcoming = preorders().slice(0, 4);
  const saleOn = site.flashSaleEndsAt && new Date(site.flashSaleEndsAt).getTime() > Date.now();
  const deals = saleOn ? live.filter((p) => p.compareAtPrice).slice(0, 4) : [];
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">New drop · {live.length} cars just landed</span>
            <h1>
              The die-cast your shelf deserves,
              <br />
              <span className="accent">photographed car by car.</span>
            </h1>
            <p className="lead">
              Every car you see is the exact one you get: real photos, a condition grade for the car and the card,
              cash on delivery anywhere in Bangladesh.
            </p>
            <div className="hero-cta">
              <Link href="/shop" className="btn btn-lg btn-primary">Shop the collection</Link>
              <Link href="/preorders" className="btn btn-lg btn-ghost-light">Preorder upcoming</Link>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-glow" />
            {heroes.map((p, i) => (
              <Link key={p.id} href={`/product/${p.slug}`} className={`hero-card hero-card-${i}`}>
                <CarArt product={p} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="trust container">
        {[
          ["Real photos", "Every listing shows the exact car you'll receive"],
          ["Cash on delivery", "All over Bangladesh. bKash and Nagad too"],
          ["Boxed & padded", "Cards arrive flat, never loose in a mailer"],
          ["Confirmed by phone", "We call before you pay a single taka"],
        ].map(([t, d]) => (
          <div key={t} className="trust-item">
            <strong>{t}</strong>
            <span>{d}</span>
          </div>
        ))}
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
