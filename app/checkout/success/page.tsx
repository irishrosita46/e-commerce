"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Order } from "@/types/order";
import { getOrderByReference, getStoredOrders } from "@/lib/orders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/storefront/Breadcrumbs";
import {
  CheckCircle2,
  Printer,
  ShoppingBag,
  ArrowRight,
  CreditCard,
  Truck,
  MapPin,
  Calendar,
  ShieldCheck,
  User,
  Wallet,
  Smartphone,
  ExternalLink,
} from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const refParam = searchParams.get("ref");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (refParam) {
      const found = getOrderByReference(refParam);
      if (found) {
        setOrder(found);
        setIsLoading(false);
        return;
      }
    }

    // Fallback: load the most recent stored order
    const all = getStoredOrders();
    if (all.length > 0) {
      setOrder(all[0]);
    }
    setIsLoading(false);
  }, [refParam]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent dark:border-zinc-100" />
          <p className="text-xs text-zinc-500">Retrieving order confirmation...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 mb-4">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            No Recent Order Found
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 mb-6">
            We could not locate an active order receipt with this reference.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/catalog">
              <Button className="w-full text-xs h-10 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950">
                Browse Products
              </Button>
            </Link>
            <Link href="/account">
              <Button variant="outline" className="w-full text-xs h-10 border-zinc-200 dark:border-zinc-800">
                View Account &amp; Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-zinc-50/50 py-10 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs className="mb-4 print:hidden" />

        {/* Print Styles */}
        <style jsx global>{`
          @media print {
            body {
              background: #ffffff !important;
              color: #000000 !important;
            }
            header,
            footer,
            nav,
            .print\\:hidden {
              display: none !important;
            }
            .printable-receipt {
              border: 1px solid #cbd5e1 !important;
              box-shadow: none !important;
              margin: 0 !important;
              padding: 24px !important;
            }
          }
        `}</style>

        {/* Order Receipt Main Card */}
        <div className="printable-receipt rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 space-y-6">
          {/* Header Status Banner */}
          <div className="text-center pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <Badge
              variant="outline"
              className="mb-2 border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs px-2.5 py-0.5"
            >
              Order Confirmed &amp; Payment Authorized
            </Badge>

            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Thank You for Your Order!
            </h1>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
              A copy of your official order receipt has been recorded and dispatched to{" "}
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                {order.shippingAddress.email}
              </span>
              .
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 dark:bg-zinc-800/80">
              <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                Order Reference:
              </span>
              <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {order.reference}
              </span>
            </div>
          </div>

          {/* Quick Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-zinc-50 dark:bg-zinc-950/40 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div>
              <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Placed On
              </span>
              <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-200">
                {orderDate}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider flex items-center gap-1">
                <CreditCard className="h-3 w-3" /> Payment Method
              </span>
              <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-200">
                {order.paymentMethod === "credit_card"
                  ? `Credit Card ${order.paymentDetails?.last4 ? `(•••• ${order.paymentDetails.last4})` : ""}`
                  : order.paymentMethod === "paypal"
                    ? "PayPal Express"
                    : "Apple Pay"}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider flex items-center gap-1">
                <Truck className="h-3 w-3" /> Delivery Status
              </span>
              <p className="mt-1 font-medium text-emerald-600 dark:text-emerald-400">
                Standard Shipping (2-3 Business Days)
              </p>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 mb-2">
                <User className="h-3.5 w-3.5 text-zinc-500" />
                Customer Contact
              </h3>
              <p className="font-semibold text-zinc-900 dark:text-zinc-200">
                {order.shippingAddress.fullName}
              </p>
              <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">
                {order.shippingAddress.email}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 mb-2">
                <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                Shipping Destination
              </h3>
              <p className="text-zinc-700 dark:text-zinc-300">
                {order.shippingAddress.street}
              </p>
              <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">
                {order.shippingAddress.postalCode} {order.shippingAddress.city},{" "}
                {order.shippingAddress.country}
              </p>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <ShoppingBag className="h-3.5 w-3.5" />
              Purchased Items ({order.items.length})
            </h3>

            <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between p-3.5 text-xs bg-white dark:bg-zinc-900"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Qty: {item.quantity} &times; ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/30 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Subtotal</span>
              <span className="font-mono text-zinc-900 dark:text-zinc-100">
                ${order.subtotal.toFixed(2)}
              </span>
            </div>

            {order.discount && order.discount > 0 ? (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Promotional Discount ({order.promoCode || "Applied"})</span>
                <span className="font-mono">-${order.discount.toFixed(2)}</span>
              </div>
            ) : null}

            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Standard Shipping</span>
              <span className="font-mono text-zinc-900 dark:text-zinc-100">
                {order.shippingCost === 0
                  ? "Free"
                  : `$${order.shippingCost.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Estimated Sales Tax (8%)</span>
              <span className="font-mono text-zinc-900 dark:text-zinc-100">
                ${order.tax.toFixed(2)}
              </span>
            </div>

            <Separator className="my-2 bg-zinc-200 dark:bg-zinc-800" />

            <div className="flex justify-between items-center text-sm font-bold text-zinc-900 dark:text-zinc-50 pt-1">
              <span>Total Paid</span>
              <span className="font-mono text-base">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 print:hidden">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.print()}
              className="w-full sm:w-auto h-10 text-xs border-zinc-200 dark:border-zinc-800 gap-2 cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Print Official Receipt</span>
            </Button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Link href="/account" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-10 text-xs border-zinc-200 dark:border-zinc-800 gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>My Account &amp; Orders</span>
                </Button>
              </Link>

              <Link href="/catalog" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-10 text-xs bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 gap-1.5 cursor-pointer">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Continue Shopping</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent dark:border-zinc-100" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
