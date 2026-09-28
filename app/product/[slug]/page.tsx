import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { Gallery } from "@/components/Gallery";
import { WishButton } from "@/components/WishButton";
import { GradeBadge } from "@/components/GradeBadge";
import { ProductCard } from "@/components/ProductCard";
import { CONDITION_SCALE, PACKAGING_GUIDE } from "@/lib/grading";
import { formatDate, getProduct, products, related } from "@/lib/products";
import { formatPrice, site, whatsappLink } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  return { title: p.color ? `${p.name} (${p.color})` : p.name, description: p.description };
}

export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const grade = CONDITION_SCALE[p.condition.score];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.brand} ${p.name}${p.color ? ` ${p.color}` : ""}`,
    brand: { "@type": "Brand", name: p.brand },
    description: p.description,
    image: p.images,
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "BDT",
      availability:
        p.status === "preorder"
          ? "https://schema.org/PreOrder"
          : p.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/SoldOut",
      itemCondition: p.condition.packaging.startsWith("Sealed")
        ? "https://schema.org/NewCondition"
        : "https://schema.org/UsedCondition",
    },
  };

  return (
    <div className="container page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="crumbs">
        <Link href="/shop">Shop</Link> / <Link href={`/shop?category=${p.category}`}>{p.brand}</Link> / <span>{p.name}</span>
      </nav>
      <div className="pdp">
        <Gallery product={p} />
        <div className="pdp-info">
          <div className="card-meta">
            {p.brand} · {p.subseries ?? p.series} · {p.year} · {p.scale}
          </div>
          <div className="pdp-title">
            <h1>{p.name}</h1>
            <WishButton id={p.id} className="pdp-wish" />
          </div>
          {p.color && <div className="pdp-color">{p.color}</div>}
          <div className="pdp-price">
            {formatPrice(p.price)}
            {p.compareAtPrice && <s>{formatPrice(p.compareAtPrice)}</s>}
          </div>

          {p.preorder ? (
            <div className="notice notice-pre">
              <strong>Preorder.</strong> Expected to arrive {formatDate(p.preorder.releaseDate)}. Reserve with a{" "}
              {site.preorderDepositPct}% advance ({formatPrice((p.price * site.preorderDepositPct) / 100)}) by bKash or
              Nagad, pay the rest on delivery. Orders close {formatDate(p.preorder.closesOn)}. Full refund if the
              release is cancelled.
            </div>
          ) : (
            <div className={`stock ${p.stock > 0 ? "ok" : "out"}`}>
              {p.stock === 1 ? "Only 1 in stock, this exact car" : p.stock > 0 ? `${p.stock} in stock` : "Sold out"}
            </div>
          )}

          <AddToCart product={p} />
          <a
            className="btn btn-ghost block ask-btn"
            href={whatsappLink(`Hi! Is the ${p.brand} ${p.name}${p.color ? ` (${p.color})` : ""} still available? ${site.name} item ${p.id}`)}
            target="_blank"
            rel="noopener"
          >
            Ask about this car on WhatsApp
          </a>

          <div className="grade-card">
            <div className="grade-card-head">
              <h3>Condition report</h3>
              <GradeBadge condition={p.condition} size="lg" />
            </div>
            <dl>
              {p.collectorNumber && (
                <>
                  <dt>Card</dt>
                  <dd>
                    {p.subseries} {p.cardNumber} · Collector #{p.collectorNumber}
                  </dd>
                </>
              )}
              <dt>Vehicle</dt>
              <dd>
                <strong>{grade.short} {grade.label}.</strong> {grade.description}
              </dd>
              <dt>Packaging</dt>
              <dd>
                <strong>{p.condition.packaging}.</strong> {PACKAGING_GUIDE[p.condition.packaging]}
              </dd>
              <dt>Grader notes</dt>
              <dd>{p.condition.notes}</dd>
            </dl>
            <Link href="/grading" className="link-btn">How we grade →</Link>
          </div>

          <p className="pdp-desc">{p.description}</p>
          <ul className="pdp-perks">
            <li>Packed in a box with bubble wrap, never loose in a poly mailer</li>
            <li>
              Delivery {formatPrice(site.shipping.insideDhaka)} inside Dhaka, {formatPrice(site.shipping.outsideDhaka)}{" "}
              outside. Free over {formatPrice(site.freeShippingThreshold)}
            </li>
            <li>Cash on delivery, bKash or Nagad. We call to confirm before you pay</li>
            <li>Returns within 3 days if the car doesn&apos;t match its photos or grade</li>
          </ul>
        </div>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>You might also like</h2>
        </div>
        <div className="grid">
          {related(p).map((r) => (
            <ProductCard key={r.id} product={r} />
          ))}
        </div>
      </section>
    </div>
  );
}
