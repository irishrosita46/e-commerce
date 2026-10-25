"use client";

import React from "react";
import { Truck, CheckCircle2 } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/orders";

interface FreeShippingProgressProps {
  subtotal: number;
  hasFreeShippingCoupon?: boolean;
  className?: string;
}

export function FreeShippingProgress({
  subtotal,
  hasFreeShippingCoupon = false,
  className = "",
}: FreeShippingProgressProps) {
  const isUnlocked = hasFreeShippingCoupon || subtotal >= FREE_SHIPPING_THRESHOLD;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = isUnlocked
    ? 100
    : Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div
      className={`border-b border-zinc-100 bg-zinc-50/80 px-6 py-3 dark:border-zinc-900 dark:bg-zinc-900/50 ${className}`}
    >
      <div className="flex items-center justify-between text-xs mb-1.5">
        {isUnlocked ? (
          <span className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>
              {hasFreeShippingCoupon
                ? "Free shipping applied via promo code"
                : "Complimentary standard shipping unlocked"}
            </span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
            <Truck className="h-3.5 w-3.5 text-zinc-500" />
            <span>
              Add{" "}
              <strong className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
                ${remaining.toFixed(2)}
              </strong>{" "}
              more for free shipping
            </span>
          </span>
        )}
        <span className="font-mono text-[11px] text-zinc-500 font-medium">
          {progressPercent}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isUnlocked
              ? "bg-emerald-600 dark:bg-emerald-500"
              : "bg-zinc-900 dark:bg-zinc-100"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
