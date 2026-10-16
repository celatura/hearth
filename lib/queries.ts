import { queryOptions } from "@tanstack/react-query";
import { getProduct, getProducts, getRelatedProducts } from "./api";
import type { ProductFilters } from "./types";

/**
 * Query contracts shared by every consumer. Keys are canonicalized to
 * plain strings so cache entries never fork on equivalent filters
 * (e.g. `category: undefined` vs `category: "All"`).
 */
export const productKeys = {
  all: ["products"] as const,
  list: (filters: ProductFilters) =>
    [
      "products",
      "list",
      filters.q?.trim() ?? "",
      filters.category ?? "All",
      filters.sort ?? "featured",
    ] as const,
  detail: (id: string) => ["products", "detail", id] as const,
  related: (id: string) => ["products", "related", id] as const,
};

export function productsQuery(filters: ProductFilters) {
  return queryOptions({
    queryKey: productKeys.list(filters),
    queryFn: () => getProducts(filters),
  });
}

export function productQuery(id: string) {
  return queryOptions({
    queryKey: productKeys.detail(id),
    queryFn: () => getProduct(id),
  });
}

export function relatedProductsQuery(id: string) {
  return queryOptions({
    queryKey: productKeys.related(id),
    queryFn: () => getRelatedProducts(id),
  });
}
