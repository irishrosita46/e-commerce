"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";

export function StorefrontBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if not previously dismissed by the customer
    const dismissed = localStorage.getItem("aurastore_banner_dismissed");
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem("aurastore_banner_dismissed", "true");
    } catch {
      // Ignore storage write issues in restricted private mode
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      aria-label="Store announcement"
      className="relative z-50 flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-2 text-xs text-zinc-100 sm:px-6 lg:px-8"
    >
      <div className="flex flex-1 items-center justify-center gap-2 text-center">
        <span className="font-medium text-white">Sprint 2 Launch Offer:</span>
        <span className="text-zinc-300">
          Complimentary standard shipping across Germany on orders over €50. Use
          code{" "}
          <strong className="font-semibold text-white tracking-wide">
            FREESHIP
          </strong>
        </span>
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss announcement banner"
        className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </aside>
  );
}
