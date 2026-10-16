import Link from "next/link";
import { CATEGORIES } from "@/lib/types";

export function Footer() {
  return (
    <footer className="border-t border-border/70">
      <div className="shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="font-heading text-lg font-semibold">Hearth</p>
          <p className="mt-3 max-w-xs text-sm text-pretty text-muted-foreground">
            Considered objects for everyday living. Twelve pieces across four
            collections, made to be lived with.
          </p>
        </div>

        <nav aria-label="Shop by category" className="text-sm">
          <p className="font-medium">Shop</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            {CATEGORIES.filter((category) => category !== "All").map(
              (category) => (
                <li key={category}>
                  <Link
                    href={`/?category=${encodeURIComponent(category)}`}
                    className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {category}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="text-sm">
          <p className="font-medium">About this demo</p>
          <p className="mt-3 text-pretty text-muted-foreground">
            A storefront prototype with a simulated checkout — no real
            payments, orders, or deliveries.
          </p>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="shell flex flex-col gap-1 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Hearth. Every piece is fictional.</p>
          <p>Built with Next.js, TanStack Query, Zustand, and shadcn/ui.</p>
        </div>
      </div>
    </footer>
  );
}
