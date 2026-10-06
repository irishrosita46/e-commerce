"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";

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
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <label htmlFor="catalog-sort-select" className="sr-only">
        Sort products
      </label>
      <div className="pointer-events-none absolute left-2.5 flex items-center text-zinc-400 dark:text-zinc-500">
        <ArrowUpDown className="h-3.5 w-3.5" />
      </div>
      <select
        id="catalog-sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="h-9 w-full appearance-none rounded-lg border border-zinc-200 bg-white pl-8 pr-8 text-xs font-medium text-zinc-700 shadow-xs transition hover:border-zinc-300 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700 dark:focus:border-zinc-100 dark:focus:ring-zinc-100 cursor-pointer"
      >
        <option value="featured">Sort: Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name-asc">Name: A to Z</option>
        <option value="name-desc">Name: Z to A</option>
      </select>
      <div className="pointer-events-none absolute right-2.5 flex items-center text-zinc-400 dark:text-zinc-500">
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}

