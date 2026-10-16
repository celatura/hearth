import type { Product } from "./types";

/**
 * The whole catalog — twelve pieces across four collections.
 * Static by design: the demo ships its data, and `lib/api.ts` layers
 * simulated network latency on top so swapping in a real backend later
 * only touches the API layer.
 */
export const products: Product[] = [
  // Decor
  {
    id: "terra-vase",
    name: "Terra Vase",
    category: "Decor",
    price: 42,
    rating: 4.8,
    reviewCount: 124,
    badge: "Best Seller",
    description:
      "A sculptural vessel thrown by hand and finished in matte terracotta. Wide enough for branch displays, quiet enough to sit alone.",
    highlights: [
      "Hand-thrown stoneware with a matte terracotta glaze",
      "16 cm tall — sized for branches or standing alone",
      "Watertight interior glaze",
    ],
    stock: 18,
    image: "/products/terra-vase.webp",
  },
  {
    id: "halo-wall-mirror",
    name: "Halo Wall Mirror",
    category: "Decor",
    price: 119,
    rating: 4.6,
    reviewCount: 58,
    description:
      "A round mirror framed in slim white oak. Softens a hallway or entry without asking for attention.",
    highlights: [
      "Ø 45 cm with a solid white oak frame",
      "Hangs portrait or landscape — hardware included",
      "Low-distortion 4 mm glass",
    ],
    stock: 9,
    image: "/products/halo-wall-mirror.webp",
  },
  {
    id: "amber-no-5-candle",
    name: "Amber No.5 Candle",
    category: "Decor",
    price: 28,
    rating: 4.7,
    reviewCount: 96,
    badge: "New",
    description:
      "Amber glass, a blend of cedar and dry amber. Burns clean for around 45 hours and refills when it's done.",
    highlights: [
      "Cedar, dry amber, and a trace of smoke",
      "About 45 hours of burn time",
      "Refillable amber glass vessel",
    ],
    stock: 24,
    image: "/products/amber-no-5-candle.webp",
  },

  // Textiles
  {
    id: "cloud-linen-throw",
    name: "Cloud Linen Throw",
    category: "Textiles",
    price: 68,
    rating: 4.9,
    reviewCount: 212,
    badge: "Best Seller",
    description:
      "Stonewashed European flax that gets softer with every wash. The throw you keep on the back of the sofa year-round.",
    highlights: [
      "100% European flax linen, stonewashed",
      "130 × 170 cm",
      "Machine washable and softens with use",
    ],
    stock: 32,
    image: "/products/cloud-linen-throw.webp",
  },
  {
    id: "loom-cushion-cover",
    name: "Loom Cushion Cover",
    category: "Textiles",
    price: 34,
    rating: 4.4,
    reviewCount: 47,
    description:
      "A heavyweight woven cover in warm oatmeal. Quiet texture for a sofa corner, with a hidden zip at the base.",
    highlights: [
      "50 × 50 cm in a heavyweight weave",
      "Concealed zip closure",
      "Cover only — insert sold separately",
    ],
    stock: 15,
    image: "/products/loom-cushion-cover.webp",
  },
  {
    id: "fjord-wool-rug",
    name: "Fjord Wool Rug",
    category: "Textiles",
    price: 149,
    originalPrice: 189,
    rating: 4.7,
    reviewCount: 83,
    description:
      "Hand-loomed wool with a subtle herringbone. Dense underfoot, on an ivory ground that keeps rooms light.",
    highlights: [
      "Hand-loomed, 90% wool / 10% cotton",
      "160 × 230 cm",
      "Low profile — safe under doors",
    ],
    stock: 6,
    image: "/products/fjord-wool-rug.webp",
  },

  // Kitchen & Dining
  {
    id: "daybreak-mug",
    name: "Daybreak Mug",
    category: "Kitchen & Dining",
    price: 24,
    rating: 4.8,
    reviewCount: 176,
    badge: "Best Seller",
    description:
      "Speckled stoneware with a cream glaze that shows the maker's hand. Holds a generous 350 ml of whatever starts your day.",
    highlights: [
      "Speckled stoneware, reactive glaze",
      "350 ml — flat white sized",
      "Dishwasher and microwave safe",
    ],
    stock: 40,
    image: "/products/daybreak-mug.webp",
  },
  {
    id: "grain-serving-board",
    name: "Grain Serving Board",
    category: "Kitchen & Dining",
    price: 36,
    rating: 4.6,
    reviewCount: 61,
    badge: "New",
    description:
      "Solid white oak with a carved handle, oiled and ready for bread, cheese, and long dinners.",
    highlights: [
      "Solid white oak with a food-safe oil finish",
      "42 × 18 cm with a carved handle",
      "Hand wash and re-oil occasionally",
    ],
    stock: 11,
    image: "/products/grain-serving-board.webp",
  },
  {
    id: "ember-stoneware-pitcher",
    name: "Ember Stoneware Pitcher",
    category: "Kitchen & Dining",
    price: 48,
    rating: 4.5,
    reviewCount: 39,
    description:
      "A low, wide pitcher glazed in ember brown. Water for the table, or a home for wooden spoons by the stove.",
    highlights: [
      "Reactive ember glaze — no two alike",
      "1.2 L capacity",
      "Just as good holding utensils as pouring",
    ],
    stock: 8,
    image: "/products/ember-stoneware-pitcher.webp",
  },

  // Lighting
  {
    id: "lumen-table-lamp",
    name: "Lumen Table Lamp",
    category: "Lighting",
    price: 89,
    rating: 4.7,
    reviewCount: 145,
    description:
      "A linen shade on a turned oak base. Warm, low light for evenings — no glare, no fuss.",
    highlights: [
      "Turned white oak base with a linen shade",
      "38 cm tall — warm ambient light",
      "Inline switch on a 1.8 m cord",
    ],
    stock: 14,
    image: "/products/lumen-table-lamp.webp",
  },
  {
    id: "orbit-pendant-light",
    name: "Orbit Pendant Light",
    category: "Lighting",
    price: 129,
    rating: 4.6,
    reviewCount: 72,
    badge: "New",
    description:
      "An opal glass globe held in a slim wood ring — a small moon over the dining table.",
    highlights: [
      "Opal glass globe, Ø 25 cm",
      "E27 fitting — bulb not included",
      "2 m braided cable with adjustable drop",
    ],
    stock: 10,
    image: "/products/orbit-pendant-light.webp",
  },
  {
    id: "dusk-wall-sconce",
    name: "Dusk Wall Sconce",
    category: "Lighting",
    price: 59,
    rating: 4.3,
    reviewCount: 28,
    description:
      "Brushed brass with an opal shade. A soft wash of light for hallways and reading corners.",
    highlights: [
      "Brushed brass arm with an opal glass shade",
      "Hardwired — mounting hardware included",
      "Dimmable with compatible switches",
    ],
    stock: 12,
    image: "/products/dusk-wall-sconce.webp",
  },
];

export function findProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}
