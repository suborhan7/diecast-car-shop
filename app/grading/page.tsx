import type { Metadata } from "next";
import { CONDITION_SCALE, PACKAGING_GUIDE, gradeTone } from "@/lib/grading";
import type { ConditionScore, Packaging } from "@/lib/types";

export const metadata: Metadata = { title: "Condition grading" };

export default function Grading() {
  const scores = Object.keys(CONDITION_SCALE).map(Number).sort((a, b) => b - a) as ConditionScore[];
  return (
    <div className="container page narrow">
      <h1>How we grade</h1>
      <p className="lead-dark">
        Every car gets two separate ratings: a C-scale grade for the vehicle and a packaging grade for the card and
        blister. We inspect under a 10x loupe in daylight-balanced light and photograph any flaw we note.
      </p>
      <h2>Vehicle condition (C-scale)</h2>
      <div className="scale">
        {scores.map((s) => (
          <div key={s} className="scale-row">
            <span className={`grade grade-${gradeTone(s)} grade-lg`}>
              <strong>{CONDITION_SCALE[s].short}</strong>
              <span>{CONDITION_SCALE[s].label}</span>
            </span>
            <p>{CONDITION_SCALE[s].description}</p>
          </div>
        ))}
      </div>
      <h2>Packaging condition</h2>
      <div className="scale">
        {(Object.keys(PACKAGING_GUIDE) as Packaging[]).map((k) => (
          <div key={k} className="scale-row">
            <strong className="pack-name">{k}</strong>
            <p>{PACKAGING_GUIDE[k]}</p>
          </div>
        ))}
      </div>
      <div className="notice">
        <strong>Our guarantee.</strong> If a car arrives in worse condition than its listed grade, send it back within
        14 days for a full refund including shipping.
      </div>
    </div>
  );
}
