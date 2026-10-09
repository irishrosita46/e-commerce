"use client";

import React from "react";
import { History, X } from "lucide-react";

const STORAGE_KEY = "aurastore_recent_searches";
const MAX_RECENT_ITEMS = 5;

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(query: string): void {
  if (typeof window === "undefined") return;
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return;

  try {
    const current = getRecentSearches();
    const updated = [trimmed, ...current.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(
      0,
      MAX_RECENT_ITEMS,
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Graceful handling for storage quota or restricted access
  }
}

export function clearRecentSearches(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore error in restricted storage mode
  }
}

interface RecentSearchesProps {
  searches: string[];
  onSelectSearch: (term: string) => void;
  onClearRecent: () => void;
  className?: string;
}

export function RecentSearches({
  searches,
  onSelectSearch,
  onClearRecent,
  className = "",
}: RecentSearchesProps) {
  if (!searches || searches.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Recent search queries"
      className={`flex flex-wrap items-center gap-1.5 pt-1 text-xs text-zinc-500 dark:text-zinc-400 ${className}`}
    >
      <div className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500 font-medium mr-1">
        <History className="h-3 w-3" />
        <span>Recent:</span>
      </div>

      {searches.map((term) => (
        <button
          key={term}
          type="button"
          onClick={() => onSelectSearch(term)}
          className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50/70 px-2 py-0.5 text-xs text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-100 cursor-pointer"
        >
          {term}
        </button>
      ))}

      <button
        type="button"
        onClick={onClearRecent}
        title="Clear recent searches"
        aria-label="Clear recent searches"
        className="ml-1 inline-flex items-center rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

