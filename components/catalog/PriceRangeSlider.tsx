"use client";

import React, { useId } from "react";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  className = "",
}: PriceRangeSliderProps) {
  const [minVal, maxVal] = value;
  const minId = useId();
  const maxId = useId();

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), maxVal - 5);
    onChange([Math.max(min, newMin), maxVal]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), minVal + 5);
    onChange([minVal, Math.min(max, newMax)]);
  };

  // Calculate percentages for the highlighted range track
  const minPercent = Math.max(0, Math.min(100, ((minVal - min) / (max - min)) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((maxVal - min) / (max - min)) * 100));

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
        <span>Price Range</span>
        <span className="font-mono text-zinc-900 dark:text-zinc-100 font-semibold">
          ${Math.round(minVal)} - ${Math.round(maxVal)}
        </span>
      </div>

      <div className="relative h-6 flex items-center">
        {/* Background track */}
        <div className="absolute left-0 right-0 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />

        {/* Selected range highlight track */}
        <div
          className="absolute h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 transition-all pointer-events-none"
          style={{
            left: `${minPercent}%`,
            width: `${Math.max(0, maxPercent - minPercent)}%`,
          }}
        />

        {/* Min handle input */}
        <input
          id={minId}
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={handleMinChange}
          aria-label="Minimum price filter"
          className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-900 dark:[&::-webkit-slider-thumb]:border-zinc-100 [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-zinc-900 dark:[&::-moz-range-thumb]:border-zinc-100 [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:cursor-pointer"
        />

        {/* Max handle input */}
        <input
          id={maxId}
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={handleMaxChange}
          aria-label="Maximum price filter"
          className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-900 dark:[&::-webkit-slider-thumb]:border-zinc-100 [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-zinc-900 dark:[&::-moz-range-thumb]:border-zinc-100 [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500">
        <span>${min}</span>
        <span>${max}</span>
      </div>
    </div>
  );
}
