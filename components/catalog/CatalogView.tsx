"use client";

import React, { useState, useMemo } from "react";
import { Product } from "@/types/product";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { CategoryPills, CategoryCount } from "@/components/search/CategoryPills";

interface CatalogViewProps {
  products: Product[];
}

export function CatalogView({ products }: CatalogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories: CategoryCount[] = useMemo(() => {
    const rawCategories = Array.from(
      new Set(products.map((p) => p.category))
    ).sort();

    return [
      { name: "All", count: products.length },
      ...rawCategories.map((cat) => ({
        name: cat,
        count: products.filter((p) => p.category === cat).length,
      })),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <ProductGrid
        products={filteredProducts}
        title={selectedCategory === "All" ? "All Products" : selectedCategory}
        subtitle={
          selectedCategory === "All"
            ? "Explore our complete collection of engineered daily essentials."
            : `Curated collection of precision ${selectedCategory.toLowerCase()} hardware.`
        }
        filterSlot={
          <CategoryPills
            categories={categories}
            activeCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        }
      />
    </div>
  );
}
