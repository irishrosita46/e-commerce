"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Check, AlertCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getProductStock, isLowStock, isOutOfStock } from "@/lib/inventory";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({
  product,
  onAddToCart,
  onQuickView,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const initialStock = product.stock ?? (product.inStock ? 10 : 0);
  const [currentStock, setCurrentStock] = useState<number>(initialStock);

  useEffect(() => {
    // Sync with persistent inventory state in localStorage (SCRUM-75)
    setCurrentStock(getProductStock(product.id, initialStock));

    const handleInventoryChange = (e: Event) => {
      const customEvent = e as CustomEvent<Record<string, number>>;
      if (customEvent.detail && product.id in customEvent.detail) {
        setCurrentStock(customEvent.detail[product.id]);
      } else {
        setCurrentStock(getProductStock(product.id, initialStock));
      }
    };

    window.addEventListener("aurastore:inventory-updated", handleInventoryChange);
    window.addEventListener("storage", handleInventoryChange);
    return () => {
      window.removeEventListener("aurastore:inventory-updated", handleInventoryChange);
      window.removeEventListener("storage", handleInventoryChange);
    };
  }, [product.id, initialStock]);

  const outOfStock = isOutOfStock(currentStock);
  const lowStock = isLowStock(currentStock);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (outOfStock) return;
    if (onAddToCart) {
      onAddToCart({ ...product, stock: currentStock, inStock: !outOfStock });
    } else {
      addItem({ ...product, stock: currentStock, inStock: !outOfStock });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Card
      onClick={() => onQuickView && onQuickView({ ...product, stock: currentStock, inStock: !outOfStock })}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-200 bg-white p-0 shadow-none transition-all duration-200 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 cursor-pointer"
    >
      <div>
        {/* Product Image Frame */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800/60">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-103"
            priority={product.featured}
          />

          {/* Badges Container (SCRUM-76: Low-Stock and Out-of-Stock Badges) */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge
              variant="outline"
              className="border-zinc-200/90 bg-white/95 text-zinc-800 text-[11px] font-medium backdrop-blur-xs dark:border-zinc-700 dark:bg-zinc-900/95 dark:text-zinc-200"
            >
              {product.category}
            </Badge>

            {outOfStock ? (
              <Badge
                variant="destructive"
                className="bg-zinc-900 text-white text-[11px] font-medium dark:bg-zinc-100 dark:text-zinc-950"
              >
                Out of Stock
              </Badge>
            ) : lowStock ? (
              <Badge
                variant="outline"
                className="border-amber-400/90 bg-amber-50/95 text-amber-900 text-[11px] font-semibold backdrop-blur-xs dark:border-amber-500/60 dark:bg-amber-950/90 dark:text-amber-200 flex items-center gap-1"
              >
                <AlertCircle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                <span>Only {currentStock} left</span>
              </Badge>
            ) : null}
          </div>
        </div>

        {/* Product Details Content */}
        <CardContent className="p-4 sm:p-5">
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold text-zinc-900 line-clamp-1 group-hover:text-zinc-700 dark:text-zinc-100 dark:group-hover:text-zinc-300">
              {product.name}
            </h3>
            <p className="text-xs text-zinc-500 line-clamp-2 dark:text-zinc-400 leading-relaxed min-h-[32px]">
              {product.tagline}
            </p>
          </div>
        </CardContent>
      </div>

      {/* Pricing & Footer Action */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900 mt-2">
        <div className="flex flex-col">
          <span className="text-[10px] tracking-wider text-zinc-400 uppercase font-medium">
            Price
          </span>
          <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* SCRUM-77: Disable add-to-cart dynamically when stock is zero */}
        <Button
          size="sm"
          disabled={outOfStock}
          onClick={handleAdd}
          className={`h-10 px-4 sm:h-8 sm:px-3 ${
            added
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 transition-colors"
              : outOfStock
              ? "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed"
              : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors"
          }`}
        >
          {added ? (
            <>
              <Check className="mr-1 h-3.5 w-3.5" />
              Added
            </>
          ) : outOfStock ? (
            "Unavailable"
          ) : (
            <>
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
