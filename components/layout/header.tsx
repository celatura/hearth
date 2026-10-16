import Link from "next/link";
import { Suspense } from "react";
import { CartButton } from "@/components/layout/cart-button";
import { SearchField } from "@/components/layout/search-field";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="shell flex h-14 items-center gap-4 md:h-16 md:gap-8">
        <Link
          href="/"
          className="font-heading text-xl font-semibold tracking-tight md:text-2xl"
        >
          Hearth
        </Link>

        <div className="hidden flex-1 justify-center md:flex">
          <Suspense
            fallback={
              <div
                aria-hidden
                className="h-9 w-full max-w-sm rounded-lg border border-input bg-muted/40"
              />
            }
          >
            <SearchField className="w-full max-w-sm" />
          </Suspense>
        </div>

        <div className="ml-auto flex items-center">
          <CartButton />
        </div>
      </div>
    </header>
  );
}
