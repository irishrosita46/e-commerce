"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/catalog/ProductCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Plus, Check } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export function ProductGrid({
  products,
  title = "Curated Catalog",
  subtitle = "Precision engineered hardware and workplace essentials.",
}: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogAdded, setDialogAdded] = useState(false);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setDialogAdded(false);
  };

  const handleDialogAdd = () => {
    if (!selectedProduct || !selectedProduct.inStock) return;
    setDialogAdded(true);
    setTimeout(() => setDialogAdded(false), 1500);
  };

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-800">
        <Package className="h-10 w-10 text-zinc-400" />
        <h3 className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          No products found
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Check back later as new inventory is currently being scaffolded.
        </p>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-zinc-900 dark:bg-zinc-100" />
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Inventory
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
              {title}
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </p>
          </div>

          <div className="text-xs text-zinc-400 font-mono">
            Showing {products.length} {products.length === 1 ? "item" : "items"}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={handleQuickView}
            />
          ))}
        </div>
      </div>

      {/* Quick View Dialog */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      >
        {selectedProduct && (
          <DialogContent className="max-w-2xl border-zinc-200 bg-white p-0 shadow-none dark:border-zinc-800 dark:bg-zinc-950 sm:rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Product Image Frame */}
              <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col justify-between space-y-4">
                <DialogHeader className="space-y-2 text-left">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-zinc-200 bg-zinc-50 text-zinc-800 text-[11px] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                    >
                      {selectedProduct.category}
                    </Badge>
                    <Badge
                      variant={selectedProduct.inStock ? "outline" : "destructive"}
                      className={
                        selectedProduct.inStock
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800 text-[11px] dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : "text-[11px]"
                      }
                    >
                      {selectedProduct.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>

                  <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
                    {selectedProduct.name}
                  </DialogTitle>

                  <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pt-1">
                    {selectedProduct.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
                      Total Price
                    </span>
                    <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                      ${selectedProduct.price.toFixed(2)}
                    </span>
                  </div>

                  <Button
                    disabled={!selectedProduct.inStock}
                    onClick={handleDialogAdd}
                    className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
                  >
                    {dialogAdded ? (
                      <>
                        <Check className="mr-1.5 h-4 w-4" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <Plus className="mr-1.5 h-4 w-4" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
