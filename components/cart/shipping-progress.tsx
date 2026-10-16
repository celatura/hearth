import { formatMoney } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/store/cart";

/**
 * Progress toward the free-shipping threshold. Clay is the fill because
 * the bar is an attention signal, same family as sale prices.
 */
export function ShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const unlocked = remaining === 0;

  return (
    <div>
      <p className="text-xs text-foreground/80">
        {unlocked
          ? "Free shipping unlocked."
          : `You're ${formatMoney(remaining)} away from free shipping.`}
      </p>
      <div
        role="progressbar"
        aria-label="Progress toward free shipping"
        aria-valuemin={0}
        aria-valuemax={FREE_SHIPPING_THRESHOLD}
        aria-valuenow={Math.min(subtotal, FREE_SHIPPING_THRESHOLD)}
        className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary"
      >
        <div
          className="h-full rounded-full bg-clay transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
