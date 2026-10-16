"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 300;

/**
 * Debounced search input bound to the `q` URL parameter — the single
 * source of truth for catalog filtering. Typing applies after 300 ms;
 * Enter applies immediately. Used by both the desktop header and the
 * mobile bottom bar.
 */
export function SearchField({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [draft, setDraft] = useState(urlQuery);

  // Mirror external URL changes (chips, reset actions, back/forward).
  useEffect(() => {
    setDraft(urlQuery);
  }, [urlQuery]);

  const apply = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = value.trim();
      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }
      const qs = params.toString();
      const target = qs ? `/?${qs}` : "/";
      if (pathname === "/") {
        router.replace(target, { scroll: false });
      } else {
        router.push(target);
      }
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (draft === urlQuery) return;
    const timer = setTimeout(() => apply(draft), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [draft, urlQuery, apply]);

  return (
    <form
      role="search"
      className={cn("relative", className)}
      onSubmit={(event) => {
        event.preventDefault();
        apply(draft);
      }}
    >
      <SearchIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Search the collection"
        aria-label="Search products"
        autoComplete="off"
        className="h-9 rounded-lg bg-card pr-9 pl-9"
      />
      {draft.length > 0 && (
        <button
          type="button"
          onClick={() => {
            setDraft("");
            apply("");
          }}
          aria-label="Clear search"
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <XIcon aria-hidden className="size-4" />
        </button>
      )}
    </form>
  );
}
