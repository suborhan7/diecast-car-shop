import Link from "next/link";
import { formatPrice } from "@/lib/site";
import { formatDate } from "@/lib/products";
import type { Product } from "@/lib/types";
import { CardActions } from "./CardActions";
import { CarArt } from "./CarArt";
import { GradeBadge } from "./GradeBadge";
import { WishButton } from "./WishButton";

const CHASE = new Set(["Treasure Hunt", "Super Treasure Hunt", "Red Line Club"]);

export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.status === "sold-out" || product.stock <= 0;
  const hasPhoto = product.images.length > 0;
  const off = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;
  return (
    <Link href={`/product/${product.slug}`} className={`card ${soldOut ? "is-sold" : ""}`}>
      <div className={`card-media ${hasPhoto ? "has-photo" : ""}`}>
        <CarArt product={product} className="card-art" />
        {product.images[1] && <CarArt product={product} index={1} className="card-art card-art-alt" />}
        <div className="card-tags">
          {product.status === "preorder" && <span className="tag tag-pre">Preorder</span>}
          {CHASE.has(product.series) && <span className="tag tag-chase">{product.series}</span>}
          {off > 0 && <span className="tag tag-sale">-{off}%</span>}
          {soldOut && <span className="tag tag-sold">Sold out</span>}
        </div>
        <WishButton id={product.id} className="card-wish" />
        <span className="scale-chip">{product.scale}</span>
      </div>
      <div className="card-body">
        <div className="card-meta">
          {product.subseries ?? product.series} · {product.year}
          {product.cardNumber && ` · ${product.cardNumber}`}
        </div>
        <h3 className="card-title">{product.name}</h3>
        {product.color && <div className="card-sub">{product.color}</div>}
        <div className="card-foot">
          <div className="price">
            {formatPrice(product.price)}
            {product.compareAtPrice && <s>{formatPrice(product.compareAtPrice)}</s>}
          </div>
          <GradeBadge condition={product.condition} />
        </div>
        {product.preorder && <div className="card-ship">Arrives {formatDate(product.preorder.releaseDate)}</div>}
        {!soldOut && product.stock === 1 && product.status !== "preorder" && <div className="card-last">Only 1 left</div>}
        <CardActions product={product} />
      </div>
    </Link>
  );
}
