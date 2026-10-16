"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckIcon, ChevronLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { QtyStepper } from "@/components/product/qty-stepper";
import { StarRating } from "@/components/product/star-rating";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import { productQuery } from "@/lib/queries";
import { useCartStore } from "@/lib/store/cart";
import { cn } from "@/lib/utils";

export function ProductDetailView({ id }: { id: string }) {
  const { data: product } = useSuspenseQuery(productQuery(id));
  const addItem = useCartStore((state) => state.addItem);
  const openSheet = useCartStore((state) => state.openSheet);
  const [quantity, setQuantity] = useState(1);

  if (!product) notFound();

  const onSale =
    product.originalPrice != null && product.originalPrice > product.price;
  const lowStock = product.stock > 0 && product.stock <= 6;
  const outOfStock = product.stock === 0;

  const handleAdd = () => {
    addItem(product.id, quantity);
    toast.success(`Added to cart — ${product.name}`, {
      action: { label: "View cart", onClick: () => openSheet() },
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          <ChevronLeftIcon aria-hidden className="size-4" />
          All pieces
        </Link>

        <h1 className="mt-4 font-heading text-3xl font-medium tracking-tight text-balance md:text-4xl">
          {product.name}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
          <StarRating
            rating={product.rating}
            reviewCount={product.reviewCount}
          />
          <Link
            href={`/?category=${encodeURIComponent(product.category)}`}
            className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            {product.category}
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-2xl tabular-nums">
            {formatMoney(product.price)}
          </p>
          {onSale && (
            <>
              <p className="text-base text-muted-foreground line-through tabular-nums">
                {formatMoney(product.originalPrice!)}
              </p>
              <span className="rounded-full bg-clay/10 px-2.5 py-1 text-xs font-medium text-clay">
                Save {formatMoney(product.originalPrice! - product.price)}
              </span>
            </>
          )}
        </div>

        <p className="mt-5 text-sm leading-relaxed text-pretty text-muted-foreground md:text-base">
          {product.description}
        </p>

        <ul className="mt-6 space-y-2.5">
          {product.highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex gap-2.5 text-sm text-foreground/90"
            >
              <CheckIcon
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <p
          className={cn(
            "mt-6 text-sm",
            lowStock ? "font-medium text-clay" : "text-muted-foreground",
          )}
        >
          {outOfStock
            ? "Out of stock"
            : lowStock
              ? `Only ${product.stock} left`
              : "In stock"}
        </p>

        <div className="mt-6 flex items-center gap-3">
          <QtyStepper
            value={quantity}
            max={Math.max(product.stock, 1)}
            onChange={setQuantity}
          />
          <Button
            className="h-11 flex-1 text-sm"
            disabled={outOfStock}
            onClick={handleAdd}
          >
            Add to cart
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Free shipping over $50 · Simulated checkout, no payment taken.
        </p>
      </div>
    </div>
  );
}
