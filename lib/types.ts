export type Category = "hot-wheels" | "diecast" | "collectibles" | "rc";

export type Series =
  | "Mainline"
  | "Treasure Hunt"
  | "Super Treasure Hunt"
  | "Car Culture"
  | "Premium"
  | "Boulevard"
  | "Team Transport"
  | "Red Line Club";

/** C-scale condition of the vehicle itself, 10 = factory perfect. */
export type ConditionScore = 10 | 9 | 8 | 7 | 6 | 5;

export type Packaging =
  | "Sealed - Mint Card"
  | "Sealed - Soft Corners"
  | "Sealed - Light Crease"
  | "Sealed - Cracked Blister"
  | "Loose - No Package";

export type BodyStyle = "coupe" | "muscle" | "truck" | "fantasy";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: Category;
  series: Series;
  /** Card sub-series, e.g. "HW Euro". */
  subseries?: string;
  /** Position in the sub-series, e.g. "1/10". */
  cardNumber?: string;
  /** Mainline collector number, e.g. "65/250". */
  collectorNumber?: string;
  year: number;
  color: string;
  /** Hex colour used by the placeholder artwork until a real photo is added. */
  hex: string;
  body: BodyStyle;
  scale: string;
  price: number;
  compareAtPrice?: number;
  condition: {
    score: ConditionScore;
    packaging: Packaging;
    notes: string;
  };
  stock: number;
  status: "in-stock" | "preorder" | "sold-out";
  preorder?: {
    releaseDate: string;
    /** Latest date orders are accepted. */
    closesOn: string;
  };
  /** Optional photo paths under /public, e.g. "/products/twin-mill-1.jpg". */
  images: string[];
  description: string;
  featured?: boolean;
  /** Date listed, used for "Just landed". */
  addedOn?: string;
  /** Marks example listings that should be replaced before launch. */
  sample?: boolean;
  /** Kept in the file but not shown or sold (e.g. no price yet). */
  hidden?: boolean;
}
