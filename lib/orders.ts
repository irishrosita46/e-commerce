import {
  Order,
  ShippingAddress,
  AddressValidationErrors,
  PromoCode,
  OrderTotals,
  CardDetails,
  CardValidationErrors,
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
 * Formats raw card input into groups of 4 separated by spaces (max 16 digits).
 */
export function formatCardNumber(value: string): string {
  const digits = (value || "").replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/**
 * Detects payment card network based on BIN / IIN prefix.
 */
export function detectCardBrand(
  number: string
): "visa" | "mastercard" | "amex" | "generic" {
  const clean = (number || "").replace(/\D/g, "");
  if (clean.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(clean)) return "mastercard";
  if (/^3[47]/.test(clean)) return "amex";
  return "generic";
}

/**
 * Formats expiration input into MM/YY with automatic slash formatting.
 */
export function formatExpiry(value: string): string {
  const digits = (value || "").replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

/**
 * Validates simulated payment card fields (SCRUM-91).
 */
export function validateCardDetails(card: Partial<CardDetails>): {
  isValid: boolean;
  errors: CardValidationErrors;
} {
  const errors: CardValidationErrors = {};

  // Card Number validation
  const cleanNumber = (card.cardNumber || "").replace(/\D/g, "");
  if (!cleanNumber || cleanNumber.length !== 16) {
    errors.cardNumber = "Valid 16-digit card number is required.";
  }

  // Cardholder Name
  const name = (card.cardholderName || "").trim();
  if (!name || name.length < 2) {
    errors.cardholderName = "Cardholder name is required (minimum 2 characters).";
  }

  // Expiration Date
  const expiry = (card.expiry || "").trim();
  const match = expiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/);
  if (!match) {
    errors.expiry = "Valid expiry in MM/YY format is required.";
  } else {
    const month = parseInt(match[1], 10);
    const expYear = 2000 + parseInt(match[2], 10);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    if (expYear < currentYear || (expYear === currentYear && month < currentMonth)) {
      errors.expiry = "Card expiration date has passed.";
    }
  }

  // CVV
  const cleanCvv = (card.cvv || "").replace(/\D/g, "");
  if (!cleanCvv || (cleanCvv.length !== 3 && cleanCvv.length !== 4)) {
    errors.cvv = "Valid 3 or 4-digit security code (CVV) is required.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
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
  if (typeof localStorage === "undefined") return;
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
  if (typeof localStorage === "undefined") return [];
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

/**
 * Retrieves a specific order by its unique ORD-2026-XXXX reference.
 */
export function getOrderByReference(reference: string): Order | undefined {
  const orders = getStoredOrders();
  const normalized = (reference || "").trim().toUpperCase();
  return orders.find((o) => o.reference.toUpperCase() === normalized);
}

/**
 * Retrieves a specific order by its internal unique id.
 */
export function getOrderById(orderId: string): Order | undefined {
  const orders = getStoredOrders();
  const normalized = (orderId || "").trim();
  return orders.find((o) => o.id === normalized);
}
