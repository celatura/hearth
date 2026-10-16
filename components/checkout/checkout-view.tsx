"use client";

import { CheckIcon, CopyIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ShippingProgress } from "@/components/cart/shipping-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatMoney } from "@/lib/format";
import { findProductById } from "@/lib/products";
import { shippingFor, useCartStore, useCartSubtotal } from "@/lib/store/cart";
import { cn } from "@/lib/utils";

type FieldName = "name" | "email" | "address";

interface OrderReceipt {
  number: string;
  email: string;
  total: number;
}

function createOrderNumber() {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const suffix = String(Math.floor(Math.random() * 90000) + 10000);
  return `HH-${year}${month}-${suffix}`;
}

export function CheckoutView() {
  const hydrated = useHydrated();
  const lines = useCartStore((state) => state.lines);
  const clearCart = useCartStore((state) => state.clearCart);
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);

  if (!hydrated) return <CheckoutSkeleton />;
  if (receipt) return <OrderSuccess receipt={receipt} />;
  if (lines.length === 0) return <EmptyCheckout />;
  return <CheckoutForm onPlaced={setReceipt} clearCart={clearCart} />;
}

function CheckoutForm({
  onPlaced,
  clearCart,
}: {
  onPlaced: (receipt: OrderReceipt) => void;
  clearCart: () => void;
}) {
  const lines = useCartStore((state) => state.lines);
  const subtotal = useCartSubtotal();
  const [values, setValues] = useState({ name: "", email: "", address: "" });
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  const setField = (field: FieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const validate = (): Partial<Record<FieldName, string>> => {
    const next: Partial<Record<FieldName, string>> = {};
    if (!values.name.trim()) {
      next.name = "Enter your full name.";
    } else if (values.name.trim().length < 2) {
      next.name = "That name looks too short.";
    }
    if (!values.email.trim()) {
      next.email = "Enter your email address.";
    } else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
      next.email = "Check the format — it should look like name@example.com.";
    }
    if (!values.address.trim()) {
      next.address = "Enter a shipping address.";
    } else if (values.address.trim().length < 5) {
      next.address = "Add a little more detail — street and number at least.";
    }
    return next;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    // Simulated payment processing — the brief's demo checkout.
    setTimeout(() => {
      clearCart();
      onPlaced({
        number: createOrderNumber(),
        email: values.email.trim(),
        total,
      });
    }, 800);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <h1 className="font-heading text-3xl font-medium tracking-tight md:text-4xl">
          Checkout
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Contact and delivery details for this demo order.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
          <div>
            <Label htmlFor="checkout-name">Full name</Label>
            <Input
              id="checkout-name"
              name="name"
              value={values.name}
              autoComplete="name"
              placeholder="Alex Morgan"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "checkout-name-error" : undefined}
              onChange={(event) => setField("name", event.target.value)}
              className="mt-2 h-10 bg-card"
            />
            {errors.name && (
              <p
                id="checkout-name-error"
                className="mt-2 text-xs text-destructive"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="checkout-email">Email</Label>
            <Input
              id="checkout-email"
              name="email"
              type="email"
              value={values.email}
              autoComplete="email"
              placeholder="alex@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? "checkout-email-error" : undefined
              }
              onChange={(event) => setField("email", event.target.value)}
              className="mt-2 h-10 bg-card"
            />
            {errors.email && (
              <p
                id="checkout-email-error"
                className="mt-2 text-xs text-destructive"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="checkout-address">Shipping address</Label>
            <Textarea
              id="checkout-address"
              name="address"
              value={values.address}
              autoComplete="street-address"
              placeholder={"12 Willow Lane, Apt 4\nPortland, OR 97205"}
              rows={3}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={
                errors.address ? "checkout-address-error" : undefined
              }
              onChange={(event) => setField("address", event.target.value)}
              className="mt-2 bg-card"
            />
            {errors.address && (
              <p
                id="checkout-address-error"
                className="mt-2 text-xs text-destructive"
              >
                {errors.address}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={submitting}
              className="h-11 w-full text-sm sm:w-auto sm:px-8"
            >
              {submitting && (
                <Loader2Icon aria-hidden className="animate-spin" />
              )}
              {submitting ? "Placing order…" : "Place demo order"}
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              No payment is taken — this checkout is simulated end to end.
            </p>
          </div>
        </form>
      </div>

      <aside className="lg:col-span-5">
        <div className="rounded-lg border border-border/70 bg-card p-5 lg:sticky lg:top-24">
          <h2 className="font-heading text-lg font-medium">Order summary</h2>

          <ul className="mt-4 divide-y divide-border/70">
            {lines.map((line) => {
              const product = findProductById(line.productId);
              if (!product) return null;
              return (
                <li
                  key={line.productId}
                  className="flex items-baseline justify-between gap-3 py-3 text-sm"
                >
                  <span className="text-muted-foreground">
                    {product.name}{" "}
                    <span className="tabular-nums">× {line.quantity}</span>
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {formatMoney(product.price * line.quantity)}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 border-t border-border/70 pt-4">
            <ShippingProgress subtotal={subtotal} />
          </div>

          <dl className="mt-4 space-y-2 border-t border-border/70 pt-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="tabular-nums">{formatMoney(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="tabular-nums">
                {shipping === 0 ? "Free" : formatMoney(shipping)}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-border/70 pt-3 text-base font-medium">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatMoney(total)}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}

function OrderSuccess({ receipt }: { receipt: OrderReceipt }) {
  const [copied, setCopied] = useState(false);

  const copyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(receipt.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied; the number stays visible to copy.
    }
  };

  return (
    <div className="mx-auto max-w-xl py-8 text-center md:py-16">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary">
        <CheckIcon aria-hidden className="size-5 text-clay" />
      </span>
      <h1 className="mt-5 font-heading text-3xl font-medium tracking-tight text-balance md:text-4xl">
        Thank you — your demo order is placed.
      </h1>
      <p className="mt-4 text-sm text-pretty text-muted-foreground">
        This was a simulated checkout: no payment was processed and nothing
        will ship. A confirmation would normally be sent to{" "}
        <span className="text-foreground">{receipt.email}</span>.
      </p>

      <div className="mx-auto mt-8 max-w-xs rounded-lg border border-border/70 bg-card px-6 py-5">
        <p className="text-xs text-muted-foreground">Order number</p>
        <p className="mt-1 text-lg font-medium tabular-nums">
          {receipt.number}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Total {formatMoney(receipt.total)}
        </p>
        <button
          type="button"
          onClick={copyOrderNumber}
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          <CopyIcon aria-hidden className="size-3.5" />
          {copied ? "Copied" : "Copy order number"}
        </button>
      </div>

      <div className="mt-8">
        <Button asChild className="h-11 px-6 text-sm">
          <Link href="/">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}

function EmptyCheckout() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center py-10 text-center">
      <h1 className="font-heading text-2xl font-medium tracking-tight">
        Your cart is empty
      </h1>
      <p className="mt-2 max-w-xs text-sm text-pretty text-muted-foreground">
        Add a few pieces to the cart before checking out.
      </p>
      <Button asChild className="mt-5 h-10 px-5">
        <Link href="/">Browse the collection</Link>
      </Button>
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="space-y-6 lg:col-span-7">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-11 w-40" />
      </div>
      <div className="lg:col-span-5">
        <Skeleton className={cn("h-72 w-full rounded-lg")} />
      </div>
    </div>
  );
}
