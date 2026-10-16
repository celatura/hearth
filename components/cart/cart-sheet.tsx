"use client";

import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartLineItem } from "@/components/cart/cart-line";
import { ShippingProgress } from "@/components/cart/shipping-progress";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatMoney } from "@/lib/format";
import { useCartStore, useCartSubtotal } from "@/lib/store/cart";

export function CartSheet() {
  const hydrated = useHydrated();
  const isOpen = useCartStore((state) => state.isSheetOpen);
  const setSheetOpen = useCartStore((state) => state.setSheetOpen);
  const lines = useCartStore((state) => state.lines);
  const subtotal = useCartSubtotal();
  const router = useRouter();

  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const close = () => setSheetOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setSheetOpen}>
      <SheetContent
        side="right"
        className="w-full! gap-0 p-0 sm:max-w-md!"
      >
        <SheetHeader className="border-b border-border/70 p-4 pr-12">
          <SheetTitle className="font-heading text-lg">
            {hydrated && count > 0 ? `Your cart (${count})` : "Your cart"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Review the pieces in your cart and continue to checkout.
          </SheetDescription>
        </SheetHeader>

        {!hydrated ? (
          <div className="space-y-4 p-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 pb-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-secondary">
              <ShoppingBagIcon aria-hidden className="size-5 text-muted-foreground" />
            </span>
            <p className="font-heading text-lg">Your cart is empty</p>
            <p className="max-w-60 text-sm text-muted-foreground">
              Pieces you add will wait for you here.
            </p>
            <Button asChild className="mt-2 h-10 px-5" onClick={close}>
              <Link href="/">Browse the collection</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="border-b border-border/70 px-4 py-3">
              <ShippingProgress subtotal={subtotal} />
            </div>

            <ul className="min-h-0 flex-1 divide-y divide-border/70 overflow-y-auto px-4">
              {lines.map((line) => (
                <CartLineItem key={line.productId} line={line} onNavigate={close} />
              ))}
            </ul>

            <SheetFooter className="border-t border-border/70 p-4">
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-medium tabular-nums">
                  {formatMoney(subtotal)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping is calculated at checkout.
              </p>
              <Button
                className="mt-2 h-11 w-full"
                onClick={() => {
                  close();
                  router.push("/checkout");
                }}
              >
                Checkout
              </Button>
              <Button variant="ghost" className="w-full" onClick={close}>
                Continue shopping
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
