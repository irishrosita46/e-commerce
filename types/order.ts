export interface ShippingAddress {
  fullName: string;
  email: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export type AddressValidationErrors = Partial<
  Record<keyof ShippingAddress, string>
>;

export type PaymentMethod = "credit_card" | "paypal" | "apple_pay";

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface PromoCode {
  code: string;
  type: "percentage" | "fixed_shipping";
  value: number; // e.g. 10 for 10%
  description: string;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  discountedSubtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  appliedPromo?: PromoCode | null;
}

export interface CardDetails {
  cardNumber: string;
  cardholderName: string;
  expiry: string;
  cvv: string;
}

export type CardValidationErrors = Partial<Record<keyof CardDetails, string>>;

export interface PaymentDetails {
  last4?: string;
  brand?: string;
  cardholderName?: string;
}

export interface Order {
  id: string;
  reference: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentDetails?: PaymentDetails;
  subtotal: number;
  discount?: number;
  promoCode?: string;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}
