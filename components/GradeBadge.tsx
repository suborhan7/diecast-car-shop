import { CONDITION_SCALE, gradeTone } from "@/lib/grading";
import type { Product } from "@/lib/types";

export function GradeBadge({ condition, size = "sm" }: { condition: Product["condition"]; size?: "sm" | "lg" }) {
  const g = CONDITION_SCALE[condition.score];
  return (
    <span className={`grade grade-${gradeTone(condition.score)} grade-${size}`} title={g.description}>
      <strong>{g.short}</strong>
      <span>{g.label}</span>
    </span>
  );
}
