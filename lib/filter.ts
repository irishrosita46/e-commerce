import { Product } from "@/types/product";
import { getProductStock } from "@/lib/inventory";

export interface FacetFilterOptions {
  category?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  selectedTag?: string;
}

/**
 * Pure multi-facet filter evaluator combining category pills, search queries,
 * price boundaries, tags, and stock availability.
 */
export function filterCatalogProducts(
  products: Product[],
  options: FacetFilterOptions = {},
  liveInventoryMap?: Record<string, number>
): Product[] {
  const {
    category = "All",
    query = "",
    minPrice,
    maxPrice,
    inStockOnly = false,
    selectedTag = "All",
  } = options;

  const trimmedQuery = query.trim().toLowerCase();

  return products.filter((product) => {
    // 1. Category match
    if (category !== "All" && product.category !== category) {
      return false;
    }

    // 2. Search query match
    if (trimmedQuery) {
      const matchesSearch =
        product.name.toLowerCase().includes(trimmedQuery) ||
        product.tagline.toLowerCase().includes(trimmedQuery) ||
        product.description.toLowerCase().includes(trimmedQuery);
      if (!matchesSearch) return false;
    }

    // 3. Price range boundary match
    if (typeof minPrice === "number" && product.price < minPrice) {
      return false;
    }
    if (typeof maxPrice === "number" && product.price > maxPrice) {
      return false;
    }

    // 4. Tag match
    if (selectedTag && selectedTag !== "All") {
      if (!product.tags || !product.tags.includes(selectedTag)) {
        return false;
      }
    }

    // 5. In-stock availability match
    // Resolves SCRUM-99: evaluate live decremented inventory rather than static catalog records
    if (inStockOnly) {
      const fallback = product.stock ?? (product.inStock ? 1 : 0);
      const currentStock = liveInventoryMap
        ? (liveInventoryMap[product.id] ?? getProductStock(product.id, fallback))
        : getProductStock(product.id, fallback);

      if (currentStock <= 0) {
        return false;
      }
    }

    return true;
  });
}
