"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Product } from "@/types/product";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import {
  CategoryPills,
  CategoryCount,
} from "@/components/search/CategoryPills";
import { SearchInput } from "@/components/search/SearchInput";
import {
  RecentSearches,
  getRecentSearches,
  saveRecentSearch,
  clearRecentSearches,
} from "@/components/search/RecentSearches";
import {
  CatalogSortSelect,
  SortOption,
} from "@/components/catalog/CatalogSortSelect";
import { CatalogPagination } from "@/components/catalog/CatalogPagination";
import { useDebounce } from "@/hooks/useDebounce";

interface CatalogViewProps {
  products: Product[];
}

const ITEMS_PER_PAGE = 8;

export function CatalogView({ products }: CatalogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("featured");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Throttled debounced query (300ms delay) to prevent excessive re-renders (SCRUM-55)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Sync state from URL parameters on initial client mount (SCRUM-53) and load recent searches (SCRUM-56)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlCategory = params.get("category");
      const urlSort = params.get("sort") as SortOption | null;
      const urlPage = params.get("page");
      const urlQuery = params.get("q");

      if (urlCategory) {
        setSelectedCategory(urlCategory);
      }
      if (
        urlSort &&
        ["featured", "price-asc", "price-desc", "name-asc", "name-desc"].includes(
          urlSort,
        )
      ) {
        setSortOption(urlSort);
      }
      if (urlPage && !isNaN(Number(urlPage))) {
        setCurrentPage(Math.max(1, parseInt(urlPage, 10)));
      }
      if (urlQuery) {
        setSearchQuery(urlQuery);
      }

      setRecentSearches(getRecentSearches());
    }
  }, []);

  // Save debounced non-empty search terms to recent cache (SCRUM-56)
  useEffect(() => {
    const trimmed = debouncedSearchQuery.trim();
    if (trimmed.length >= 2) {
      saveRecentSearch(trimmed);
      setRecentSearches(getRecentSearches());
    }
  }, [debouncedSearchQuery]);

  const updateUrlParams = useCallback(
    (newCategory: string, newSort: SortOption, newPage: number, newQuery: string) => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams();
        if (newCategory !== "All") {
          params.set("category", newCategory);
        }
        if (newSort !== "featured") {
          params.set("sort", newSort);
        }
        if (newPage > 1) {
          params.set("page", newPage.toString());
        }
        if (newQuery.trim()) {
          params.set("q", newQuery.trim());
        }
        const queryString = params.toString();
        const newUrl = queryString
          ? `${window.location.pathname}?${queryString}`
          : window.location.pathname;
        window.history.replaceState(null, "", newUrl);
      }
    },
    [],
  );

  const categories: CategoryCount[] = useMemo(() => {
    const rawCategories = Array.from(
      new Set(products.map((p) => p.category)),
    ).sort();

    const trimmedQuery = debouncedSearchQuery.trim().toLowerCase();
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
  }, [products, debouncedSearchQuery]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const trimmedQuery = debouncedSearchQuery.trim().toLowerCase();
      const matchesSearch =
        !trimmedQuery ||
        product.name.toLowerCase().includes(trimmedQuery) ||
        product.tagline.toLowerCase().includes(trimmedQuery) ||
        product.description.toLowerCase().includes(trimmedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, debouncedSearchQuery]);

  // Apply sorting algorithm (SCRUM-51)
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortOption) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "name-asc":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case "featured":
      default:
        return list;
    }
  }, [filteredProducts, sortOption]);

  // Pagination calculation and slice handlers (SCRUM-52)
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

  const safeCurrentPage = useMemo(() => {
    if (totalPages === 0) return 1;
    return Math.min(currentPage, totalPages);
  }, [currentPage, totalPages]);

  const paginatedProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, safeCurrentPage]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    updateUrlParams(category, sortOption, 1, searchQuery);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortOption(newSort);
    setCurrentPage(1);
    updateUrlParams(selectedCategory, newSort, 1, searchQuery);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateUrlParams(selectedCategory, sortOption, newPage, searchQuery);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSelectRecentSearch = (term: string) => {
    setSearchQuery(term);
    setCurrentPage(1);
    updateUrlParams(selectedCategory, sortOption, 1, term);
  };

  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setSortOption("featured");
    setCurrentPage(1);
    updateUrlParams("All", "featured", 1, "");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All" ||
    sortOption !== "featured";

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
        products={paginatedProducts}
        title={selectedCategory === "All" ? "All Products" : selectedCategory}
        subtitle={subtitle}
        filterSlot={
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <SearchInput
                  value={searchQuery}
                  onChange={(val) => {
                    setSearchQuery(val);
                    setCurrentPage(1);
                    updateUrlParams(selectedCategory, sortOption, 1, val);
                  }}
                  onSubmit={(val) => {
                    saveRecentSearch(val);
                    setRecentSearches(getRecentSearches());
                  }}
                  className="max-w-md"
                />
                <CatalogSortSelect
                  value={sortOption}
                  onChange={handleSortChange}
                  className="sm:w-52"
                />
              </div>

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

            {/* Recent Searches chips cache */}
            <RecentSearches
              searches={recentSearches}
              onSelectSearch={handleSelectRecentSearch}
              onClearRecent={handleClearRecent}
            />

            <CategoryPills
              categories={categories}
              activeCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          </div>
        }
        paginationSlot={
          <CatalogPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={sortedProducts.length}
            pageSize={ITEMS_PER_PAGE}
          />
        }
      />
    </div>
  );
}
