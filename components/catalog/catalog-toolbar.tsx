"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, SORT_OPTIONS } from "@/lib/types";
import type { CategoryFilter, SortOption } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CatalogToolbarProps {
  activeCategory: CategoryFilter;
  sort: SortOption;
}

/**
 * Sticky filter row: category chips + sort select. Both write to URL
 * search params — the catalog's single source of truth.
 */
export function CatalogToolbar({ activeCategory, sort }: CatalogToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = (key: "category" | "sort", value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : "/", { scroll: false });
  };

  return (
    <div className="sticky top-14 z-30 border-b border-border/70 bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/80 md:top-16">
      <div className="shell flex items-center gap-3 py-3">
        <div
          role="group"
          aria-label="Filter by category"
          className="flex flex-1 gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {CATEGORIES.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() =>
                  update("category", category === "All" ? null : category)
                }
                className={cn(
                  "h-8 shrink-0 rounded-full border px-3.5 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-foreground/25 hover:text-foreground",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>

        <Select
          value={sort}
          onValueChange={(value) =>
            update("sort", value === "featured" ? null : value)
          }
        >
          <SelectTrigger
            aria-label="Sort products"
            className="h-8 shrink-0 rounded-full bg-card text-sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
