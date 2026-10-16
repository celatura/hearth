export const CATEGORIES = [
  "All",
  "Decor",
  "Textiles",
  "Kitchen & Dining",
  "Lighting",
] as const;

export type CategoryFilter = (typeof CATEGORIES)[number];
export type Category = Exclude<CategoryFilter, "All">;

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  /** Original price when the piece is on sale. */
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: "New" | "Best Seller";
  description: string;
  highlights: string[];
  stock: number;
  image: string;
}

export interface ProductFilters {
  q?: string;
  category?: CategoryFilter;
  sort?: SortOption;
}

export interface CartLine {
  productId: string;
  quantity: number;
}
