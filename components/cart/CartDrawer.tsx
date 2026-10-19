"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { calculateOrderTotals, FREE_SHIPPING_THRESHOLD } from "@/lib/orders";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingBag,
  ArrowRight,
  Lock,
  Truck,
  CheckCircle2,
} from "lucide-react";

export function CartDrawer() {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuth();
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
  } = useCart();

  const totals = calculateOrderTotals(subtotal);
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - totals.subtotal,
  );
  const shippingProgressPercent = Math.min(
    100,
    Math.round((totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100),
  );

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    if (!isAuthenticated) {
      openAuthModal("login", "/checkout");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col bg-white p-0 sm:max-w-md dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800"
      >
        {/* Header */}
        <SheetHeader className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
            <SheetTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Shopping Cart
            </SheetTitle>
            {totalItems > 0 && (
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <SheetDescription className="text-xs text-zinc-500 dark:text-zinc-400">
            Review your selected hardware before proceeding to checkout.
          </SheetDescription>
        </SheetHeader>

        {/* Content Body */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 mb-4">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              Your cart is empty
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mb-6">
              Looks like you have not added any hardware essentials yet. Explore
              our curated catalog.
            </p>
            <Button
              onClick={() => setIsCartOpen(false)}
              className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 text-xs h-9 px-4"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Free Shipping Tier Progress Bar */}
            <div className="border-b border-zinc-100 bg-zinc-50/70 px-6 py-3 dark:border-zinc-900 dark:bg-zinc-900/40">
              <div className="flex items-center justify-between text-xs mb-1.5">
                {remainingForFreeShipping === 0 ? (
                  <span className="flex items-center gap-1.5 font-medium text-zinc-900 dark:text-zinc-100">
                    <CheckCircle2 className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100" />
                    Complimentary standard shipping unlocked
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                    <Truck className="h-3.5 w-3.5 text-zinc-500" />
                    Add{" "}
                    <strong className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
                      ${remainingForFreeShipping.toFixed(2)}
                    </strong>{" "}
                    more for free shipping
                  </span>
                )}
                <span className="font-mono text-[11px] text-zinc-500">
                  {shippingProgressPercent}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-zinc-900 transition-all duration-300 dark:bg-zinc-100"
                  style={{ width: `${shippingProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Scrollable Item List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {items.map((item) => (
                <CartItemRow
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 underline underline-offset-4 cursor-pointer"
                >
                  Clear all items
                </button>
              </div>
            </div>

            {/* Sticky Drawer Footer with Dynamic Pricing Breakdown */}
            <SheetFooter className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800 flex flex-col gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-zinc-700 dark:text-zinc-300">
                    ${totals.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Estimated shipping</span>
                  <span className="font-mono text-zinc-700 dark:text-zinc-300">
                    {totals.shippingCost === 0
                      ? "Free"
                      : `$${totals.shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Estimated tax (8%)</span>
                  <span className="font-mono text-zinc-700 dark:text-zinc-300">
                    ${totals.tax.toFixed(2)}
                  </span>
                </div>

                <Separator className="my-2 bg-zinc-200 dark:bg-zinc-800" />

                <div className="flex items-center justify-between text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  <span>Estimated Total</span>
                  <span className="font-mono">${totals.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <Button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 text-xs h-10 font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {!isAuthenticated && (
                    <Lock className="h-3.5 w-3.5 mr-0.5 text-zinc-400" />
                  )}
                  <span>
                    {isAuthenticated
                      ? "Proceed to Checkout"
                      : "Sign in to Checkout"}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-xs h-9 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                >
                  Continue Browsing
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
