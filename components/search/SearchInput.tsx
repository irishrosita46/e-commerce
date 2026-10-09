"use client";

import React, { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "cn";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  onSubmit,
  placeholder = "Search products, descriptions, or specs...",
  className,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut (Cmd+K / Ctrl+K) to focus search input instantly (SCRUM-57)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClear = () => {
    onChange("");
    if (onClear) onClear();
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <Search className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "h-10 w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-12 text-sm text-zinc-900",
          "placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900",
          "dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500",
          "dark:focus:border-zinc-100 dark:focus:ring-zinc-100 transition-colors",
        )}
      />

      {value ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search query"
          className="absolute right-2.5 p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : (
        <kbd
          title="Press Cmd+K or Ctrl+K to search"
          className="pointer-events-none absolute right-2.5 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-200 bg-zinc-100 px-1.5 font-mono text-[10px] font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
        >
          ⌘K
        </kbd>
      )}
    </div>
  );
}
