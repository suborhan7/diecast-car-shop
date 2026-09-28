"use client";

import { useEffect, useState } from "react";

export function Countdown({ to }: { to: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, new Date(to).getTime() - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [to]);
  const s = Math.floor((left ?? 0) / 1000);
  const parts = [
    [Math.floor(s / 3600), "Hrs"],
    [Math.floor((s % 3600) / 60), "Min"],
    [s % 60, "Sec"],
  ] as const;
  return (
    <div className="countdown" aria-label="Time left">
      {parts.map(([v, l]) => (
        <div key={l}>
          <strong>{left === null ? "--" : String(v).padStart(2, "0")}</strong>
          <span>{l}</span>
        </div>
      ))}
    </div>
  );
}
