import type { Product } from "@/lib/types";

// Placeholder artwork drawn in the car's colour. Replaced automatically once
// a product has a photo in its `images` list.
const BODIES: Record<Product["body"], string> = {
  coupe:
    "M18 78 C20 66 34 62 52 60 L78 44 C86 39 96 37 110 37 L150 37 C164 37 176 42 186 52 L200 60 C220 62 236 66 240 74 L242 82 C242 86 238 88 234 88 L24 88 C18 88 16 84 18 78 Z",
  muscle:
    "M14 76 C14 66 22 62 40 60 L70 46 C78 42 88 40 100 40 L154 40 C166 40 176 44 184 52 L194 60 L232 62 C240 63 244 68 244 76 L244 84 C244 87 241 88 238 88 L20 88 C16 88 14 86 14 82 Z",
  truck:
    "M14 80 L14 58 C14 54 17 52 21 52 L62 52 L78 30 C80 27 84 26 88 26 L136 26 C141 26 144 29 144 34 L144 52 L234 52 C240 52 244 56 244 62 L244 84 C244 87 241 88 238 88 L20 88 C16 88 14 85 14 80 Z",
  fantasy:
    "M10 80 C10 70 20 66 36 64 L60 60 L84 36 C88 32 94 30 102 30 L150 30 L170 34 C188 38 200 50 206 60 L236 64 C244 66 248 72 246 80 L244 86 C243 88 240 88 236 88 L16 88 C12 88 10 85 10 80 Z",
};

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, v + amt));
  return `rgb(${c(n >> 16)}, ${c((n >> 8) & 255)}, ${c(n & 255)})`;
}

export function CarArt({ product, className, index = 0 }: { product: Product; className?: string; index?: number }) {
  const src = product.images[index] ?? product.images[0];
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={`${product.brand} ${product.name}`} className={`photo ${className ?? ""}`} loading="lazy" />;
  }
  const id = product.id;
  return (
    <svg viewBox="0 0 260 130" className={className} role="img" aria-label={product.name}>
      <defs>
        <linearGradient id={`b-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shade(product.hex, 50)} />
          <stop offset="0.55" stopColor={product.hex} />
          <stop offset="1" stopColor={shade(product.hex, -60)} />
        </linearGradient>
      </defs>
      <ellipse cx="130" cy="104" rx="112" ry="7" fill="rgba(0,0,0,.18)" />
      <path d={BODIES[product.body]} fill={`url(#b-${id})`} stroke={shade(product.hex, -80)} strokeWidth="1.5" />
      <path
        d={product.body === "truck" ? "M84 32 L136 32 L136 50 L70 50 Z" : "M86 45 L112 42 L150 42 C160 42 170 46 178 54 L90 56 Z"}
        fill="rgba(20,30,45,.75)"
      />
      {[62, 196].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="88" r="17" fill="#15171a" />
          <circle cx={cx} cy="88" r="9" fill="#c9ccd1" />
          <circle cx={cx} cy="88" r="3" fill="#6b6f75" />
        </g>
      ))}
    </svg>
  );
}
