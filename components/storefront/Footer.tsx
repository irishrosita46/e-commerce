import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 text-white font-semibold text-xs dark:bg-zinc-100 dark:text-zinc-950">
                A
              </div>
              <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                AuraStore
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Curated minimal lifestyle goods, precision electronics, and
              essentials. Built for IT Agile Development.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Navigation
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Storefront Home
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog"
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Customer Support
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li className="text-zinc-500">Fast Shipping & Tracking</li>
              <li className="text-zinc-500">Protected Auth Checkout</li>
              <li className="text-zinc-500">Simulated Payment Gateway</li>
            </ul>
          </div>

          {/* Academic / Project Governance */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Project Governance
            </h3>
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              UE Germany Agile Development assessment for Dr. Naghmeh Niknejad.
              Tracked across Jira, Confluence, and GitHub.
            </p>
          </div>
        </div>

        <Separator className="my-8 bg-zinc-200 dark:bg-zinc-800" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} AuraStore Team. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
