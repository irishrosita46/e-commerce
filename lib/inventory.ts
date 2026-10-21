import productsData from "@/data/products.json";
import { Product } from "@/types/product";

export const INVENTORY_STORAGE_KEY = "aurastore_inventory";
export const LOW_STOCK_THRESHOLD = 4;

/**
 * Initializes or retrieves the global inventory map from localStorage.
 */
export function getStoredInventory(): Record<string, number> {
  if (typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Failed to parse stored inventory from localStorage:", e);
    }
  }

  // Populate initial inventory baseline from catalog
  const initialMap: Record<string, number> = {};
  (productsData as Product[]).forEach((p) => {
    initialMap[p.id] = p.stock ?? (p.inStock ? 10 : 0);
  });

  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(initialMap));
    } catch (e) {
      console.warn("Failed to persist initial inventory to localStorage:", e);
    }
  }

  return initialMap;
}

/**
 * Returns current stock for a specific product ID.
 */
export function getProductStock(productId: string, fallbackStock: number = 0): number {
  const inventory = getStoredInventory();
  if (productId in inventory) {
    return inventory[productId];
  }
  return fallbackStock;
}

/**
 * Determines if product stock is below or equal to low-stock threshold (1 to 4 units).
 */
export function isLowStock(stock: number): boolean {
  return stock > 0 && stock <= LOW_STOCK_THRESHOLD;
}

/**
 * Determines if product stock is depleted (0 or less).
 */
export function isOutOfStock(stock: number): boolean {
  return stock <= 0;
}

/**
 * Decrements stock count for ordered items upon successful checkout completion (SCRUM-75).
 */
export function decrementStock(
  orderItems: Array<{
    product?: { id: string };
    productId?: string;
    quantity: number;
  }>,
): Record<string, number> {
  const inventory = getStoredInventory();
  const updated: Record<string, number> = { ...inventory };

  for (const item of orderItems) {
    const pId = item.productId || item.product?.id;
    if (!pId) continue;

    const current = updated[pId] !== undefined ? updated[pId] : 10;
    const nextStock = Math.max(0, current - (item.quantity || 1));
    updated[pId] = nextStock;
  }

  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to save decremented inventory to localStorage:", e);
    }
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("aurastore:inventory-updated", { detail: updated }),
    );
  }

  return updated;
}

/**
 * Resets inventory back to baseline values (useful for tests or demo resets).
 */
export function resetInventory(): Record<string, number> {
  const initialMap: Record<string, number> = {};
  (productsData as Product[]).forEach((p) => {
    initialMap[p.id] = p.stock ?? (p.inStock ? 10 : 0);
  });

  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(initialMap));
    } catch (e) {
      console.warn("Failed to reset inventory in localStorage:", e);
    }
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("aurastore:inventory-updated", { detail: initialMap }),
    );
  }

  return initialMap;
}
