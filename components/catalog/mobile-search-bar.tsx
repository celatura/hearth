"use client";

import { SearchField } from "@/components/layout/search-field";

/**
 * Mobile-only search pinned to the bottom of the catalog. It scrolls
 * away naturally at the end of the page instead of covering the footer.
 */
export function MobileSearchBar() {
  return (
    <div className="sticky bottom-0 z-30 border-t border-border/70 bg-background/90 px-4 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur supports-backdrop-filter:bg-background/80 md:hidden">
      <SearchField />
    </div>
  );
}
