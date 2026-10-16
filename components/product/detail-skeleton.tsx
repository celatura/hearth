import { Skeleton } from "@/components/ui/skeleton";

export function DetailSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <Skeleton className="aspect-square rounded-lg lg:col-span-7" />
      <div className="lg:col-span-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-5 h-9 w-3/4" />
        <Skeleton className="mt-4 h-4 w-36" />
        <Skeleton className="mt-6 h-7 w-28" />
        <div className="mt-6 space-y-2.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="mt-8 h-11 w-full" />
      </div>
    </div>
  );
}
