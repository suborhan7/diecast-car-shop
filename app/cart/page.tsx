"use client";

import Link from "next/link";
import { CarArt } from "@/components/CarArt";
import { useCart } from "@/components/CartProvider";
import { GradeBadge } from "@/components/GradeBadge";
import { formatDate, getProductById } from "@/lib/products";
import { formatPrice, site } from "@/lib/site";

export default function CartPage() {
  const { lines, setQty, remove, ready } = useCart();
  const items = lines
    .map((l) => ({ ...l, product: getProductById(l.id) }))
    .filter((l): l is typeof l & { product: NonNullable<typeof l.product> } => !!l.product);
  const subtotal = items.reduce((s, l) => s + l.product.price * l.qty, 0);
  const toFree = site.freeShippingThreshold - subtotal;

  if (!ready) return <div className="container page" />;

  if (!items.length)
    return (
      <div className="container page">
        <div className="empty">
          <h1>Your cart is empty</h1>
          <p className="muted">Find something for the collection.</p>
          <Link href="/shop" className="btn btn-primary">Browse the shop</Link>
        </div>
      </div>
    );

  return (
    <div className="container page">
      <h1>Your cart</h1>
      <div className="cart">
        <div className="cart-lines">
          {items.map(({ product: p, qty }) => (
            <div key={p.id} className="cart-line">
              <Link href={`/product/${p.slug}`} className="cart-thumb">
                <CarArt product={p} />
              </Link>
              <div className="cart-info">
                <Link href={`/product/${p.slug}`} className="cart-name">{p.name}</Link>
                <div className="muted small">{[p.subseries ?? p.series, p.color].filter(Boolean).join(" · ")}</div>
                <div className="cart-badges">
                  <GradeBadge condition={p.condition} />
                  {p.preorder && <span className="tag tag-pre">Preorder · {formatDate(p.preorder.releaseDate)}</span>}
                </div>
              </div>
              <div className="cart-qty">
                {p.stock > 1 ? (
                  <div className="qty">
                    <button onClick={() => setQty(p.id, qty - 1)} aria-label="Decrease">−</button>
                    <span>{qty}</span>
                    <button onClick={() => setQty(p.id, Math.min(p.stock, qty + 1))} aria-label="Increase">+</button>
                  </div>
                ) : (
                  <span className="muted small">One of a kind</span>
                )}
                <button className="link-btn small" onClick={() => remove(p.id)}>Remove</button>
              </div>
              <div className="cart-price">{formatPrice(p.price * qty)}</div>
            </div>
          ))}
        </div>
        <aside className="summary">
          <h3>Order summary</h3>
          {toFree > 0 && (
            <div className="ship-meter">
              <span>Add {formatPrice(toFree)} more for free delivery</span>
              <div><i style={{ width: `${Math.min(100, (subtotal / site.freeShippingThreshold) * 100)}%` }} /></div>
            </div>
          )}
          <div className="row total"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="row small muted">
            <span>Delivery</span>
            <span>{toFree <= 0 ? "Free" : `${formatPrice(site.shipping.insideDhaka)} to ${formatPrice(site.shipping.outsideDhaka)}`}</span>
          </div>
          <Link href="/checkout" className="btn btn-lg btn-primary block">
            Proceed to checkout
          </Link>
          <p className="muted small center">Cash on delivery, bKash or Nagad</p>
        </aside>
      </div>
    </div>
  );
}
