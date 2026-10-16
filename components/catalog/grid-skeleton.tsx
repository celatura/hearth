import { Skeleton } from "@/components/ui/skeleton";

const CHIP_WIDTHS = ["w-14", "w-18", "w-22", "w-26", "w-20"];

/** Result-area skeleton: count line + card grid. */
export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div>
      <Skeleton className="mb-6 h-4 w-32" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>
            <Skeleton className="aspect-square rounded-lg" />
            <div className="mt-3 flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-4 w-1/5" />
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Full-page fallback for the home route: toolbar row + grid. */
export function CatalogSkeleton() {
  return (
    <div>
      <div className="border-b border-border/70">
        <div className="shell flex items-center gap-2 py-3">
          {CHIP_WIDTHS.map((width) => (
            <Skeleton key={width} className={`h-8 rounded-full ${width}`} />
          ))}
        </div>
      </div>
      <div className="shell py-8">
        <GridSkeleton />
      </div>
    </div>
  );
}
