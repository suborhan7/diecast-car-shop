import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ConfirmButton } from "@/components/ConfirmButton";
import { adminConfigured, isAdmin } from "@/lib/admin";
import { persistent } from "@/lib/db";
import { listOrders, type Order } from "@/lib/orders";
import { formatPrice, PAYMENT_METHODS } from "@/lib/site";
import { logout, markPaid, rejectPayment, setStatus } from "./actions";

export const metadata: Metadata = { title: "Orders", robots: { index: false } };
export const dynamic = "force-dynamic";

const TABS = [
  { id: "all", label: "All", test: (o: Order) => o.status !== "cancelled" },
  { id: "new", label: "New", test: (o: Order) => o.status === "new" },
  { id: "check", label: "Check payment", test: (o: Order) => o.paymentStatus === "claimed" && o.status !== "cancelled" },
  { id: "unpaid", label: "Unpaid", test: (o: Order) => o.paymentStatus !== "paid" && o.status !== "cancelled" },
  { id: "ship", label: "To ship", test: (o: Order) => o.status === "confirmed" },
  { id: "done", label: "Delivered", test: (o: Order) => o.status === "delivered" },
  { id: "cancelled", label: "Cancelled", test: (o: Order) => o.status === "cancelled" },
] as const;

const STATUS_TEXT: Record<Order["status"], string> = {
  new: "New",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
const PAY_TEXT: Record<Order["paymentStatus"], string> = { unpaid: "Unpaid", claimed: "Check payment", paid: "Paid" };

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { timeZone: "Asia/Dhaka", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export default async function Admin({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  if (!adminConfigured())
    return (
      <div className="container page narrow">
        <div className="notice">
          <strong>Set an admin password first.</strong> In Vercel, open your project, go to Settings → Environment
          Variables, add <code>ADMIN_PASSWORD</code> (at least 6 characters), then redeploy.
        </div>
      </div>
    );
  if (!(await isAdmin())) redirect("/admin/login");

  const { tab = "all" } = await searchParams;
  const orders = await listOrders();
  const active = TABS.find((t) => t.id === tab) ?? TABS[0];
  const shown = orders.filter(active.test);
  const live = orders.filter((o) => o.status !== "cancelled");
  const owed = live.reduce((s, o) => s + Math.max(0, o.total - (o.paidAmount ?? 0)), 0);
  const received = live.reduce((s, o) => s + (o.paidAmount ?? 0), 0);

  return (
    <div className="container page admin">
      <div className="section-head">
        <h1>Orders</h1>
        <form action={logout}>
          <button className="link-btn">Log out</button>
        </form>
      </div>
      {!persistent && (
        <div className="notice notice-warn">
          <strong>Orders aren&apos;t saved permanently yet.</strong> Connect a free Upstash Redis database in Vercel
          (Storage → Create Database → Upstash for Redis → connect to this project), then redeploy. Until then, use the
          WhatsApp messages as your record.
        </div>
      )}
      <div className="admin-stats">
        <div><strong>{orders.filter((o) => o.status === "new").length}</strong><span>New orders</span></div>
        <div><strong>{orders.filter((o) => o.paymentStatus === "claimed" && o.status !== "cancelled").length}</strong><span>Payments to check</span></div>
        <div><strong>{formatPrice(received)}</strong><span>Received</span></div>
        <div><strong>{formatPrice(owed)}</strong><span>Still to collect</span></div>
      </div>
      <nav className="pills admin-tabs">
        {TABS.map((t) => (
          <Link key={t.id} href={`/admin?tab=${t.id}`} className={`pill ${t.id === active.id ? "on" : ""}`}>
            {t.label} ({orders.filter(t.test).length})
          </Link>
        ))}
      </nav>
      {shown.length === 0 && <div className="empty"><p className="muted">No orders here.</p></div>}
      <div className="admin-list">
        {shown.map((o) => {
          const due = Math.max(0, o.total - (o.paidAmount ?? 0));
          const pay = PAYMENT_METHODS.find((m) => m.id === o.payment)?.name;
          const wa = `https://wa.me/88${o.phone.replace(/^\+?88/, "")}?text=${encodeURIComponent(`Hi ${o.name}, this is about your order ${o.id}.`)}`;
          return (
            <article key={o.id} className={`panel order order-${o.status}`}>
              <header className="order-head">
                <div>
                  <strong>{o.id}</strong>
                  <span className="muted small"> · {when(o.createdAt)}</span>
                </div>
                <div className="order-badges">
                  <span className={`tag st-${o.status}`}>{STATUS_TEXT[o.status]}</span>
                  <span className={`tag pay-${o.paymentStatus}`}>{PAY_TEXT[o.paymentStatus]}</span>
                </div>
              </header>
              <div className="order-grid">
                <div>
                  <div><strong>{o.name}</strong></div>
                  <div className="order-contact">
                    <a href={`tel:${o.phone}`}>{o.phone}</a> · <a href={wa} target="_blank" rel="noopener">WhatsApp</a>
                  </div>
                  <div className="muted small">{o.address} · {o.area === "inside" ? "Inside Dhaka" : "Outside Dhaka"}</div>
                  {o.note && <div className="small">Note: {o.note}</div>}
                </div>
                <ul className="order-items">
                  {o.items.map((i) => (
                    <li key={i.id}>
                      {i.qty} × {i.name}
                      {i.preorder && <span className="tag tag-pre">Preorder</span>}
                      <span>{formatPrice(i.price * i.qty)}</span>
                    </li>
                  ))}
                  <li className="muted"><span>Delivery</span><span>{o.shipping ? formatPrice(o.shipping) : "Free"}</span></li>
                  <li className="order-total"><span>Total</span><span>{formatPrice(o.total)}</span></li>
                </ul>
              </div>
              <div className="order-pay small">
                Pays by <strong>{pay}</strong>
                {o.deposit > 0 && <> · advance due {formatPrice(o.deposit)}</>}
                {o.paidAmount ? <> · received {formatPrice(o.paidAmount)}</> : null}
                {o.trxId && <> · TrxID <code>{o.trxId}</code></>}
              </div>
              {o.status !== "cancelled" && (
                <div className="order-actions">
                  {o.status === "new" && <StatusButton id={o.id} status="confirmed" label="Confirm" primary />}
                  {o.status === "confirmed" && <StatusButton id={o.id} status="shipped" label="Mark shipped" primary />}
                  {o.status === "shipped" && <StatusButton id={o.id} status="delivered" label="Mark delivered" primary />}
                  {due > 0 && (
                    <form action={markPaid} className="paid-form">
                      <input type="hidden" name="id" value={o.id} />
                      <input name="amount" type="number" min={1} defaultValue={o.paymentStatus === "claimed" && o.deposit && !o.paidAmount ? o.deposit : due} aria-label="Amount received" />
                      <button className="btn btn-sm">Mark paid</button>
                    </form>
                  )}
                  {o.paymentStatus === "claimed" && o.trxId && (
                    <form action={rejectPayment}>
                      <input type="hidden" name="id" value={o.id} />
                      <button className="btn btn-sm btn-ghost">TrxID not found</button>
                    </form>
                  )}
                  {o.status !== "delivered" && <StatusButton id={o.id} status="cancelled" label="Cancel" danger />}
                </div>
              )}
              <details className="order-history small">
                <summary>History</summary>
                <ul>
                  {o.history.map((h, n) => (
                    <li key={n}><span className="muted">{when(h.at)}</span> {h.text}</li>
                  ))}
                </ul>
              </details>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function StatusButton({ id, status, label, primary, danger }: { id: string; status: string; label: string; primary?: boolean; danger?: boolean }) {
  return (
    <form action={setStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      {danger ? (
        <ConfirmButton message="Cancel this order? Its cars go back on sale." className="btn btn-sm btn-danger">
          {label}
        </ConfirmButton>
      ) : (
        <button className={`btn btn-sm ${primary ? "btn-primary" : ""}`}>{label}</button>
      )}
    </form>
  );
}
