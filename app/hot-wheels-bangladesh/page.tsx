import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { inStock } from "@/lib/products";
import { formatPrice, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hot Wheels in Bangladesh: prices, originals and where to buy",
  description:
    "Buy original Hot Wheels in Bangladesh. Real photos of every car, condition graded, cash on delivery nationwide, bKash and Nagad accepted.",
};

const FAQ: [string, string][] = [
  [
    "Where can I buy original Hot Wheels in Bangladesh?",
    `Right here. Every car on ${site.name} is an original Mattel Hot Wheels, photographed and graded before it's listed, and delivered anywhere in Bangladesh with cash on delivery.`,
  ],
  [
    "How much do Hot Wheels cost in Bangladesh?",
    "Regular mainline cars usually cost ৳300 to ৳500. Premium lines like Car Culture and Boulevard cost more, and rare chase cars like Super Treasure Hunts sell for several thousand taka.",
  ],
  [
    "How can I tell if a Hot Wheels car is fake?",
    "Check the card print: originals have sharp text and colours. Look for the Mattel logo and the collector number (like 65/250) on the card. The car's base should have a stamped production code, and the blister should be firmly sealed with no glue marks.",
  ],
  [
    "What do the condition grades mean?",
    "We grade the car from C5 to C10, and the card separately, so you know exactly what you're getting. C10 means factory perfect. See the grading guide for details.",
  ],
  [
    "How long does delivery take?",
    `Confirmed orders are handed to the courier within 24 hours. Delivery takes 1 to 2 days inside Dhaka (${formatPrice(site.shipping.insideDhaka)}) and 2 to 4 days elsewhere (${formatPrice(site.shipping.outsideDhaka)}).`,
  ],
  [
    "Can I preorder upcoming releases?",
    `Yes. Reserve with a ${site.preorderDepositPct}% advance by bKash or Nagad and pay the rest on delivery. See our preorder terms for details.`,
  ],
];

export default function HotWheelsBangladesh() {
  const cars = inStock().filter((p) => p.brand === "Hot Wheels").slice(0, 8);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  return (
    <div className="container page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="narrow">
        <span className="eyebrow">Collector&apos;s guide</span>
        <h1>Hot Wheels in Bangladesh</h1>
        <p className="lead-dark">
          Original Hot Wheels, photographed car by car and graded for condition. Cash on delivery across all 8
          divisions, with bKash and Nagad accepted.
        </p>
      </div>
      <div className="trust guide-trust">
        {[
          ["100% original", "Genuine Mattel cars, never repaints or copies"],
          ["Real photos", "You see the exact car and card you'll receive"],
          ["Ships in 24 hours", "Packed in a box, delivered in 1 to 4 days"],
        ].map(([t, d]) => (
          <div key={t} className="trust-item">
            <strong>{t}</strong>
            <span>{d}</span>
          </div>
        ))}
      </div>
      <section className="section">
        <div className="section-head">
          <h2>In stock now</h2>
          <Link href="/shop?category=hot-wheels" className="link-btn">See all →</Link>
        </div>
        <div className="grid">
          {cars.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <section className="section narrow">
        <h2>Frequently asked questions</h2>
        <div className="faq">
          {FAQ.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
