"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Breadcrumbs } from "@/components/storefront/Breadcrumbs";
import { ProfileCard } from "@/components/account/ProfileCard";
import { AddressManager } from "@/components/account/AddressManager";
import { OrderHistory } from "@/components/account/OrderHistory";
import { getSavedAddresses, SavedAddress } from "@/lib/addresses";
import { getUserOrders } from "@/lib/orders";
import { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import {
  Lock,
  ArrowLeft,
  PackageCheck,
  MapPin,
  ShieldAlert,
} from "lucide-react";

export default function AccountPage() {
  const { user, isAuthenticated, isLoading, logout, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<"orders" | "addresses">("orders");
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      setAddresses(getSavedAddresses(user.id, user.name, user.email));
      setOrders(getUserOrders(user.id));
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent dark:border-zinc-100" />
          <p className="text-xs text-zinc-500">Authenticating customer account...</p>
        </div>
      </div>
    );
  }

  // Mandatory Course Route Guard: Access to /account without auth must be blocked
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 mb-5">
            <Lock className="h-7 w-7" />
          </div>

          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
            Account Access Required
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
            Please sign in or register to view your profile, saved shipping
            addresses, and past order receipts.
          </p>

          <div className="space-y-2.5">
            <Button
              onClick={() => openAuthModal("login", "/account")}
              className="w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 text-xs h-10 font-medium cursor-pointer"
            >
              Sign In to Your Account
            </Button>
            <Button
              variant="outline"
              onClick={() => openAuthModal("register", "/account")}
              className="w-full border-zinc-200 dark:border-zinc-800 text-xs h-10 font-medium cursor-pointer"
            >
              Create New Account
            </Button>
            <Link href="/catalog" className="inline-block pt-2">
              <span className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 underline underline-offset-4 flex items-center gap-1 cursor-pointer">
                <ArrowLeft className="h-3 w-3" />
                Return to product catalog
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
        <Breadcrumbs />

        {/* Profile Details Header Card (SCRUM-87) */}
        <ProfileCard user={user} onLogout={logout} />

        {/* Navigation Tabs (Orders vs Saved Addresses) */}
        <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "orders"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
          >
            <PackageCheck className="h-4 w-4" />
            <span>Order History</span>
            <span
              className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === "orders"
                  ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900"
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              }`}
            >
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("addresses")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "addresses"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Saved Addresses</span>
            <span
              className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === "addresses"
                  ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900"
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              }`}
            >
              {addresses.length}
            </span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="pt-2">
          {activeTab === "orders" ? (
            <OrderHistory orders={orders} />
          ) : (
            <AddressManager
              userId={user.id}
              userName={user.name}
              userEmail={user.email}
              addresses={addresses}
              onAddressesChange={setAddresses}
            />
          )}
        </div>
      </div>
    </div>
  );
}
