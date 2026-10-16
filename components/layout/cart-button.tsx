"use client";

import { ShoppingBagIcon } from "lucide-react";
import { useHydrated } from "@/hooks/use-hydrated";
import { useCartCount, useCartStore } from "@/lib/store/cart";

/**
 * Header cart button with a live item-count badge. The badge waits for
 * hydration so the persisted cart never causes a mismatch.
 */
export function CartButton() {
  const hydrated = useHydrated();
  const count = useCartCount();
  const openSheet = useCartStore((state) => state.openSheet);

  const showBadge = hydrated && count > 0;

  return (
    <button
      type="button"
      onClick={openSheet}
      aria-label={
        showBadge
          ? `Open cart, ${count} ${count === 1 ? "item" : "items"}`
          : "Open cart"
      }
      className="relative inline-flex size-9 items-center justify-center rounded-lg transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <ShoppingBagIcon aria-hidden className="size-5" />
      {showBadge && (
        <span
          aria-hidden
          className="absolute -top-0.5 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-clay px-1 text-[10px] leading-none font-medium text-primary-foreground"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
