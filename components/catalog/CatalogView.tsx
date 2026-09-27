"use client";

import React, { useState, useMemo } from "react";
import { Product } from "@/types/product";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import {
  CategoryPills,
  CategoryCount,
} from "@/components/search/CategoryPills";
import { SearchInput } from "@/components/search/SearchInput";

interface CatalogViewProps {
  products: Product[];
}

export function CatalogView({ products }: CatalogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: CategoryCount[] = useMemo(() => {
    const rawCategories = Array.from(
      new Set(products.map((p) => p.category)),
    ).sort();

    const trimmedQuery = searchQuery.trim().toLowerCase();
    const queryMatchedProducts = !trimmedQuery
      ? products
      : products.filter(
          (p) =>
            p.name.toLowerCase().includes(trimmedQuery) ||
            p.tagline.toLowerCase().includes(trimmedQuery) ||
            p.description.toLowerCase().includes(trimmedQuery),
        );

    return [
      { name: "All", count: queryMatchedProducts.length },
      ...rawCategories.map((cat) => ({
        name: cat,
        count: queryMatchedProducts.filter((p) => p.category === cat).length,
      })),
    ];
  }, [products, searchQuery]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const trimmedQuery = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !trimmedQuery ||
        product.name.toLowerCase().includes(trimmedQuery) ||
        product.tagline.toLowerCase().includes(trimmedQuery) ||
        product.description.toLowerCase().includes(trimmedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedCategory !== "All";

  const subtitle = useMemo(() => {
    if (searchQuery.trim() && selectedCategory !== "All") {
      return `Showing results for "${searchQuery.trim()}" in ${selectedCategory}.`;
    }
    if (searchQuery.trim()) {
      return `Showing results matching "${searchQuery.trim()}".`;
    }
    if (selectedCategory !== "All") {
      return `Curated collection of precision ${selectedCategory.toLowerCase()} hardware.`;
    }
    return "Explore our complete collection of engineered daily essentials.";
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <ProductGrid
        products={filteredProducts}
        title={selectedCategory === "All" ? "All Products" : selectedCategory}
        subtitle={subtitle}
        filterSlot={
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                className="max-w-md"
              />
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors self-start sm:self-auto cursor-pointer underline underline-offset-4"
                >
                  Reset filters
                </button>
              )}
            </div>

            <CategoryPills
              categories={categories}
              activeCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        }
      />
    </div>
  );
}
