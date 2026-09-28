"use client";

import Link from "next/link";
import { useState } from "react";
import { CarArt } from "@/components/CarArt";
import { useCart } from "@/components/CartProvider";
import { getProductById } from "@/lib/products";
import { formatPrice, PAYMENT_METHODS, shippingFor, site, whatsappLink, type Area, type PaymentMethod } from "@/lib/site";

type Placed = { id: string; message: string; total: number; deposit: number; payment: PaymentMethod; phone: string };

function TrxForm({ id, phone }: { id: string; phone: string }) {
  const [trx, setTrx] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | string>("idle");
  async function send(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    const res = await fetch("/api/order/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, phone, trxId: trx }),
    }).catch(() => null);
    const data = res ? await res.json().catch(() => ({})) : {};
    setState(res?.ok ? "done" : data.error ?? "Something went wrong. Please send the ID on WhatsApp.");
  }
  if (state === "done")
    return <p className="trx-done">Thanks! We&apos;ll check transaction {trx.toUpperCase()} and confirm your payment.</p>;
  return (
    <form className="trx-form" onSubmit={send}>
      <input value={trx} onChange={(e) => setTrx(e.target.value)} placeholder="Transaction ID, e.g. 9K7A3B2C1D" required minLength={6} aria-label="Transaction ID" />
      <button className="btn btn-primary" disabled={state === "busy"}>{state === "busy" ? "Sending…" : "I've paid"}</button>
      {state !== "idle" && state !== "busy" && <p className="error">{state}</p>}
    </form>
  );
}

export default function Checkout() {
  const { lines, ready, clear } = useCart();
  const [area, setArea] = useState<Area>("inside");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Placed | null>(null);

  const items = lines
    .map((l) => ({ ...l, product: getProductById(l.id) }))
    .filter((l): l is typeof l & { product: NonNullable<typeof l.product> } => !!l.product);
  const subtotal = items.reduce((s, l) => s + l.product.price * l.qty, 0);
  const shipping = shippingFor(subtotal, area);
  const deposit = Math.ceil(
    (items.filter((i) => i.product.status === "preorder").reduce((s, i) => s + i.product.price * i.qty, 0) *
      site.preorderDepositPct) /
      100,
  );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines,
          area,
          payment,
          name: f.get("name"),
          phone: f.get("phone"),
          address: f.get("address"),
          note: f.get("note"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not place the order.");
      setPlaced({ ...data, payment, phone: String(f.get("phone")).replace(/[\s-]/g, "") });
      clear();
      window.scrollTo({ top: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place the order.");
    } finally {
      setBusy(false);
    }
  }

  if (placed)
    return (
      <div className="container page narrow">
        <div className="empty placed">
          <div className="success-icon">✓</div>
          <h1>Order {placed.id} received</h1>
          <p className="muted">
            One last step: tap the button below to send your order to us on WhatsApp. We&apos;ll call you to confirm
            before anything is charged.
          </p>
          <a className="btn btn-lg btn-whatsapp" href={whatsappLink(placed.message)} target="_blank" rel="noopener">
            Send order on WhatsApp
          </a>
          {(placed.payment !== "cod" || placed.deposit > 0) && (
            <div className="notice pay-note">
              {placed.deposit > 0 ? (
                <>
                  Your preorder advance is <strong>{formatPrice(placed.deposit)}</strong>.{" "}
                </>
              ) : (
                <>
                  Order total <strong>{formatPrice(placed.total)}</strong>.{" "}
                </>
              )}
              After we confirm, use <strong>Send Money</strong> to bKash or Nagad <strong>{site.bkash}</strong>{" "}
              with <strong>{placed.id}</strong> as the reference, then enter the transaction ID below.
              <TrxForm id={placed.id} phone={placed.phone} />
            </div>
          )}
          <pre className="order-text">{placed.message}</pre>
          <Link href="/shop" className="link-btn">Keep shopping</Link>
        </div>
      </div>
    );

  if (!ready) return <div className="container page" />;

  if (!items.length)
    return (
      <div className="container page">
        <div className="empty">
          <h1>Your cart is empty</h1>
          <Link href="/shop" className="btn btn-primary">Browse the shop</Link>
        </div>
      </div>
    );

  return (
    <div className="container page">
      <h1>Checkout</h1>
      <form className="cart" onSubmit={submit}>
        <div className="checkout-form">
          <section className="panel">
            <h3>Delivery details</h3>
            <label className="field">
              <span>Full name</span>
              <input name="name" required autoComplete="name" placeholder="Your name" />
            </label>
            <label className="field">
              <span>Mobile number</span>
              <input name="phone" required type="tel" inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" pattern="(\+?88)?01[3-9][0-9]{8}" title="Bangladeshi mobile number, like 01712345678" />
            </label>
            <label className="field">
              <span>Full address</span>
              <textarea name="address" required rows={3} placeholder="House, road, area, thana, district" />
            </label>
            <div className="field">
              <span>Delivery area</span>
              <div className="choice-row">
                {(
                  [
                    ["inside", "Inside Dhaka", site.shipping.insideDhaka],
                    ["outside", "Outside Dhaka", site.shipping.outsideDhaka],
                  ] as const
                ).map(([id, label, fee]) => (
                  <label key={id} className={`choice ${area === id ? "on" : ""}`}>
                    <input type="radio" name="area" checked={area === id} onChange={() => setArea(id)} />
                    <strong>{label}</strong>
                    <span>{subtotal >= site.freeShippingThreshold ? "Free" : formatPrice(fee)}</span>
                  </label>
                ))}
              </div>
            </div>
            <label className="field">
              <span>Note (optional)</span>
              <input name="note" placeholder="Anything we should know?" />
            </label>
          </section>
          <section className="panel">
            <h3>Payment</h3>
            <div className="choice-col">
              {PAYMENT_METHODS.map((m) => (
                <label key={m.id} className={`choice ${payment === m.id ? "on" : ""}`}>
                  <input type="radio" name="payment" checked={payment === m.id} onChange={() => setPayment(m.id)} />
                  <strong className={`pm pm-${m.id}`}>{m.name}</strong>
                  <span>{m.note}</span>
                </label>
              ))}
            </div>
            {deposit > 0 && (
              <p className="notice notice-pre small">
                Your cart has preorder items. We&apos;ll ask for a {site.preorderDepositPct}% advance of{" "}
                <strong>{formatPrice(deposit)}</strong> by bKash or Nagad after confirming. The rest is paid on delivery.
              </p>
            )}
          </section>
        </div>
        <aside className="summary">
          <h3>Your order</h3>
          {items.map(({ product: p, qty }) => (
            <div key={p.id} className="mini-line">
              <div className="mini-thumb">
                <CarArt product={p} />
              </div>
              <div>
                <div className="small"><strong>{p.name}</strong></div>
                <div className="muted small">Qty {qty}{p.preorder ? " · Preorder" : ""}</div>
              </div>
              <span className="small">{formatPrice(p.price * qty)}</span>
            </div>
          ))}
          <div className="row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="row"><span>Delivery</span><span>{shipping ? formatPrice(shipping) : "Free"}</span></div>
          <div className="row total"><span>Total</span><span>{formatPrice(subtotal + shipping)}</span></div>
          <button className="btn btn-lg btn-primary block" disabled={busy}>
            {busy ? "Placing order…" : "Place order"}
          </button>
          {error && <p className="error">{error}</p>}
          <p className="muted small center">No payment now. We call to confirm first.</p>
        </aside>
      </form>
    </div>
  );
}
