"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CatalogToolbar } from "@/components/catalog/catalog-toolbar";
import { GridSkeleton } from "@/components/catalog/grid-skeleton";
import { MobileSearchBar } from "@/components/catalog/mobile-search-bar";
import { ProductCard } from "@/components/catalog/product-card";
import { QueryErrorBoundary } from "@/components/query-error-boundary";
import { Button } from "@/components/ui/button";
import { productsQuery } from "@/lib/queries";
import { CATEGORIES, SORT_OPTIONS } from "@/lib/types";
import type { CategoryFilter, ProductFilters, SortOption } from "@/lib/types";

function parseFilters(searchParams: URLSearchParams): ProductFilters {
  const q = searchParams.get("q")?.trim() ?? "";
  const categoryParam = searchParams.get("category") ?? "";
  const sortParam = searchParams.get("sort") ?? "";

  const category: CategoryFilter = (
    CATEGORIES as readonly string[]
  ).includes(categoryParam)
    ? (categoryParam as CategoryFilter)
    : "All";

  const sort: SortOption = SORT_OPTIONS.some(
    (option) => option.value === sortParam,
  )
    ? (sortParam as SortOption)
    : "featured";

  return { q: q || undefined, category, sort };
}

/**
 * Catalog shell: toolbar stays interactive while only the results area
 * suspends when filters change.
 */
export function CatalogView() {
  const searchParams = useSearchParams();
  const filters = parseFilters(searchParams);

  return (
    <div>
      <CatalogToolbar
        activeCategory={filters.category ?? "All"}
        sort={filters.sort ?? "featured"}
      />

      <div className="shell py-8">
        <Suspense fallback={<GridSkeleton />}>
          <QueryErrorBoundary>
            <ProductResults filters={filters} />
          </QueryErrorBoundary>
        </Suspense>
      </div>

      <MobileSearchBar />
    </div>
  );
}

function ProductResults({ filters }: { filters: ProductFilters }) {
  const { data: products } = useSuspenseQuery(productsQuery(filters));

  const q = filters.q?.trim() ?? "";
  const category = filters.category ?? "All";

  if (products.length === 0) {
    return <EmptyResults query={q} />;
  }

  const countLabel = q
    ? `${products.length} ${products.length === 1 ? "piece" : "pieces"} matching “${q}”`
    : category !== "All"
      ? `${products.length} ${products.length === 1 ? "piece" : "pieces"} in ${category}`
      : `All ${products.length} pieces`;

  return (
    <>
      <p aria-live="polite" className="mb-6 text-sm text-muted-foreground">
        {countLabel}
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index < 4}
          />
        ))}
      </div>
    </>
  );
}

function EmptyResults({ query }: { query: string }) {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-md py-14 text-center">
      <p className="font-heading text-2xl">No pieces match your search</p>
      <p className="mt-3 text-sm text-pretty text-muted-foreground">
        {query
          ? `Nothing here is called “${query}”. Try “linen”, “lamp”, or “oak” instead.`
          : "Nothing matches these filters yet."}
      </p>
      <Button
        variant="outline"
        className="mt-6 h-10 px-5"
        onClick={() => router.replace("/", { scroll: false })}
      >
        Clear search and filters
      </Button>
    </div>
  );
}
