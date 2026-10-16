import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/components/product/star-rating";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const onSale =
    product.originalPrice != null && product.originalPrice > product.price;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          priority={priority}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
        {(product.badge || onSale) && (
          <div className="absolute top-3 left-3 flex gap-1.5">
            {product.badge && (
              <span className="rounded-full bg-background/85 px-2.5 py-1 text-[11px] leading-none font-medium backdrop-blur-sm">
                {product.badge}
              </span>
            )}
            {onSale && (
              <span className="rounded-full bg-background/85 px-2.5 py-1 text-[11px] leading-none font-medium text-clay backdrop-blur-sm">
                Sale
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 truncate text-sm font-medium underline-offset-4 group-hover:underline">
            {product.name}
          </p>
          <div className="shrink-0 text-right">
            <p className="text-sm tabular-nums">{formatMoney(product.price)}</p>
            {onSale && (
              <p className="mt-0.5 text-xs text-muted-foreground line-through tabular-nums">
                {formatMoney(product.originalPrice!)}
              </p>
            )}
          </div>
        </div>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-xs text-muted-foreground">
            {product.category}
          </p>
          <StarRating
            rating={product.rating}
            reviewCount={product.reviewCount}
            className="shrink-0"
          />
        </div>
      </div>
    </Link>
  );
}
