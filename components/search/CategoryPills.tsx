"use client";

import React from "react";
import { cn } from "cn";

export interface CategoryCount {
  name: string;
  count: number;
}

interface CategoryPillsProps {
  categories: CategoryCount[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  className?: string;
}

export function CategoryPills({
  categories,
  activeCategory,
  onSelectCategory,
  className,
}: CategoryPillsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none",
        className
      )}
    >
      {categories.map((cat) => {
        const isActive = activeCategory === cat.name;

        return (
          <button
            key={cat.name}
            type="button"
            onClick={() => onSelectCategory(cat.name)}
            className={cn(
              "inline-flex items-center whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100",
              isActive
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950 shadow-none"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
            )}
          >
            <span>{cat.name}</span>
            <span
              className={cn(
                "ml-1.5 text-[10px] font-mono rounded-full px-1.5 py-0.5",
                isActive
                  ? "bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800"
                  : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
              )}
            >
              {cat.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
