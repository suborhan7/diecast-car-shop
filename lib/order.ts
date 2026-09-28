import { getProductById } from "./products";
import { formatPrice, shippingFor, site, type Area, type PaymentMethod, PAYMENT_METHODS } from "./site";
import type { Product } from "./types";

export type OrderInput = {
  lines: { id: string; qty: number }[];
  name: string;
  phone: string;
  address: string;
  area: Area;
  payment: PaymentMethod;
  note?: string;
};

export type PricedOrder = {
  items: { product: Product; qty: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  /** Advance due now for preorder items (paid by bKash/Nagad). */
  deposit: number;
};

/** Bangladeshi mobile number: 01XXXXXXXXX, optionally prefixed with +88/88. */
export const BD_PHONE = /^(?:\+?88)?01[3-9]\d{8}$/;

export function priceOrder(lines: OrderInput["lines"], area: Area): PricedOrder | { error: string } {
  const items: PricedOrder["items"] = [];
  for (const l of lines) {
    const product = getProductById(String(l.id));
    const qty = Math.floor(Number(l.qty));
    if (!product || !(qty > 0)) return { error: "An item in your cart is no longer available." };
    if (product.status === "sold-out" || qty > product.stock)
      return { error: `Sorry, ${product.name} is sold out or has limited stock.` };
    items.push({ product, qty });
  }
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = shippingFor(subtotal, area);
  const preorderValue = items
    .filter((i) => i.product.status === "preorder")
    .reduce((s, i) => s + i.product.price * i.qty, 0);
  return {
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    deposit: Math.ceil((preorderValue * site.preorderDepositPct) / 100),
  };
}

export function orderMessage(id: string, o: OrderInput, p: PricedOrder) {
  const pay = PAYMENT_METHODS.find((m) => m.id === o.payment)?.name ?? o.payment;
  return [
    `New order ${id}`,
    "",
    ...p.items.map(
      (i) =>
        `• ${i.product.name}${i.product.color ? ` (${i.product.color})` : ""} x${i.qty} = ${formatPrice(i.product.price * i.qty)}${
          i.product.status === "preorder" ? " [PREORDER]" : ""
        } [${i.product.id}]`,
    ),
    "",
    `Subtotal: ${formatPrice(p.subtotal)}`,
    `Delivery (${o.area === "inside" ? "inside Dhaka" : "outside Dhaka"}): ${p.shipping ? formatPrice(p.shipping) : "Free"}`,
    `Total: ${formatPrice(p.total)}`,
    ...(p.deposit ? [`Preorder advance due: ${formatPrice(p.deposit)}`] : []),
    `Payment: ${pay}`,
    "",
    `Name: ${o.name}`,
    `Phone: ${o.phone}`,
    `Address: ${o.address}`,
    ...(o.note ? [`Note: ${o.note}`] : []),
  ].join("\n");
}
