"use client";

import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { QtyStepper } from "@/components/product/qty-stepper";
import { formatMoney } from "@/lib/format";
import { findProductById } from "@/lib/products";
import { useCartStore } from "@/lib/store/cart";
import type { CartLine } from "@/lib/types";

interface CartLineItemProps {
  line: CartLine;
  onNavigate?: () => void;
}

export function CartLineItem({ line, onNavigate }: CartLineItemProps) {
  const removeItem = useCartStore((state) => state.removeItem);
  const setQuantity = useCartStore((state) => state.setQuantity);

  const product = findProductById(line.productId);
  if (!product) return null;

  const lineTotal = product.price * line.quantity;

  return (
    <li className="flex gap-4 py-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/products/${product.id}`}
            onClick={onNavigate}
            className="truncate text-sm font-medium underline-offset-4 hover:underline"
          >
            {product.name}
          </Link>
          <span className="shrink-0 text-sm tabular-nums">
            {formatMoney(lineTotal)}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatMoney(product.price)} each
        </p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <QtyStepper
            size="sm"
            value={line.quantity}
            max={product.stock}
            onChange={(quantity) => setQuantity(product.id, quantity)}
          />
          <button
            type="button"
            onClick={() => removeItem(product.id)}
            aria-label={`Remove ${product.name} from cart`}
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Trash2Icon aria-hidden className="size-4" />
          </button>
        </div>
      </div>
    </li>
  );
}
