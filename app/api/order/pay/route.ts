import { NextResponse } from "next/server";
import { updateOrder } from "@/lib/orders";

/** Customer reports a bKash/Nagad payment. The owner still checks it against their SMS before marking it paid. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { id?: string; phone?: string; trxId?: string } | null;
  const trxId = String(body?.trxId ?? "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 20);
  const phone = String(body?.phone ?? "").replace(/[\s-]/g, "");
  if (!body?.id || trxId.length < 6)
    return NextResponse.json({ error: "Please enter the transaction ID from your bKash or Nagad SMS." }, { status: 400 });

  let ok = false;
  const order = await updateOrder(String(body.id), (o) => {
    if (o.phone !== phone) return null;
    ok = true;
    if (o.paymentStatus === "paid" || o.trxId === trxId) return null;
    o.trxId = trxId;
    o.paymentStatus = "claimed";
    return `Customer sent transaction ID ${trxId}`;
  });
  if (!order || !ok) return NextResponse.json({ error: "We couldn't find that order." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
