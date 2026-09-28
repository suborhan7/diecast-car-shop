import type { Metadata } from "next";
import { formatPrice, site } from "@/lib/site";

export const metadata: Metadata = { title: "Delivery & payment" };

export default function Policies() {
  return (
    <div className="container page narrow prose">
      <h1>Delivery &amp; payment</h1>
      <h2>How ordering works</h2>
      <p>
        Place your order on the site, then send it to us on WhatsApp with one tap. We call or message you to confirm
        that everything is correct before you pay anything.
      </p>
      <h2>Delivery</h2>
      <p>
        We deliver all over Bangladesh. Delivery is {formatPrice(site.shipping.insideDhaka)} inside Dhaka (1 to 2 days)
        and {formatPrice(site.shipping.outsideDhaka)} outside Dhaka (2 to 4 days), and free on orders over{" "}
        {formatPrice(site.freeShippingThreshold)}. Confirmed orders are packed and handed to the courier within 24
        hours. Every car is packed in a box with bubble wrap.
      </p>
      <h2>Payment</h2>
      <p>
        Pay cash on delivery, or by bKash ({site.bkash}) or Nagad ({site.nagad}) after we confirm your order. Use your
        order number as the reference.
      </p>
      <h2>Preorders</h2>
      <p>
        Preorders are reserved with a {site.preorderDepositPct}% advance by bKash or Nagad. The rest is paid on
        delivery. If a release is cancelled or we can&apos;t get your car, the advance is refunded in full.
      </p>
      <h2 id="returns">Returns</h2>
      <p>
        Check your parcel in front of the rider if you can. If a car doesn&apos;t match its photos or condition grade,
        tell us within 3 days of delivery and we&apos;ll replace it or refund you, including delivery.
      </p>
      <h2>Contact</h2>
      <p>
        Call {site.phone}, message us on WhatsApp, or email <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </div>
  );
}
