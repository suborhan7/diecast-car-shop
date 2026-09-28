"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { CarArt } from "./CarArt";

export function Gallery({ product }: { product: Product }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const hasPhoto = product.images.length > 0;
  return (
    <div className="gallery">
      <div
        className={`pdp-media ${hasPhoto ? "has-photo" : ""} ${zoom ? "zoomed" : ""}`}
        onMouseMove={(e) => {
          if (!hasPhoto) return;
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseLeave={() => setZoom(null)}
        style={zoom ? ({ "--zx": `${zoom.x}%`, "--zy": `${zoom.y}%` } as React.CSSProperties) : undefined}
      >
        <CarArt product={product} index={i} className="pdp-art" />
        {hasPhoto && <span className="real-photo">Real photo of this exact car</span>}
      </div>
      {product.images.length > 1 && (
        <div className="thumbs">
          {product.images.map((src, n) => (
            <button key={src} className={n === i ? "on" : ""} onClick={() => setI(n)} aria-label={`Photo ${n + 1}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
