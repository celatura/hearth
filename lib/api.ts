import { findProductById, products } from "./products";
import type { Product, ProductFilters } from "./types";

/**
 * Simulated API over the static catalog. Every call adds 300–600 ms of
 * latency so loading, retry, and caching behavior is exercised honestly.
 * Swapping in `fetch("/api/...")` later keeps the same signatures.
 */

function networkDelay() {
  const ms = 300 + Math.random() * 300;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<Product[]> {
  await networkDelay();

  let list = [...products];

  const q = filters.q?.trim().toLowerCase();
  if (q) {
    list = list.filter((product) =>
      [product.name, product.description, product.category].some((field) =>
        field.toLowerCase().includes(q),
      ),
    );
  }

  if (filters.category && filters.category !== "All") {
    list = list.filter((product) => product.category === filters.category);
  }

  switch (filters.sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    default:
      // "featured" keeps the curated catalog order.
      break;
  }

  return list;
}

export async function getProduct(id: string): Promise<Product | null> {
  await networkDelay();
  return findProductById(id) ?? null;
}

export async function getRelatedProducts(
  id: string,
  limit = 4,
): Promise<Product[]> {
  await networkDelay();

  const product = findProductById(id);
  if (!product) return [];

  return products
    .filter(
      (candidate) =>
        candidate.category === product.category && candidate.id !== product.id,
    )
    .slice(0, limit);
}
