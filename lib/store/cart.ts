import { create } from "zustand";
import { persist } from "zustand/middleware";
import { findProductById } from "../products";
import type { CartLine } from "../types";

export const FREE_SHIPPING_THRESHOLD = 50;
export const STANDARD_SHIPPING = 5.9;

function maxStock(productId: string) {
  return findProductById(productId)?.stock ?? Number.MAX_SAFE_INTEGER;
}

interface CartState {
  lines: CartLine[];
  isSheetOpen: boolean;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openSheet: () => void;
  closeSheet: () => void;
  setSheetOpen: (open: boolean) => void;
}

/**
 * Cart state is client-only and shared across routes (header badge,
 * sheet, checkout), so it lives in a persisted Zustand store. Sheet
 * open/close rides in the same store but is never persisted.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isSheetOpen: false,
      addItem: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find(
            (line) => line.productId === productId,
          );
          if (existing) {
            return {
              lines: state.lines.map((line) =>
                line.productId === productId
                  ? {
                      ...line,
                      quantity: Math.min(
                        line.quantity + quantity,
                        maxStock(productId),
                      ),
                    }
                  : line,
              ),
            };
          }
          return {
            lines: [
              ...state.lines,
              {
                productId,
                quantity: Math.min(quantity, maxStock(productId)),
              },
            ],
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          lines: state.lines.filter((line) => line.productId !== productId),
        })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          lines: state.lines.map((line) =>
            line.productId === productId
              ? {
                  ...line,
                  quantity: Math.max(1, Math.min(quantity, maxStock(productId))),
                }
              : line,
          ),
        })),
      clearCart: () => set({ lines: [] }),
      openSheet: () => set({ isSheetOpen: true }),
      closeSheet: () => set({ isSheetOpen: false }),
      setSheetOpen: (open) => set({ isSheetOpen: open }),
    }),
    {
      name: "hearth-cart",
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);

export function useCartCount() {
  return useCartStore((state) =>
    state.lines.reduce((sum, line) => sum + line.quantity, 0),
  );
}

export function useCartSubtotal() {
  return useCartStore((state) =>
    state.lines.reduce(
      (sum, line) =>
        sum + (findProductById(line.productId)?.price ?? 0) * line.quantity,
      0,
    ),
  );
}

/** Shipping is free over the threshold; an empty cart ships nothing. */
export function shippingFor(subtotal: number) {
  return subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0
    ? 0
    : STANDARD_SHIPPING;
}
