import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="logo">
            <span className="logo-mark">BDC</span>
            {site.name}
          </div>
          <p className="muted">{site.tagline}.</p>
          <div className="pay-chips">
            <span>Cash on Delivery</span>
            <span className="chip-bkash">bKash</span>
            <span className="chip-nagad">Nagad</span>
          </div>
        </div>
        <div>
          <h4>Shop</h4>
          <Link href="/shop">All products</Link>
          <Link href="/preorders">Preorders</Link>
          <Link href="/shop?category=rc">RC Toys</Link>
        </div>
        <div>
          <h4>Help</h4>
          <Link href="/grading">Condition grading</Link>
          <Link href="/policies">Delivery &amp; payment</Link>
          <Link href="/policies#returns">Returns</Link>
          <Link href="/preorder-terms">Preorder terms</Link>
          <Link href="/hot-wheels-bangladesh">Hot Wheels in Bangladesh</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>{site.phone}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={site.facebook} target="_blank" rel="noopener">Facebook</a>
          <a href={site.instagram} target="_blank" rel="noopener">Instagram</a>
        </div>
      </div>
      <div className="container footer-bottom muted">
        © {new Date().getFullYear()} {site.name}. Not affiliated with Mattel, Inc. Hot Wheels is a trademark of Mattel.
      </div>
    </footer>
  );
}
