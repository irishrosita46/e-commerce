"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to debounce any rapidly changing value by a specified delay.
 * Useful for throttling text input searches and API queries.
 *
 * @param value The value to debounce.
 * @param delay Milliseconds to delay updates (default: 300ms).
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

