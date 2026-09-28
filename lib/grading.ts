import type { ConditionScore, Packaging } from "./types";

export const CONDITION_SCALE: Record<
  ConditionScore,
  { label: string; short: string; description: string }
> = {
  10: {
    label: "Gem Mint",
    short: "C10",
    description:
      "Factory perfect. No paint flaws, tampo misalignment, or wheel issues visible under magnification.",
  },
  9: {
    label: "Near Mint",
    short: "C9",
    description:
      "One tiny factory flaw (a pinprick in paint or a slightly off tampo) that you have to look for.",
  },
  8: {
    label: "Excellent",
    short: "C8",
    description:
      "Minor factory or handling marks visible at arm's length. Still displays beautifully.",
  },
  7: {
    label: "Very Good",
    short: "C7",
    description:
      "Light paint chips or worn tampos. Axles straight, wheels roll true.",
  },
  6: {
    label: "Good",
    short: "C6",
    description:
      "Noticeable play wear: several chips, rubbed edges. Great for customs or play.",
  },
  5: {
    label: "Fair",
    short: "C5",
    description:
      "Heavy wear, possible bent axle or missing parts. Priced accordingly and described in full.",
  },
};

export const PACKAGING_GUIDE: Record<Packaging, string> = {
  "Sealed - Mint Card":
    "Flat card, sharp corners, clear blister firmly attached. Protector-case ready.",
  "Sealed - Soft Corners":
    "Corners show light rounding from shelf or shipping. No creases.",
  "Sealed - Light Crease":
    "A small bend or crease on the card that does not break the printed surface.",
  "Sealed - Cracked Blister":
    "Blister has a crack or dent. Vehicle is still sealed inside.",
  "Loose - No Package": "Vehicle only, removed from original packaging.",
};

export function gradeTone(score: ConditionScore) {
  if (score >= 9) return "top";
  if (score >= 7) return "mid";
  return "low";
}
