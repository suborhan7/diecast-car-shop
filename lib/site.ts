/** Store-wide settings. Change these to rebrand the site. */
export const site = {
  name: "Bengal Diecast Club",
  tagline: "Hand-graded Hot Wheels, die-cast and RC for collectors in Bangladesh",
  email: "hello@example.com",
  phone: "+880 1932-820068",
  /** WhatsApp number in international format, digits only. Orders are sent here. */
  whatsapp: "8801932820068",
  /** Facebook page username for the Messenger button (m.me/<this>). */
  messenger: "yourpage",
  facebook: "https://facebook.com/yourpage",
  instagram: "https://instagram.com/yourpage",
  shipping: { insideDhaka: 80, outsideDhaka: 150 },
  freeShippingThreshold: 3000,
  /** Share of a preorder paid in advance by bKash or Nagad. */
  preorderDepositPct: 30,
  /** Flash sale: products with a compareAtPrice show in a countdown section until this time. Set to null to hide it. */
  flashSaleEndsAt: null as string | null,
  bkash: "01932820068",
  nagad: "01932820068",
};

export const CATEGORIES = [
  { id: "hot-wheels", name: "Hot Wheels", blurb: "Mainlines, Treasure Hunts and premium lines" },
  { id: "diecast", name: "Die-Cast", blurb: "Mini GT, Tomica, Majorette and more" },
  { id: "collectibles", name: "Collectibles", blurb: "Protector cases, dioramas and sets" },
  { id: "rc", name: "RC Toys", blurb: "Remote-controlled cars and trucks" },
] as const;

export const PRICE_BRACKETS = [
  { id: "u500", label: "Under ৳500", min: 0, max: 499 },
  { id: "500", label: "৳500 to ৳999", min: 500, max: 999 },
  { id: "1000", label: "৳1,000 to ৳1,999", min: 1000, max: 1999 },
  { id: "2000", label: "৳2,000 and up", min: 2000, max: Infinity },
] as const;

export const PAYMENT_METHODS = [
  { id: "cod", name: "Cash on Delivery", note: "Pay the rider when your order arrives." },
  { id: "bkash", name: "bKash", note: "Send Money after we confirm your order by phone." },
  { id: "nagad", name: "Nagad", note: "Send Money after we confirm your order by phone." },
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]["id"];
export type Area = "inside" | "outside";

export function formatPrice(n: number) {
  return "৳" + Math.round(n).toLocaleString("en-IN");
}

export function shippingFor(subtotal: number, area: Area) {
  if (subtotal >= site.freeShippingThreshold) return 0;
  return area === "inside" ? site.shipping.insideDhaka : site.shipping.outsideDhaka;
}

export function whatsappLink(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
