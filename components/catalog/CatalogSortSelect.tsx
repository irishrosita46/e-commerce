"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowUpDown, ChevronDown, Check } from "lucide-react";

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

interface CatalogSortSelectProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
  className?: string;
}

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

export const SORT_LABELS: Record<SortOption, string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "name-asc": "Name: A to Z",
  "name-desc": "Name: Z to A",
};

export function CatalogSortSelect({
  value,
  onChange,
  className = "",
}: CatalogSortSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (option: SortOption) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-full sm:w-auto ${className}`}
    >
      <label id="catalog-sort-label" className="sr-only">
        Sort products
      </label>

      {/* Trigger Button: Exactly matching SearchInput height (h-10), text-sm and styling */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="catalog-sort-label"
        className="flex h-10 w-full items-center justify-between gap-2.5 rounded-lg border border-zinc-200 bg-white px-3.5 text-sm text-zinc-900 transition-colors hover:border-zinc-300 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:border-zinc-700 dark:focus:border-zinc-100 dark:focus:ring-zinc-100 cursor-pointer"
      >
        <div className="flex items-center gap-2 truncate">
          <ArrowUpDown className="h-4 w-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
          <span className="truncate text-xs">
            <span className="text-zinc-500 dark:text-zinc-400 font-normal">
              Sort:{" "}
            </span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {SORT_LABELS[value]}
            </span>
          </span>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-zinc-400 dark:text-zinc-500 shrink-0 transition-transform duration-200 ease-in-out ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Floating Animated Dropdown Menu with slide up/down transition */}
      <div
        role="listbox"
        aria-labelledby="catalog-sort-label"
        className={`absolute right-0 top-full mt-1.5 z-50 w-full min-w-[210px] origin-top rounded-lg border border-zinc-200 bg-white p-1.5 shadow-lg dark:border-zinc-800 dark:bg-zinc-950 transition-all duration-200 ease-out ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
        }`}
      >
        {SORT_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => handleSelect(opt.value)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                isSelected
                  ? "bg-zinc-100 text-zinc-950 font-semibold dark:bg-zinc-900 dark:text-zinc-50"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-100"
              }`}
            >
              <span>{opt.label}</span>
              {isSelected && (
                <Check className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
