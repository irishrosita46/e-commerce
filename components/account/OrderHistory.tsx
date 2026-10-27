"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Order } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  PackageCheck,
  ShoppingBag,
  ArrowRight,
  Printer,
  Calendar,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface OrderHistoryProps {
  orders: Order[];
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(
    {}
  );

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-10 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            No Orders Placed Yet
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
            When you complete a checkout purchase, your order references, items,
            and receipts will appear here.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/catalog">
            <Button
              size="sm"
              className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 text-xs gap-1.5 cursor-pointer"
            >
              <span>Explore Products</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <PackageCheck className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
            <span>Order History</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            View completed transactions, tracking references, and printable receipts.
          </p>
        </div>
        <span className="text-xs font-mono text-zinc-500">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrders[order.id] !== false; // Default expanded for usability
          const dateStr = new Date(order.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return (
            <div
              key={order.id}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden text-xs shadow-xs"
            >
              {/* Order Card Header */}
              <div className="bg-zinc-50/80 dark:bg-zinc-900/80 px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-zinc-400 block tracking-wider">
                      Reference
                    </span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                      {order.reference}
                    </span>
                  </div>

                  <div className="border-l border-zinc-200 dark:border-zinc-800 pl-4">
                    <span className="text-[10px] uppercase font-semibold text-zinc-400 block tracking-wider">
                      Date
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-300 flex items-center gap-1 font-medium">
                      <Calendar className="h-3 w-3 text-zinc-400" />
                      {dateStr}
                    </span>
                  </div>

                  <div className="border-l border-zinc-200 dark:border-zinc-800 pl-4">
                    <span className="text-[10px] uppercase font-semibold text-zinc-400 block tracking-wider">
                      Status
                    </span>
                    <Badge
                      variant="outline"
                      className="border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 text-[10px] font-semibold uppercase tracking-wider"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    className="h-8 text-[11px] border-zinc-200 dark:border-zinc-800 gap-1 cursor-pointer"
                  >
                    <Printer className="h-3 w-3" />
                    <span>Print Receipt</span>
                  </Button>

                  <button
                    type="button"
                    onClick={() => toggleExpand(order.id)}
                    aria-label="Toggle order details"
                    className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Order Items Body */}
              {isExpanded && (
                <div className="p-5 space-y-4">
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                    {order.items.map((item) => (
                      <div
                        key={item.productId}
                        className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-10 w-10 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-zinc-500 font-mono">
                              Qty: {item.quantity} &times; ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-zinc-100 dark:bg-zinc-800" />

                  {/* Financial Breakdown & Destination */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1 text-zinc-600 dark:text-zinc-400">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                        Shipped To
                      </span>
                      <p className="font-medium text-zinc-900 dark:text-zinc-200">
                        {order.shippingAddress.fullName}
                      </p>
                      <p>
                        {order.shippingAddress.street}, {order.shippingAddress.postalCode}{" "}
                        {order.shippingAddress.city}
                      </p>
                      <p className="flex items-center gap-1.5 pt-1 text-[11px] text-zinc-500">
                        <CreditCard className="h-3 w-3" />
                        <span>
                          Payment: {order.paymentMethod.replace("_", " ").toUpperCase()}
                        </span>
                      </p>
                    </div>

                    <div className="space-y-1.5 text-zinc-600 dark:text-zinc-400 sm:text-right">
                      <div className="flex justify-between sm:justify-end gap-4">
                        <span className="text-zinc-500">Subtotal:</span>
                        <span className="font-mono">${order.subtotal.toFixed(2)}</span>
                      </div>

                      {order.discount && order.discount > 0 && (
                        <div className="flex justify-between sm:justify-end gap-4 text-emerald-600 dark:text-emerald-400 font-medium">
                          <span>
                            Discount {order.promoCode ? `(${order.promoCode})` : ""}:
                          </span>
                          <span className="font-mono">
                            -${order.discount.toFixed(2)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between sm:justify-end gap-4">
                        <span className="text-zinc-500">Shipping:</span>
                        <span className="font-mono">
                          {order.shippingCost === 0
                            ? "FREE"
                            : `$${order.shippingCost.toFixed(2)}`}
                        </span>
                      </div>

                      <div className="flex justify-between sm:justify-end gap-4">
                        <span className="text-zinc-500">Sales Tax (8%):</span>
                        <span className="font-mono">${order.tax.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between sm:justify-end gap-4 pt-1 border-t border-zinc-100 dark:border-zinc-800 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        <span>Total Paid:</span>
                        <span className="font-mono">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
