import { Order, ShippingAddress, AddressValidationErrors } from "@/types/order";

const ORDERS_STORAGE_KEY = "aurastore_orders";

/**
 * Generates an uppercase unique order reference code following the format ORD-2026-XXXX.
 */
export function generateOrderReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ORD-2026-${suffix}`;
}

/**
 * Validates mandatory customer details and shipping address fields.
 */
export function validateShippingAddress(address: Partial<ShippingAddress>): {
  isValid: boolean;
  errors: AddressValidationErrors;
} {
  const errors: AddressValidationErrors = {};

  // Full Name
  if (!address.fullName || address.fullName.trim().length < 2) {
    errors.fullName = "Full name is required (minimum 2 characters).";
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!address.email || !emailRegex.test(address.email.trim())) {
    errors.email = "A valid email address is required for order confirmation.";
  }

  // Street Address
  if (!address.street || address.street.trim().length < 5) {
    errors.street = "Street address is required (minimum 5 characters).";
  }

  // City
  if (!address.city || address.city.trim().length < 2) {
    errors.city = "City is required.";
  }

  // Postal Code (alphanumeric, 3 to 10 characters)
  const postalRegex = /^[a-zA-Z0-9\s-]{3,10}$/;
  if (!address.postalCode || !postalRegex.test(address.postalCode.trim())) {
    errors.postalCode =
      "Valid postal/ZIP code is required (3 to 10 characters).";
  }

  // Country
  if (!address.country || address.country.trim().length < 2) {
    errors.country = "Destination country must be selected.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Calculates pricing breakdown with free standard shipping over $100.
 */
export function calculateOrderTotals(subtotal: number): {
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
} {
  const roundedSubtotal = Math.round(subtotal * 100) / 100;
  const shippingCost = roundedSubtotal >= 100 || roundedSubtotal === 0 ? 0 : 15;
  const tax = Math.round(roundedSubtotal * 0.08 * 100) / 100;
  const total = Math.round((roundedSubtotal + shippingCost + tax) * 100) / 100;

  return {
    subtotal: roundedSubtotal,
    shippingCost,
    tax,
    total,
  };
}

/**
 * Saves a completed order to localStorage under aurastore_orders.
 */
export function saveOrder(order: Order): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredOrders();
    const updated = [order, ...existing];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Could not persist order to localStorage:", e);
  }
}

/**
 * Retrieves all stored orders from localStorage.
 */
export function getStoredOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("Could not read stored orders from localStorage:", e);
    return [];
  }
}

/**
 * Retrieves all orders belonging to a specific user account.
 */
export function getUserOrders(userId: string): Order[] {
  const orders = getStoredOrders();
  return orders.filter((o) => o.userId === userId);
}
