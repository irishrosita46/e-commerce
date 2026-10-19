"use client";

import React from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/storefront/Breadcrumbs";
import { useCart } from "@/context/CartContext";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingBag,
  ArrowRight,
  Truck,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { FREE_SHIPPING_THRESHOLD, calculateOrderTotals } from "@/lib/orders";

export default function CartPage() {
  const { items, totalItems, updateQuantity, removeItem, clearCart } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totals = calculateOrderTotals(subtotal);

  const amountRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
      <Breadcrumbs />

      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Shopping Cart
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {totalItems === 0
              ? "Your cart is currently empty."
              : `Review and adjust your ${totalItems} ${
                  totalItems === 1 ? "item" : "items"
                } before checkout.`}
          </p>
        </div>

        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-xs text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 w-fit"
          >
            Clear All Items
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-600 mb-4">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Your Cart is Empty
          </h2>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Discover precision-engineered workspace tools, acoustic accessories,
            and daily essentials in our catalog.
          </p>
          <div className="mt-6">
            <Link href="/catalog">
              <Button className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-semibold">
                Explore Catalog
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-lg border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {items.map((item) => (
                  <div key={item.product.id} className="py-4 first:pt-0 last:pb-0">
                    <CartItemRow
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link href="/catalog">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary & Checkout Card */}
          <div className="lg:col-span-4 space-y-6">
            {/* Free Shipping Progress Card */}
            <Card className="border-zinc-200 bg-white shadow-none dark:border-zinc-800 dark:bg-zinc-950">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  {amountRemaining === 0 ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Truck className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                  )}
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {amountRemaining === 0
                      ? "Free Standard Shipping Unlocked!"
                      : `Add $${amountRemaining.toFixed(
                          2
                        )} more for Free Shipping`}
                  </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
                  <div
                    className={`h-full transition-all duration-300 ${
                      amountRemaining === 0 ? "bg-emerald-600" : "bg-zinc-900 dark:bg-zinc-100"
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-zinc-500">
                  Orders over ${FREE_SHIPPING_THRESHOLD.toFixed(2)} qualify for complimentary standard shipping.
                </p>
              </CardContent>
            </Card>

            {/* Price Breakdown */}
            <Card className="border-zinc-200 bg-white shadow-none dark:border-zinc-800 dark:bg-zinc-950">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-900">
                <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3 text-xs">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    ${totals.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {totals.shippingCost === 0
                      ? "FREE"
                      : `$${totals.shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Sales Tax (8%)</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    ${totals.tax.toFixed(2)}
                  </span>
                </div>

                <Separator className="my-2 bg-zinc-200 dark:bg-zinc-800" />

                <div className="flex justify-between text-sm font-bold text-zinc-900 dark:text-zinc-50">
                  <span>Estimated Total</span>
                  <span>${totals.total.toFixed(2)}</span>
                </div>

                <div className="pt-3">
                  <Link href="/checkout" className="w-full block">
                    <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 font-semibold text-xs py-5">
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-zinc-400 dark:text-zinc-500">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Protected Authentication Route Guard</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
