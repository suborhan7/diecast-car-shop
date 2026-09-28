import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container page">
      <div className="empty">
        <h1>Wrong turn</h1>
        <p className="muted">That page isn&apos;t in the garage.</p>
        <Link href="/shop" className="btn btn-primary">Go to the shop</Link>
      </div>
    </div>
  );
}
