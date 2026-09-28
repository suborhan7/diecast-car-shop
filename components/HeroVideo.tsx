"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Start time (seconds) of each shot in /public/hero, and the line shown with it.
const SHOTS = [
  { at: 0, line: "Lights on." },
  { at: 3.3, line: "Every curve." },
  { at: 7.5, line: "After dark." },
  { at: 11.2, line: "Pure legend." },
];

export function HeroVideo({ count }: { count: number }) {
  const video = useRef<HTMLVideoElement>(null);
  const bars = useRef<(HTMLElement | null)[]>([]);
  const [shot, setShot] = useState(0);
  const [size, setSize] = useState<"1920" | "810x1080" | null>(null);

  // Pick the wide or tall cut for this screen; the poster shows until then.
  useEffect(() => {
    const small = window.matchMedia("(max-width: 700px)");
    const pick = () => setSize(small.matches ? "810x1080" : "1920");
    pick();
    small.addEventListener("change", pick);
    return () => small.removeEventListener("change", pick);
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v || !size) return;
    v.load();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) v.play().catch(() => {});
  }, [size]);

  // Keep the headline line and the progress bars in step with the video.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const v = video.current;
      if (v) {
        const t = v.currentTime;
        const dur = v.duration || 15.7;
        let i = 0;
        SHOTS.forEach((s, k) => t >= s.at && (i = k));
        setShot((cur) => (cur === i ? cur : i));
        SHOTS.forEach((s, k) => {
          const end = SHOTS[k + 1]?.at ?? dur;
          const el = bars.current[k];
          if (el) el.style.width = `${Math.max(0, Math.min(1, (t - s.at) / (end - s.at))) * 100}%`;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="vhero">
      <div className="vhero-media" aria-hidden="true">
        <video
          ref={video}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          poster={size === "810x1080" ? "/hero/poster-810.jpg" : "/hero/poster-1920.jpg"}
        >
          {size && <source src={`/hero/hero-${size}.webm`} type="video/webm" />}
          {size && <source src={`/hero/hero-${size}.mp4`} type="video/mp4" />}
        </video>
        <div className="vhero-shade" />
        <div className="vhero-grain" />
      </div>
      <div className="container vhero-text">
        <span className="eyebrow">Bengal Diecast Club · Dhaka</span>
        <h1>
          <span key={shot} className="vhero-kicker">
            {SHOTS[shot].line}
          </span>
          <span className="vhero-title">
            Legends in <em>1:64.</em>
          </span>
        </h1>
        <p className="lead">
          Hot Wheels and die-cast, hand-graded and photographed car by car. Cash on delivery anywhere in Bangladesh.
        </p>
        <div className="hero-cta">
          <Link href="/shop" className="btn btn-lg btn-primary">
            Shop {count} cars in stock
          </Link>
          <Link href="/preorders" className="btn btn-lg btn-ghost-light">
            Preorders
          </Link>
        </div>
      </div>
      <div className="container vhero-chapters" aria-hidden="true">
        {SHOTS.map((s, k) => (
          <i key={s.at}>
            <b ref={(el) => void (bars.current[k] = el)} />
          </i>
        ))}
      </div>
    </section>
  );
}
