"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Check, AlertCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";

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
  const [added, setAdded] = React.useState(false);
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addItem(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Card
      onClick={() => onQuickView && onQuickView(product)}
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

          {/* Badges Container */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge
              variant="outline"
              className="border-zinc-200/90 bg-white/95 text-zinc-800 text-[11px] font-medium backdrop-blur-xs dark:border-zinc-700 dark:bg-zinc-900/95 dark:text-zinc-200"
            >
              {product.category}
            </Badge>

            {!product.inStock && (
              <Badge
                variant="destructive"
                className="bg-zinc-900 text-white text-[11px] font-medium dark:bg-zinc-100 dark:text-zinc-950"
              >
                Out of Stock
              </Badge>
            )}
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

        <Button
          size="sm"
          disabled={!product.inStock}
          onClick={handleAdd}
          className={
            added
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 transition-colors"
              : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors"
          }
        >
          {added ? (
            <>
              <Check className="mr-1 h-3.5 w-3.5" />
              Added
            </>
          ) : !product.inStock ? (
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
