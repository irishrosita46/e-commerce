"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User } from "@/types/auth";
import { CartItem } from "@/context/CartContext";
import {
  ShippingAddress,
  AddressValidationErrors,
  PaymentMethod,
  Order,
} from "@/types/order";
import {
  validateShippingAddress,
  generateOrderReference,
  calculateOrderTotals,
  saveOrder,
} from "@/lib/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowRight,
  Printer,
  ShoppingBag,
} from "lucide-react";

interface CheckoutFormProps {
  user: User;
  items: CartItem[];
  subtotal: number;
  onOrderPlaced: (order: Order) => void;
}

export function CheckoutForm({
  user,
  items,
  subtotal,
  onOrderPlaced,
}: CheckoutFormProps) {
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user.name || "",
    email: user.email || "",
    street: "",
    city: "",
    postalCode: "",
    country: "Germany",
  });

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("credit_card");
  const [errors, setErrors] = useState<AddressValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const totals = calculateOrderTotals(subtotal);

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Your cart is empty. Please add items to checkout.");
      return;
    }

    const validation = validateShippingAddress(address);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    // Simulate order placement
    setTimeout(() => {
      const reference = generateOrderReference();
      const newOrder: Order = {
        id: `ord-${Date.now().toString(36)}`,
        reference,
        userId: user.id,
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.image,
        })),
        shippingAddress: address,
        paymentMethod,
        subtotal: totals.subtotal,
        shippingCost: totals.shippingCost,
        tax: totals.tax,
        total: totals.total,
        status: "completed",
        createdAt: new Date().toISOString(),
      };

      saveOrder(newOrder);
      setCompletedOrder(newOrder);
      setIsSubmitting(false);
      onOrderPlaced(newOrder);
    }, 600);
  };

  // Order Confirmed State
  if (completedOrder) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <Badge
          variant="outline"
          className="mb-3 border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300"
        >
          Order Confirmed
        </Badge>

        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Thank you for your purchase!
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          A receipt has been generated and dispatched to{" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-200">
            {completedOrder.shippingAddress.email}
          </span>
          .
        </p>

        {/* Order Reference Box */}
        <div className="my-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-left dark:border-zinc-800 dark:bg-zinc-950/50">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
            <div>
              <p className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
                Order Reference
              </p>
              <p className="font-mono text-base font-bold text-zinc-900 dark:text-zinc-100">
                {completedOrder.reference}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
                Total Paid
              </p>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                ${completedOrder.total.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="pt-3 text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
            <p>
              <span className="font-medium text-zinc-900 dark:text-zinc-200">
                Recipient:
              </span>{" "}
              {completedOrder.shippingAddress.fullName}
            </p>
            <p>
              <span className="font-medium text-zinc-900 dark:text-zinc-200">
                Delivery Address:
              </span>{" "}
              {completedOrder.shippingAddress.street},{" "}
              {completedOrder.shippingAddress.postalCode}{" "}
              {completedOrder.shippingAddress.city},{" "}
              {completedOrder.shippingAddress.country}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.print()}
            className="w-full sm:w-auto h-9 text-xs border-zinc-200 dark:border-zinc-800 gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Receipt
          </Button>
          <Link href="/catalog" className="w-full sm:w-auto">
            <Button className="w-full h-9 text-xs bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 gap-1.5">
              <ShoppingBag className="h-3.5 w-3.5" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Customer & Shipping Address */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-center gap-2 mb-4">
          <Truck className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            1. Shipping Information
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Full Name */}
          <div className="space-y-1 sm:col-span-1">
            <label className="font-medium text-zinc-700 dark:text-zinc-300">
              Full Name
            </label>
            <Input
              type="text"
              value={address.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="e.g. Alex Vance"
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && (
              <p className="text-[11px] text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1 sm:col-span-1">
            <label className="font-medium text-zinc-700 dark:text-zinc-300">
              Notification Email
            </label>
            <Input
              type="email"
              value={address.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="e.g. customer@aurastore.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-[11px] text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Street Address */}
          <div className="space-y-1 sm:col-span-2">
            <label className="font-medium text-zinc-700 dark:text-zinc-300">
              Street Address
            </label>
            <Input
              type="text"
              value={address.street}
              onChange={(e) => handleInputChange("street", e.target.value)}
              placeholder="e.g. Dessauer Str. 3-5"
              className={errors.street ? "border-red-500" : ""}
            />
            {errors.street && (
              <p className="text-[11px] text-red-500">{errors.street}</p>
            )}
          </div>

          {/* City */}
          <div className="space-y-1 sm:col-span-1">
            <label className="font-medium text-zinc-700 dark:text-zinc-300">
              City
            </label>
            <Input
              type="text"
              value={address.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="e.g. Berlin"
              className={errors.city ? "border-red-500" : ""}
            />
            {errors.city && (
              <p className="text-[11px] text-red-500">{errors.city}</p>
            )}
          </div>

          {/* Postal Code */}
          <div className="space-y-1 sm:col-span-1">
            <label className="font-medium text-zinc-700 dark:text-zinc-300">
              Postal / ZIP Code
            </label>
            <Input
              type="text"
              value={address.postalCode}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              placeholder="e.g. 10963"
              className={errors.postalCode ? "border-red-500" : ""}
            />
            {errors.postalCode && (
              <p className="text-[11px] text-red-500">{errors.postalCode}</p>
            )}
          </div>

          {/* Country */}
          <div className="space-y-1 sm:col-span-2">
            <label className="font-medium text-zinc-700 dark:text-zinc-300">
              Country / Region
            </label>
            <select
              value={address.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
            >
              <option value="Germany">Germany</option>
              <option value="Austria">Austria</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Netherlands">Netherlands</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Simulated Payment Method Selection */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            2. Payment Method
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: "credit_card",
              label: "Credit Card",
              desc: "Simulated Visa/MC",
            },
            { id: "paypal", label: "PayPal", desc: "Instant checkout" },
            {
              id: "apple_pay",
              label: "Apple Pay",
              desc: "One-click authorization",
            },
          ].map((method) => {
            const isSelected = paymentMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                className={`flex flex-col items-start p-3 rounded-lg border text-left transition-colors ${
                  isSelected
                    ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-950/60"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {method.label}
                  </span>
                  <div
                    className={`h-3 w-3 rounded-full border ${
                      isSelected
                        ? "border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100"
                        : "border-zinc-300"
                    }`}
                  />
                </div>
                <span className="text-[10px] text-zinc-400 mt-1">
                  {method.desc}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-500 bg-zinc-50/70 dark:bg-zinc-950/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            Demonstration checkout flow. All transactions are simulated
            client-side with zero actual charges.
          </span>
        </div>
      </div>

      {/* Place Order CTA */}
      <Button
        type="submit"
        disabled={isSubmitting || items.length === 0}
        className="w-full h-11 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-medium gap-2"
      >
        {isSubmitting ? (
          <span>Validating &amp; Placing Order...</span>
        ) : (
          <>
            <span>Place Order - ${totals.total.toFixed(2)}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </>
        )}
      </Button>
    </form>
  );
}
