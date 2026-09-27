"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { cn } from "cn";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = "Search products, descriptions, or specs...",
  className,
}: SearchInputProps) {
  const handleClear = () => {
    onChange("");
    if (onClear) onClear();
  };

  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <Search className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-10 w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-9 text-sm text-zinc-900",
          "placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900",
          "dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500",
          "dark:focus:border-zinc-100 dark:focus:ring-zinc-100 transition-colors",
        )}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search query"
          className="absolute right-2.5 p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
