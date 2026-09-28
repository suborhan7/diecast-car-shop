import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { preorders } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "Preorders" };

export default function Preorders() {
  const items = preorders().sort((a, b) => a.preorder!.releaseDate.localeCompare(b.preorder!.releaseDate));
  return (
    <div className="container page">
      <h1>Preorders</h1>
      <p className="lead-dark">
        Lock in upcoming releases before they sell out. Reserve with a {site.preorderDepositPct}% advance by bKash or
        Nagad and pay the rest on delivery. If a release is cancelled, your advance is refunded in full.
      </p>
      <ol className="steps">
        <li><strong>Reserve</strong><span>Order before the closing date and pay the advance.</span></li>
        <li><strong>We grade</strong><span>Your car is inspected and photographed when it lands.</span></li>
        <li><strong>It&apos;s delivered</strong><span>Pay the rest on delivery, anywhere in Bangladesh.</span></li>
      </ol>
      <div className="notice">
        <strong>Want something we don&apos;t list?</strong> Tell us the car and we&apos;ll try to source it.{" "}
        <a className="link-btn" href={whatsappLink("Hi! Can you source this car for me: ")} target="_blank" rel="noopener">
          Request a car on WhatsApp →
        </a>
      </div>
      {items.length ? (
        <div className="grid">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty"><h3>No open preorders right now</h3></div>
      )}
    </div>
  );
}
