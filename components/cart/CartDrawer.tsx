"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
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
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Lock,
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
            {/* Scrollable Item List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 rounded-lg border border-zinc-100 p-3 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30"
                >
                  {/* Thumbnail */}
                  <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </div>

                  {/* Info & Quantity Modifiers */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {item.product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer p-0.5"
                          title="Remove item"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                        {item.product.category}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="flex h-6 w-6 items-center justify-center text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-medium text-zinc-900 dark:text-zinc-100">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="flex h-6 w-6 items-center justify-center text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
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

            {/* Sticky Drawer Footer */}
            <SheetFooter className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800 flex flex-col gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Shipping & taxes</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <Separator className="my-1 bg-zinc-200 dark:bg-zinc-800" />

              <div className="flex flex-col gap-2">
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
