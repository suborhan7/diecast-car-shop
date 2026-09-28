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

// After the video, a starting-grid race plays: five red lights, lights out, three cars launch.
const LIGHT_EVERY = 700; // ms between lights
const FIRST_LIGHT = 800;
const LIGHTS_OUT = FIRST_LIGHT + 5 * LIGHT_EVERY + 600;
const RACE_LENGTH = LIGHTS_OUT + 2600;

const CARS = [
  { body: "var(--accent-bright)", num: "24", ink: "#08140f" },
  { body: "var(--hi)", num: "07", ink: "#fff" },
  { body: "#f2f3f5", num: "71", ink: "#0b6b4a" },
];

function RaceCar({ body, num, ink, id }: { body: string; num: string; ink: string; id: string }) {
  return (
    <svg viewBox="0 0 320 96" className="race-car-svg" aria-hidden="true">
      <defs>
        <linearGradient id={`shine-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".35" stopColor="#fff" stopOpacity=".08" />
          <stop offset="1" stopColor="#000" stopOpacity=".35" />
        </linearGradient>
        <radialGradient id={`rim-${id}`}>
          <stop offset="0" stopColor="#d9dde3" />
          <stop offset=".6" stopColor="#6b717c" />
          <stop offset="1" stopColor="#2a2d33" />
        </radialGradient>
      </defs>
      <ellipse cx="160" cy="84" rx="150" ry="7" fill="#000" opacity=".55" />
      <path d="M12 70 C12 61 24 56 50 54 L104 51 C120 40 140 35 172 35 C200 35 218 41 236 50 L286 55 C300 57 310 63 310 70 L308 76 L12 76 Z" fill={body} />
      <path d="M12 70 C12 61 24 56 50 54 L104 51 C120 40 140 35 172 35 C200 35 218 41 236 50 L286 55 C300 57 310 63 310 70 L308 76 L12 76 Z" fill={`url(#shine-${id})`} />
      <path d="M118 51 C130 42 148 39 170 39 C190 39 206 44 220 51 Z" fill="#0d1016" />
      <path d="M128 50 C136 44 148 41 162 41 L158 50 Z" fill="#fff" opacity=".2" />
      <path d="M22 64 L300 64" stroke="#000" strokeOpacity=".25" strokeWidth="2" />
      <rect x="292" y="58" width="12" height="5" rx="2" fill="#fff" />
      <rect x="14" y="58" width="9" height="5" rx="2" fill="#ff2436" />
      <path d="M20 55 L24 44 L54 44 L54 53" fill="none" stroke="#0d1016" strokeWidth="4" />
      <text x="150" y="66" fontFamily="Archivo Variable, Arial" fontWeight="900" fontStyle="italic" fontSize="20" fill={ink}>
        {num}
      </text>
      {[78, 250].map((x) => (
        <g key={x} className="race-wheel">
          <circle cx={x} cy="76" r="18" fill="#08090b" />
          <circle cx={x} cy="76" r="10" fill={`url(#rim-${id})`} />
          <path d={`M${x - 9} 76 H${x + 9} M${x} 67 V85`} stroke="#2a2d33" strokeWidth="2" />
        </g>
      ))}
    </svg>
  );
}

export function HeroVideo({ count }: { count: number }) {
  const video = useRef<HTMLVideoElement>(null);
  const bars = useRef<(HTMLElement | null)[]>([]);
  const raceStart = useRef(0);
  const [shot, setShot] = useState(0);
  const [size, setSize] = useState<"1920" | "810x1080" | null>(null);
  const [phase, setPhase] = useState<"video" | "race">("video");
  const [lights, setLights] = useState(0);
  const [go, setGo] = useState(false);

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

  // The race: lights come on one by one, go out, cars launch, then the video starts again.
  useEffect(() => {
    if (phase !== "race") return;
    raceStart.current = performance.now();
    setLights(0);
    setGo(false);
    const timers = [
      ...[1, 2, 3, 4, 5].map((n) => setTimeout(() => setLights(n), FIRST_LIGHT + (n - 1) * LIGHT_EVERY)),
      setTimeout(() => {
        setLights(0);
        setGo(true);
      }, LIGHTS_OUT),
      setTimeout(() => {
        const v = video.current;
        if (v) {
          v.currentTime = 0;
          v.play().catch(() => {});
        }
        setPhase("video");
      }, RACE_LENGTH),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // Keep the headline line and the progress bars in step with the video and the race.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const v = video.current;
      if (v && phase === "video") {
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
        if (bars.current[SHOTS.length]) bars.current[SHOTS.length]!.style.width = "0%";
      } else if (phase === "race") {
        const p = (performance.now() - raceStart.current) / RACE_LENGTH;
        const el = bars.current[SHOTS.length];
        if (el) el.style.width = `${Math.min(1, p) * 100}%`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const kicker = phase === "race" ? (go ? "Lights out!" : "On the grid.") : SHOTS[shot].line;

  return (
    <section className={`vhero ${phase === "race" ? "is-race" : ""}`}>
      <div className="vhero-media" aria-hidden="true">
        <video
          ref={video}
          muted
          playsInline
          autoPlay
          preload="auto"
          onEnded={() => setPhase("race")}
          poster={size === "810x1080" ? "/hero/poster-810.jpg" : "/hero/poster-1920.jpg"}
        >
          {size && <source src={`/hero/hero-${size}.mp4`} type="video/mp4" />}
          {size && <source src={`/hero/hero-${size}.webm`} type="video/webm" />}
        </video>
        <div className={`race ${go ? "go" : ""}`}>
          <div className="race-track">
            <div className="race-lane" style={{ top: "33%" }} />
            <div className="race-lane" style={{ top: "66%" }} />
            <div className="race-line" />
            {CARS.map((c, i) => (
              <div key={c.num} className="race-car" style={{ top: `${6 + i * 33}%`, transitionDelay: `${i * 90}ms` }}>
                <span className="race-smoke" />
                <RaceCar {...c} id={c.num} />
              </div>
            ))}
          </div>
          <div className="race-gantry">
            {[1, 2, 3, 4, 5].map((n) => (
              <i key={n} className={lights >= n ? "on" : ""} />
            ))}
          </div>
        </div>
        <div className="vhero-shade" />
      </div>
      <div className="container vhero-text">
        <span className="eyebrow">Bengal Diecast Club · Dhaka</span>
        <h1>
          <span key={kicker} className="vhero-kicker">
            {kicker}
          </span>
          <span className="vhero-title">
            Small cars.<br /><em>Big legends.</em>
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
        {[...SHOTS, { at: -1 }].map((s, k) => (
          <i key={s.at}>
            <b ref={(el) => void (bars.current[k] = el)} />
          </i>
        ))}
      </div>
    </section>
  );
}
