export interface ShippingAddress {
  fullName: string;
  email: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export type AddressValidationErrors = Partial<Record<keyof ShippingAddress, string>>;

export type PaymentMethod = "credit_card" | "paypal" | "apple_pay";

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  reference: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}
