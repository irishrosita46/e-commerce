"use client";

import React, { useState } from "react";
import { Tag, Check, X, AlertCircle } from "lucide-react";
import { PromoCode } from "@/types/order";

interface PromoCodeInputProps {
  appliedPromo: PromoCode | null;
  onApply: (code: string) => { success: boolean; error?: string };
  onRemove: () => void;
  className?: string;
}

export function PromoCodeInput({
  appliedPromo,
  onApply,
  onRemove,
  className = "",
}: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setError(null);
    const result = onApply(code);
    if (!result.success) {
      setError(result.error || "Invalid promo code.");
    } else {
      setCode("");
    }
  };

  const handleApplyPreset = (preset: string) => {
    setError(null);
    const result = onApply(preset);
    if (!result.success) {
      setError(result.error || "Invalid promo code.");
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {appliedPromo ? (
        <div className="flex items-center justify-between p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50/60 dark:bg-emerald-950/40 text-xs">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <span className="font-mono font-bold text-emerald-900 dark:text-emerald-200 uppercase">
                {appliedPromo.code}
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 ml-1.5 text-[11px]">
                ({appliedPromo.description})
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove promo code"
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 cursor-pointer transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  if (error) setError(null);
                }}
                placeholder="PROMO CODE"
                className="w-full h-10 sm:h-8 pl-8 pr-2.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs uppercase font-mono tracking-wider text-zinc-900 dark:text-zinc-100 placeholder:normal-case placeholder:font-sans placeholder:tracking-normal placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>
            <button
              type="submit"
              disabled={!code.trim()}
              className="h-10 sm:h-8 px-3 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Apply
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-[11px] text-red-600 dark:text-red-400 pt-0.5">
              <AlertCircle className="h-3 w-3" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 flex-wrap pt-0.5">
            <span>Try:</span>
            <button
              type="button"
              onClick={() => handleApplyPreset("AURA10")}
              className="inline-flex min-h-9 items-center px-1 font-mono text-zinc-600 dark:text-zinc-300 underline hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
            >
              AURA10
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => handleApplyPreset("FREESHIP")}
              className="inline-flex min-h-9 items-center px-1 font-mono text-zinc-600 dark:text-zinc-300 underline hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
            >
              FREESHIP
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
