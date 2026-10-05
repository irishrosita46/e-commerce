"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { StorefrontBanner } from "@/components/storefront/StorefrontBanner";

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
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const { totalItems, openCart } = useCart();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  const effectiveCartCount = cartItemCount > 0 ? cartItemCount : totalItems;
  const effectiveUserName = userName || (isAuthenticated ? user?.name : null);
  const handleLoginClick = onLoginClick || (() => openAuthModal("login"));
  const handleLogoutClick = onLogoutClick || logout;

  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : Boolean(pathname?.startsWith(href));

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/catalog", label: "Catalog" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About" },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    }
    if (isUserDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  return (
    <>
      <StorefrontBanner />
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

            {/* Desktop Navigation Links with Active Indicators */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 rounded-sm ${
                      active
                        ? "text-zinc-950 font-semibold dark:text-zinc-50 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-zinc-900 dark:after:bg-zinc-100"
                        : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

        {/* Action Controls: Search, Cart, & Auth */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <Link
            href="/catalog"
            className="hidden sm:flex h-8 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/70 px-3 text-xs text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search products...</span>
          </Link>

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

          {/* User Account & Sign Out (Positioned on the right of Cart with matching outline borders) */}
          {effectiveUserName ? (
            <div className="flex items-center gap-2">
              {/* User Dropdown Menu Trigger */}
              <div className="relative" ref={userDropdownRef}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="h-8 w-8 border-zinc-200 dark:border-zinc-800 text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-100 cursor-pointer"
                  title={`Account: ${effectiveUserName}`}
                  aria-label={`Account of ${effectiveUserName}`}
                  aria-expanded={isUserDropdownOpen}
                >
                  <User className="h-4 w-4" />
                </Button>

                {/* Dropdown Menu showing name, email, and actions */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-950 z-50 animate-in fade-in-0 zoom-in-95">
                    <div className="px-2.5 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {effectiveUserName}
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/checkout"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <ShoppingBag className="h-3.5 w-3.5 text-zinc-500" />
                          <span>Checkout Portal</span>
                        </span>
                        <ChevronRight className="h-3 w-3 text-zinc-400" />
                      </Link>
                    </div>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 pt-1 mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          setIsSignOutDialogOpen(true);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50/70 dark:text-red-400 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sign out Icon Button with confirmation dialog trigger */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSignOutDialogOpen(true)}
                className="h-8 w-8 border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:border-red-200 hover:bg-red-50/50 hover:text-red-600 dark:text-zinc-400 dark:hover:border-red-900/60 dark:hover:bg-red-950/30 dark:hover:text-red-400 cursor-pointer transition-colors"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={handleLoginClick}
              className="h-8 w-8 border-zinc-200 dark:border-zinc-800 text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-100 cursor-pointer"
              title="Sign in / Register"
              aria-label="Sign in"
            >
              <User className="h-4 w-4" />
            </Button>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="h-8 w-8 md:hidden border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-pointer"
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
          <nav className="flex flex-col gap-1.5 text-sm font-medium">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-md px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-zinc-100 font-semibold text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
              {effectiveUserName ? (
                <div className="flex items-center justify-between px-3 py-1">
                  <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-[180px]">
                    {effectiveUserName}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignOutDialogOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    handleLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-xs h-9 bg-zinc-900 text-white"
                >
                  Sign in / Register
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Sign Out Confirmation Dialog */}
      <Dialog open={isSignOutDialogOpen} onOpenChange={setIsSignOutDialogOpen}>
        <DialogContent className="w-full max-w-sm border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:rounded-2xl">
          <DialogHeader className="space-y-2 text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 mb-1">
              <LogOut className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Sign out of AuraStore?
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Are you sure you want to sign out, {effectiveUserName}? Your cart
              items will remain safely stored in this browser session.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex items-center justify-end gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSignOutDialogOpen(false)}
              className="text-xs h-9 border-zinc-200 dark:border-zinc-800 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setIsSignOutDialogOpen(false);
                handleLogoutClick();
              }}
              className="text-xs h-9 bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 font-medium cursor-pointer"
            >
              Sign out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  </>
);
}
