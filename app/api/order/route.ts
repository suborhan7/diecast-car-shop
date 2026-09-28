import { NextResponse } from "next/server";
import { BD_PHONE, priceOrder, type OrderInput } from "@/lib/order";
import { createOrder } from "@/lib/orders";
import { PAYMENT_METHODS } from "@/lib/site";

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<OrderInput> | null;
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const input: OrderInput = {
    lines: Array.isArray(body.lines) ? body.lines.slice(0, 50) : [],
    name: clean(body.name, 80),
    phone: clean(body.phone, 20).replace(/[\s-]/g, ""),
    address: clean(body.address, 300),
    area: body.area === "inside" ? "inside" : "outside",
    payment: PAYMENT_METHODS.some((m) => m.id === body.payment) ? body.payment! : "cod",
    note: clean(body.note, 300),
  };

  if (!input.lines.length) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  if (input.name.length < 2) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (!BD_PHONE.test(input.phone))
    return NextResponse.json({ error: "Please enter a valid mobile number, like 01712345678." }, { status: 400 });
  if (input.address.length < 8) return NextResponse.json({ error: "Please enter your full address." }, { status: 400 });

  const priced = priceOrder(input.lines, input.area);
  if ("error" in priced) return NextResponse.json({ error: priced.error }, { status: 409 });

  const order = await createOrder(input, priced);
  if ("error" in order) return NextResponse.json({ error: order.error }, { status: 409 });
  const { id, message } = order;

  // Optional: forward every order to a webhook (Google Sheets Apps Script, Discord, Make, Zapier…).
  const hook = process.env.ORDER_WEBHOOK_URL;
  if (hook) {
    await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...input, ...priced, items: priced.items.map((i) => ({ id: i.product.id, name: i.product.name, qty: i.qty, price: i.product.price })), content: message, text: message }),
    }).catch(() => {});
  }

  return NextResponse.json({ id, message, total: priced.total, deposit: priced.deposit });
}
