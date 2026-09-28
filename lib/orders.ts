import "server-only";
import { counters, getJSON, incr, listJSON, putJSON } from "./db";
import { orderMessage, type OrderInput, type PricedOrder } from "./order";
import { products } from "./products";

export type OrderStatus = "new" | "confirmed" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "unpaid" | "claimed" | "paid";

export type Order = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  address: string;
  area: OrderInput["area"];
  note?: string;
  payment: OrderInput["payment"];
  items: { id: string; name: string; color: string; qty: number; price: number; preorder: boolean }[];
  subtotal: number;
  shipping: number;
  total: number;
  deposit: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  /** bKash/Nagad transaction ID the customer entered. */
  trxId?: string;
  paidAmount?: number;
  history: { at: string; text: string }[];
  message: string;
};

const RESERVED = "reserved";
const key = (id: string) => `order:${id}`;

function newId() {
  const d = new Date();
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[b % 32]).join("");
  return `BDC-${d.toISOString().slice(2, 10).replace(/-/g, "")}-${rand}`;
}

/** How many of each product are still available after active orders. */
export async function availability(): Promise<Record<string, number>> {
  const reserved = await counters(RESERVED);
  return Object.fromEntries(products.map((p) => [p.id, Math.max(0, p.stock - (reserved[p.id] ?? 0))]));
}

/** Reserves stock and saves the order. Returns an error message if something sold out meanwhile. */
export async function createOrder(input: OrderInput, priced: PricedOrder): Promise<Order | { error: string }> {
  const done: { id: string; qty: number }[] = [];
  for (const { product, qty } of priced.items) {
    const now = await incr(RESERVED, product.id, qty);
    done.push({ id: product.id, qty });
    if (now > product.stock) {
      for (const r of done) await incr(RESERVED, r.id, -r.qty);
      return { error: `Sorry, ${product.name} just sold out.` };
    }
  }
  const id = newId();
  const at = new Date().toISOString();
  const order: Order = {
    id,
    createdAt: at,
    name: input.name,
    phone: input.phone,
    address: input.address,
    area: input.area,
    note: input.note || undefined,
    payment: input.payment,
    items: priced.items.map(({ product: p, qty }) => ({
      id: p.id,
      name: p.name,
      color: p.color,
      qty,
      price: p.price,
      preorder: p.status === "preorder",
    })),
    subtotal: priced.subtotal,
    shipping: priced.shipping,
    total: priced.total,
    deposit: priced.deposit,
    status: "new",
    paymentStatus: "unpaid",
    history: [{ at, text: "Order placed" }],
    message: orderMessage(id, input, priced),
  };
  await putJSON(key(id), order, Date.now());
  return order;
}

export const getOrder = (id: string) => getJSON<Order>(key(id));
export const listOrders = () => listJSON<Order>(500);

export async function updateOrder(id: string, change: (o: Order) => string | null) {
  const o = await getOrder(id);
  if (!o) return null;
  const wasCancelled = o.status === "cancelled";
  const text = change(o);
  if (!text) return o;
  if (!wasCancelled && o.status === "cancelled") for (const i of o.items) await incr(RESERVED, i.id, -i.qty);
  o.history.push({ at: new Date().toISOString(), text });
  await putJSON(key(id), o);
  return o;
}
