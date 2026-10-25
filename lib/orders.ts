import {
  Order,
  ShippingAddress,
  AddressValidationErrors,
  PromoCode,
  OrderTotals,
} from "@/types/order";

const ORDERS_STORAGE_KEY = "aurastore_orders";

export const RFC5322_EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Valid promotional coupons dictionary (SCRUM-84).
 */
export const VALID_PROMO_CODES: Record<string, PromoCode> = {
  AURA10: {
    code: "AURA10",
    type: "percentage",
    value: 10,
    description: "10% off cart subtotal",
  },
  FREESHIP: {
    code: "FREESHIP",
    type: "fixed_shipping",
    value: 100,
    description: "Complimentary standard shipping",
  },
};

/**
 * Validates promotional codes against active promotional dictionary.
 */
export function validatePromoCode(rawCode: string): {
  isValid: boolean;
  promo?: PromoCode;
  error?: string;
} {
  const normalized = (rawCode || "").trim().toUpperCase();
  if (!normalized) {
    return { isValid: false, error: "Please enter a promo code." };
  }
  const promo = VALID_PROMO_CODES[normalized];
  if (!promo) {
    return {
      isValid: false,
      error: "Invalid promo code. Try 'AURA10' or 'FREESHIP'.",
    };
  }
  return { isValid: true, promo };
}

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
  const fullName = address.fullName?.trim() || "";
  if (!fullName || fullName.length < 2) {
    errors.fullName = "Full name is required (minimum 2 characters).";
  }

  // Email format validation (strict RFC 5322)
  const email = address.email?.trim() || "";
  if (!email || !RFC5322_EMAIL_REGEX.test(email)) {
    errors.email = "A valid email address is required for order confirmation.";
  }

  // Street Address: minimum 5 characters, should contain a house/street number
  const street = address.street?.trim() || "";
  if (!street || street.length < 5) {
    errors.street = "Street address is required (minimum 5 characters).";
  } else if (!/\d/.test(street)) {
    errors.street = "Please include a street number (e.g. Dessauer Str. 3-5).";
  }

  // City
  const city = address.city?.trim() || "";
  if (!city || city.length < 2) {
    errors.city = "City is required (minimum 2 characters).";
  }

  // Country & Postal Code validation
  const country = address.country?.trim() || "Germany";
  const postalCode = address.postalCode?.trim() || "";

  if (!postalCode) {
    errors.postalCode = "Postal / ZIP code is required.";
  } else if (country === "Germany" || country === "Austria") {
    // 5-digit postal code for Germany and Austria
    if (!/^[0-9]{5}$/.test(postalCode)) {
      errors.postalCode = `Please enter a valid 5-digit postal code for ${country} (e.g. 10963).`;
    }
  } else if (country === "Switzerland") {
    if (!/^[0-9]{4}$/.test(postalCode)) {
      errors.postalCode = "Please enter a valid 4-digit Swiss postal code.";
    }
  } else if (!/^[a-zA-Z0-9\s-]{3,10}$/.test(postalCode)) {
    errors.postalCode = "Valid postal/ZIP code is required (3 to 10 characters).";
  }

  // Country
  if (!country || country.length < 2) {
    errors.country = "Destination country must be selected.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export const FREE_SHIPPING_THRESHOLD = 100;

/**
 * Calculates pricing breakdown with free standard shipping over $100 and dynamic promo discounts (SCRUM-83, SCRUM-85).
 */
export function calculateOrderTotals(
  subtotal: number,
  promoInput?: PromoCode | string | null
): OrderTotals {
  const roundedSubtotal = Math.round(subtotal * 100) / 100;

  let promo: PromoCode | null = null;
  if (typeof promoInput === "string") {
    const res = validatePromoCode(promoInput);
    if (res.isValid && res.promo) {
      promo = res.promo;
    }
  } else if (promoInput && typeof promoInput === "object") {
    promo = promoInput;
  }

  // Calculate discount deduction (SCRUM-85)
  let discount = 0;
  if (promo?.type === "percentage" && roundedSubtotal > 0) {
    discount = Math.round(((roundedSubtotal * promo.value) / 100) * 100) / 100;
  }
  const discountedSubtotal = Math.max(
    0,
    Math.round((roundedSubtotal - discount) * 100) / 100
  );

  // Free shipping if subtotal >= 100, or empty cart, or FREESHIP coupon applied
  let shippingCost = 9.99;
  if (
    roundedSubtotal === 0 ||
    roundedSubtotal >= FREE_SHIPPING_THRESHOLD ||
    promo?.code === "FREESHIP"
  ) {
    shippingCost = 0;
  }

  // Dynamic 8% sales tax calculated on discounted subtotal
  const tax = Math.round(discountedSubtotal * 0.08 * 100) / 100;
  const total = Math.round((discountedSubtotal + shippingCost + tax) * 100) / 100;

  return {
    subtotal: roundedSubtotal,
    discount,
    discountedSubtotal,
    shippingCost,
    tax,
    total,
    appliedPromo: promo,
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
