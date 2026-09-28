"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Search, User, Menu, X, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface NavbarProps {
  cartItemCount?: number;
  userName?: string | null;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
}

export default function Navbar({
  cartItemCount = 0,
  userName = null,
  onLoginClick,
  onLogoutClick,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const effectiveCartCount = cartItemCount > 0 ? cartItemCount : totalItems;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 text-white font-semibold text-sm dark:bg-zinc-100 dark:text-zinc-950">
              A
            </div>
            <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              AuraStore
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <Link
              href="/"
              className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
            >
              Home
            </Link>
            <Link
              href="/catalog"
              className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
            >
              Catalog
            </Link>
            <Link
              href="/categories"
              className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
            >
              About
            </Link>
          </nav>
        </div>

        {/* Action Controls: Search, Auth & Cart */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <Link
            href="/catalog"
            className="hidden sm:flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50/70 px-3 py-1.5 text-xs text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search products...</span>
          </Link>

          {/* User Account / Auth */}
          {userName ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-zinc-500" />
                {userName}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogoutClick}
                className="h-8 px-2.5 text-xs border-zinc-200 dark:border-zinc-800"
              >
                <LogOut className="h-3.5 w-3.5 mr-1" />
                Sign out
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={onLoginClick}
              className="h-8 px-3.5 text-xs bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Sign in
            </Button>
          )}

          {/* Cart Icon with shadcn Badge & Drawer Trigger */}
          <Button
            variant="outline"
            size="icon"
            onClick={openCart}
            className="relative h-8 w-8 border-zinc-200 dark:border-zinc-800 cursor-pointer"
            aria-label={`Shopping Cart (${effectiveCartCount} items)`}
          >
            <ShoppingBag className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
            {effectiveCartCount > 0 && (
              <Badge
                variant="default"
                className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full p-0 px-1 text-[10px] font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                {effectiveCartCount}
              </Badge>
            )}
          </Button>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="h-8 w-8 md:hidden text-zinc-600 dark:text-zinc-400"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-3 md:hidden dark:border-zinc-800 dark:bg-zinc-950">
          <nav className="flex flex-col gap-2 text-sm font-medium">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Home
            </Link>
            <Link
              href="/catalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Catalog
            </Link>
            <Link
              href="/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Categories
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
