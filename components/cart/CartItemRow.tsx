"use client";

import React from "react";
import Image from "next/image";
import { CartItem } from "@/context/CartContext";
import { Plus, Minus, Trash2 } from "lucide-react";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const { product, quantity } = item;
  const lineTotal = product.price * quantity;

  return (
    <div className="flex gap-4 rounded-lg border border-zinc-100 p-3 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30 transition-colors hover:border-zinc-200 dark:hover:border-zinc-800">
      {/* Product Thumbnail */}
      <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="72px"
          className="object-cover"
        />
      </div>

      {/* Item Info & Quantity Controls */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {product.name}
            </h4>
            <button
              type="button"
              onClick={() => onRemove(product.id)}
              className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer p-0.5"
              title="Remove item"
              aria-label={`Remove ${product.name}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
            <span className="truncate">{product.category}</span>
            <span>•</span>
            <span className="font-mono">${product.price.toFixed(2)} each</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2.5">
          {/* Quantity Stepper */}
          <div className="flex items-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <button
              type="button"
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              className="flex h-6 w-6 items-center justify-center text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 cursor-pointer transition-colors"
              aria-label={`Decrease quantity of ${product.name}`}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span
              className="w-7 text-center text-xs font-medium text-zinc-900 dark:text-zinc-100 font-mono"
              aria-label={`Quantity: ${quantity}`}
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              className="flex h-6 w-6 items-center justify-center text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 cursor-pointer transition-colors"
              aria-label={`Increase quantity of ${product.name}`}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Line Item Subtotal */}
          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
            ${lineTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
