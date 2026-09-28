"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, clearSession, isAdmin, setSession } from "@/lib/admin";
import { updateOrder, type OrderStatus } from "@/lib/orders";

export async function login(_: unknown, form: FormData) {
  if (!checkPassword(String(form.get("password") ?? ""))) return { error: "Wrong password." };
  await setSession();
  redirect("/admin");
}

export async function logout() {
  await clearSession();
  redirect("/admin/login");
}

const LABEL: Record<OrderStatus, string> = {
  new: "Moved back to new",
  confirmed: "Confirmed with customer",
  shipped: "Handed to courier",
  delivered: "Delivered",
  cancelled: "Cancelled (stock released)",
};

export async function setStatus(form: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = String(form.get("id"));
  const status = String(form.get("status")) as OrderStatus;
  if (!(status in LABEL)) return;
  await updateOrder(id, (o) => {
    if (o.status === status || o.status === "cancelled") return null;
    o.status = status;
    return LABEL[status];
  });
  revalidatePath("/admin");
}

export async function markPaid(form: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = String(form.get("id"));
  const amount = Math.round(Number(form.get("amount")));
  await updateOrder(id, (o) => {
    if (!(amount > 0)) return null;
    o.paidAmount = (o.paidAmount ?? 0) + amount;
    o.paymentStatus = o.paidAmount >= o.total ? "paid" : "claimed";
    return `Payment of ৳${amount.toLocaleString("en-IN")} received${o.trxId ? ` (TrxID ${o.trxId})` : ""}`;
  });
  revalidatePath("/admin");
}

export async function rejectPayment(form: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = String(form.get("id"));
  await updateOrder(id, (o) => {
    if (o.paymentStatus !== "claimed") return null;
    o.paymentStatus = o.paidAmount ? "claimed" : "unpaid";
    const t = o.trxId;
    o.trxId = undefined;
    return `Transaction ID ${t} not found in bKash/Nagad, cleared`;
  });
  revalidatePath("/admin");
}
