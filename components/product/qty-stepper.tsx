"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QtyStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "default";
}

export function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "default",
}: QtyStepperProps) {
  const compact = size === "sm";

  return (
    <div
      role="group"
      aria-label="Quantity"
      className="inline-flex items-center rounded-lg border border-border bg-card"
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cn(
          "inline-flex items-center justify-center rounded-l-lg text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-40",
          compact ? "size-7" : "size-10",
        )}
      >
        <MinusIcon aria-hidden className={compact ? "size-3.5" : "size-4"} />
      </button>
      <span
        aria-live="polite"
        className={cn(
          "text-center text-sm tabular-nums",
          compact ? "w-7" : "w-10",
        )}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={cn(
          "inline-flex items-center justify-center rounded-r-lg text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-40",
          compact ? "size-7" : "size-10",
        )}
      >
        <PlusIcon aria-hidden className={compact ? "size-3.5" : "size-4"} />
      </button>
    </div>
  );
}
