import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  reviewCount: number;
  showCount?: boolean;
  className?: string;
}

/**
 * Ink-toned stars keep the rating readable without adding color noise —
 * clay stays reserved for prices and progress.
 */
export function StarRating({
  rating,
  reviewCount,
  showCount = true,
  className,
}: StarRatingProps) {
  const filled = Math.round(rating);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs whitespace-nowrap text-muted-foreground",
        className,
      )}
    >
      <span
        role="img"
        aria-label={`Rated ${rating.toFixed(1)} out of 5 stars`}
        className="inline-flex items-center gap-0.5"
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <StarIcon
            key={index}
            aria-hidden
            className={cn(
              "size-3",
              index < filled
                ? "fill-foreground/85 text-foreground/85"
                : "fill-border text-border",
            )}
          />
        ))}
      </span>
      <span aria-hidden={!showCount && undefined} className="tabular-nums">
        {rating.toFixed(1)}
        {showCount ? ` (${reviewCount})` : ""}
      </span>
    </span>
  );
}
