"use client";

import React from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/storefront/Breadcrumbs";
import { useCart } from "@/context/CartContext";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { FreeShippingProgress } from "@/components/cart/FreeShippingProgress";
import { PromoCodeInput } from "@/components/cart/PromoCodeInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, ArrowRight, ShieldCheck, RotateCcw } from "lucide-react";

export default function CartPage() {
  const {
    items,
    totalItems,
    updateQuantity,
    removeItem,
    clearCart,
    totals,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
  } = useCart();

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
            className="text-xs text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 w-fit cursor-pointer"
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
              <Button className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 text-xs font-semibold cursor-pointer">
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
                  className="text-xs border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary & Checkout Card */}
          <div className="lg:col-span-4 space-y-6">
            {/* Free Shipping Progress Card (SCRUM-83) */}
            <FreeShippingProgress
              subtotal={totals.subtotal}
              hasFreeShippingCoupon={appliedPromo?.code === "FREESHIP"}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
            />

            {/* Price Breakdown */}
            <Card className="border-zinc-200 bg-white shadow-none dark:border-zinc-800 dark:bg-zinc-950">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-900">
                <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                {/* Coupon Code Input (SCRUM-84) */}
                <PromoCodeInput
                  appliedPromo={appliedPromo}
                  onApply={applyPromoCode}
                  onRemove={removePromoCode}
                />

                <div className="space-y-2.5 pt-1">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
                      ${totals.subtotal.toFixed(2)}
                    </span>
                  </div>

                  {totals.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Discount ({appliedPromo?.code})</span>
                      <span className="font-mono">
                        -${totals.discount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
                      {totals.shippingCost === 0
                        ? "FREE"
                        : `$${totals.shippingCost.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Sales Tax (8%)</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
                      ${totals.tax.toFixed(2)}
                    </span>
                  </div>

                  <Separator className="my-2 bg-zinc-200 dark:bg-zinc-800" />

                  <div className="flex justify-between text-sm font-bold text-zinc-900 dark:text-zinc-50">
                    <span>Estimated Total</span>
                    <span className="font-mono">${totals.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/checkout" className="w-full block">
                    <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 font-semibold text-xs py-5 cursor-pointer">
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="pt-1 flex items-center justify-center gap-2 text-[10px] text-zinc-400 dark:text-zinc-500">
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
