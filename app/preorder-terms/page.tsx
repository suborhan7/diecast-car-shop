import type { Metadata } from "next";
import { formatPrice, site } from "@/lib/site";

export const metadata: Metadata = { title: "Preorder terms" };

export default function PreorderTerms() {
  return (
    <div className="container page narrow prose">
      <h1>Preorder terms</h1>
      <p>Preorders let you reserve a car before it arrives in Bangladesh. Here is exactly how it works.</p>
      <h2>Advance payment</h2>
      <p>
        A preorder is confirmed once you pay a {site.preorderDepositPct}% advance by bKash ({site.bkash}) or Nagad (
        {site.nagad}). Use your order number as the reference. The rest is paid on delivery.
      </p>
      <h2>Arrival dates</h2>
      <p>
        Dates on each listing are our best estimate from the supplier. Shipments can arrive early or late. If a car
        is more than 30 days late, you can cancel for a full refund of your advance.
      </p>
      <h2>If we can&apos;t get your car</h2>
      <p>
        Sometimes a case arrives short, or a release is cancelled. If we can&apos;t fill your preorder, we refund your
        full advance within 3 days, or you can choose a different car.
      </p>
      <h2>Cancelling</h2>
      <p>
        You can cancel any time before your car arrives. Advances are refunded in full if you cancel before the
        listing&apos;s closing date. After the closing date, we keep 10% of the order value to cover the reserved
        stock.
      </p>
      <h2>Chase cars</h2>
      <p>
        Treasure Hunts, Super Treasure Hunts and chase pieces can&apos;t be guaranteed in any case, so we only list
        them for preorder when we have confirmed allocation.
      </p>
      <h2>Delivery</h2>
      <p>
        Preorders ship the same way as in-stock orders: {formatPrice(site.shipping.insideDhaka)} inside Dhaka,{" "}
        {formatPrice(site.shipping.outsideDhaka)} outside, free over {formatPrice(site.freeShippingThreshold)}. If you
        order in-stock cars together with a preorder, we ship everything together unless you ask us to split it.
      </p>
    </div>
  );
}
