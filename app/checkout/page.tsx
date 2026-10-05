"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Breadcrumbs } from "@/components/storefront/Breadcrumbs";
import { calculateOrderTotals } from "@/lib/orders";
import {
  Lock,
  ShieldAlert,
  ShoppingBag,
  ArrowRight,
  User,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

export default function CheckoutPage() {
  const { user, isAuthenticated, isLoading, openAuthModal } = useAuth();
  const { items, totalItems, subtotal, clearCart } = useCart();
  const totals = calculateOrderTotals(subtotal);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent dark:border-zinc-100" />
          <p className="text-xs text-zinc-500">Checking session security...</p>
        </div>
      </div>
    );
  }

  // Mandatory Course Route Guard: Checkout without authentication must be prevented
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full  mb-5">
            <Lock className="h-7 w-7" />
          </div>

          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
            Authentication Required
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
            Customers must register and log in before placing an order.
          </p>

          <div className="space-y-2.5">
            <Button
              onClick={() => openAuthModal("login", "/checkout")}
              className="w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 text-xs h-10 font-medium"
            >
              Sign In to Continue
            </Button>
            <Button
              variant="outline"
              onClick={() => openAuthModal("register", "/checkout")}
              className="w-full border-zinc-200 dark:border-zinc-800 text-xs h-10 font-medium"
            >
              Create New Account
            </Button>
            <Link href="/catalog" className="inline-block pt-2">
              <span className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 underline underline-offset-4 flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" />
                Return to product catalog
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated State
  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs className="mb-2" />
        {/* Header Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Checkout
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Complete order data contracts and address information.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Session Card */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold text-sm">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Logged in as {user?.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Account email: {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <CheckoutForm
              user={user}
              items={items}
              subtotal={subtotal}
              onOrderPlaced={() => clearCart()}
            />
          </div>

          {/* Sidebar Cart Summary */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 h-fit space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span>Order Summary</span>
              </h3>
              <span className="text-xs text-zinc-500">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>

            <Separator className="bg-zinc-100 dark:bg-zinc-800" />

            {items.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-4">
                Your cart is empty. Please add items from the catalog.
              </p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between text-xs gap-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-800">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-[10px] text-zinc-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 shrink-0">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Separator className="bg-zinc-100 dark:bg-zinc-800" />

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Shipping</span>
                <span>
                  {totals.shippingCost === 0
                    ? "Free (Orders over $100)"
                    : `$${totals.shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Estimated Tax (8%)</span>
                <span>${totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-zinc-900 dark:text-zinc-100 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span>Total</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
