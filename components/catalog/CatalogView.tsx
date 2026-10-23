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
import { PriceRangeSlider } from "@/components/catalog/PriceRangeSlider";
import { filterCatalogProducts } from "@/lib/filter";
import { getStoredInventory } from "@/lib/inventory";
import { useDebounce } from "@/hooks/useDebounce";

interface CatalogViewProps {
  products: Product[];
}

const ITEMS_PER_PAGE = 8;

export function CatalogView({ products }: CatalogViewProps) {
  const { catalogMinPrice, catalogMaxPrice } = useMemo(() => {
    if (products.length === 0) return { catalogMinPrice: 0, catalogMaxPrice: 500 };
    const prices = products.map((p) => p.price);
    return {
      catalogMinPrice: Math.floor(Math.min(...prices)),
      catalogMaxPrice: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("featured");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([catalogMinPrice, catalogMaxPrice]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [liveInventory, setLiveInventory] = useState<Record<string, number>>(() => getStoredInventory());

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
      const urlMinPrice = params.get("minPrice");
      const urlMaxPrice = params.get("maxPrice");
      const urlInStock = params.get("inStock");
      const urlTag = params.get("tag");

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
      if (urlMinPrice || urlMaxPrice) {
        const minP = urlMinPrice ? Number(urlMinPrice) : catalogMinPrice;
        const maxP = urlMaxPrice ? Number(urlMaxPrice) : catalogMaxPrice;
        setPriceRange([minP, maxP]);
      }
      if (urlInStock === "true") {
        setInStockOnly(true);
      }
      if (urlTag) {
        setSelectedTag(urlTag);
      }

      setRecentSearches(getRecentSearches());
    }
  }, [catalogMinPrice, catalogMaxPrice]);

  // Subscribe to live inventory events dispatched by orders
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleInventoryUpdate = (e: Event) => {
      const customEvt = e as CustomEvent<Record<string, number>>;
      if (customEvt.detail) {
        setLiveInventory({ ...customEvt.detail });
      } else {
        setLiveInventory(getStoredInventory());
      }
    };

    window.addEventListener("aurastore:inventory-updated", handleInventoryUpdate);
    window.addEventListener("storage", handleInventoryUpdate);

    return () => {
      window.removeEventListener("aurastore:inventory-updated", handleInventoryUpdate);
      window.removeEventListener("storage", handleInventoryUpdate);
    };
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
    (
      newCategory: string,
      newSort: SortOption,
      newPage: number,
      newQuery: string,
      newRange: [number, number],
      newInStock: boolean,
      newTag: string,
    ) => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams();
        if (newCategory !== "All") params.set("category", newCategory);
        if (newSort !== "featured") params.set("sort", newSort);
        if (newPage > 1) params.set("page", newPage.toString());
        if (newQuery.trim()) params.set("q", newQuery.trim());
        if (newRange[0] > catalogMinPrice) params.set("minPrice", newRange[0].toString());
        if (newRange[1] < catalogMaxPrice) params.set("maxPrice", newRange[1].toString());
        if (newInStock) params.set("inStock", "true");
        if (newTag !== "All") params.set("tag", newTag);

        const queryString = params.toString();
        const newUrl = queryString
          ? `${window.location.pathname}?${queryString}`
          : window.location.pathname;
        window.history.replaceState(null, "", newUrl);
      }
    },
    [catalogMinPrice, catalogMaxPrice],
  );

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    products.forEach((p) => {
      p.tags?.forEach((t) => tagSet.add(t));
    });
    return ["All", ...Array.from(tagSet).sort()];
  }, [products]);

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

  // Combined Multi-Facet Evaluation (SCRUM-81)
  const filteredProducts = useMemo(() => {
    return filterCatalogProducts(
      products,
      {
        category: selectedCategory,
        query: debouncedSearchQuery,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        inStockOnly,
        selectedTag,
      },
      liveInventory,
    );
  }, [
    products,
    selectedCategory,
    debouncedSearchQuery,
    priceRange,
    inStockOnly,
    selectedTag,
    liveInventory,
  ]);

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
    updateUrlParams(category, sortOption, 1, searchQuery, priceRange, inStockOnly, selectedTag);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortOption(newSort);
    setCurrentPage(1);
    updateUrlParams(selectedCategory, newSort, 1, searchQuery, priceRange, inStockOnly, selectedTag);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateUrlParams(selectedCategory, sortOption, newPage, searchQuery, priceRange, inStockOnly, selectedTag);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePriceRangeChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
    setCurrentPage(1);
    updateUrlParams(selectedCategory, sortOption, 1, searchQuery, newRange, inStockOnly, selectedTag);
  };

  const handleInStockToggle = (checked: boolean) => {
    setInStockOnly(checked);
    setCurrentPage(1);
    updateUrlParams(selectedCategory, sortOption, 1, searchQuery, priceRange, checked, selectedTag);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setCurrentPage(1);
    updateUrlParams(selectedCategory, sortOption, 1, searchQuery, priceRange, inStockOnly, tag);
  };

  const handleSelectRecentSearch = (term: string) => {
    setSearchQuery(term);
    setCurrentPage(1);
    updateUrlParams(selectedCategory, sortOption, 1, term, priceRange, inStockOnly, selectedTag);
  };

  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setSortOption("featured");
    setPriceRange([catalogMinPrice, catalogMaxPrice]);
    setInStockOnly(false);
    setSelectedTag("All");
    setCurrentPage(1);
    updateUrlParams("All", "featured", 1, "", [catalogMinPrice, catalogMaxPrice], false, "All");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All" ||
    sortOption !== "featured" ||
    priceRange[0] > catalogMinPrice ||
    priceRange[1] < catalogMaxPrice ||
    inStockOnly ||
    selectedTag !== "All";

  const activeFilterCount = [
    searchQuery.trim() !== "",
    selectedCategory !== "All",
    sortOption !== "featured",
    priceRange[0] > catalogMinPrice || priceRange[1] < catalogMaxPrice,
    inStockOnly,
    selectedTag !== "All",
  ].filter(Boolean).length;

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
          <div className="space-y-4">
            {/* Top row: search input, sort dropdown, filter toggle button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <SearchInput
                  value={searchQuery}
                  onChange={(val) => {
                    setSearchQuery(val);
                    setCurrentPage(1);
                    updateUrlParams(selectedCategory, sortOption, 1, val, priceRange, inStockOnly, selectedTag);
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
                <button
                  type="button"
                  onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                  aria-expanded={isFilterPanelOpen}
                  aria-label="Toggle filters panel"
                  className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    isFilterPanelOpen || activeFilterCount > 0
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                      : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                    />
                  </svg>
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] rounded-full bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors self-start sm:self-auto cursor-pointer underline underline-offset-4"
                >
                  Reset all filters
                </button>
              )}
            </div>

            {/* Expandable Multi-Facet Filter Drawer (SCRUM-78, SCRUM-79, SCRUM-80) */}
            {isFilterPanelOpen && (
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/70 backdrop-blur-sm space-y-4 animate-in fade-in-50 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Price Range Slider facet (SCRUM-79) */}
                  <div className="space-y-1">
                    <PriceRangeSlider
                      min={catalogMinPrice}
                      max={catalogMaxPrice}
                      value={priceRange}
                      onChange={handlePriceRangeChange}
                    />
                  </div>

                  {/* Availability & In-Stock toggle facet (SCRUM-80) */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between sm:justify-end gap-4 sm:pl-4 sm:border-l border-zinc-200 dark:border-zinc-800">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={inStockOnly}
                          onChange={(e) => handleInStockToggle(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-100 dark:peer-checked:after:border-zinc-900 dark:peer-checked:after:bg-zinc-900"></div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                          In-Stock Only
                        </span>
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          Hide items with 0 stock
                        </span>
                      </div>
                    </label>

                    {(priceRange[0] > catalogMinPrice || priceRange[1] < catalogMaxPrice || inStockOnly) && (
                      <button
                        type="button"
                        onClick={() => {
                          setPriceRange([catalogMinPrice, catalogMaxPrice]);
                          setInStockOnly(false);
                          updateUrlParams(selectedCategory, sortOption, 1, searchQuery, [catalogMinPrice, catalogMaxPrice], false, selectedTag);
                        }}
                        className="text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 underline cursor-pointer"
                      >
                        Reset price &amp; stock
                      </button>
                    )}
                  </div>
                </div>

                {/* Tag Pills Facet */}
                {availableTags.length > 1 && (
                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mr-1">
                      Tags:
                    </span>
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagSelect(tag)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                          selectedTag === tag
                            ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 font-semibold"
                            : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                        }`}
                      >
                        {tag === "All" ? "All Tags" : `#${tag}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Recent Searches chips cache */}
            <RecentSearches
              searches={recentSearches}
              onSelectSearch={handleSelectRecentSearch}
              onClearRecent={handleClearRecent}
            />

            {/* Category Pills */}
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
