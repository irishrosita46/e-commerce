"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@/types/auth";
import { CartItem, useCart } from "@/context/CartContext";
import {
  ShippingAddress,
  AddressValidationErrors,
  PaymentMethod,
  Order,
  CardDetails,
  CardValidationErrors,
} from "@/types/order";
import {
  validateShippingAddress,
  generateOrderReference,
  saveOrder,
  validateCardDetails,
  detectCardBrand,
} from "@/lib/orders";
import { getSavedAddresses } from "@/lib/addresses";
import { decrementStock } from "@/lib/inventory";
import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Printer,
  ShoppingBag,
  Check,
  Edit2,
  Loader2,
  AlertCircle,
  Lock,
} from "lucide-react";

interface CheckoutFormProps {
  user: User;
  items: CartItem[];
  subtotal: number;
  onOrderPlaced: (order: Order) => void;
}

export function CheckoutForm({
  user,
  items,
  subtotal,
  onOrderPlaced,
}: CheckoutFormProps) {
  const router = useRouter();

  // Multi-step State (Step 1: Shipping Address -> Step 2: Payment & Review)
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Pre-seed from user's saved addresses if present
  const [address, setAddress] = useState<ShippingAddress>(() => {
    if (typeof localStorage !== "undefined" && user?.id) {
      const saved = getSavedAddresses(user.id);
      const def = saved.find((a) => a.isDefault) || saved[0];
      if (def) {
        return {
          fullName: def.fullName,
          email: def.email,
          street: def.street,
          city: def.city,
          postalCode: def.postalCode,
          country: def.country,
        };
      }
    }
    return {
      fullName: user.name || "",
      email: user.email || "",
      street: "Dessauer Str. 3-5",
      city: "Berlin",
      postalCode: "10963",
      country: "Germany",
    };
  });

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("credit_card");

  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: "",
    cardholderName: user.name || "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<AddressValidationErrors>({});
  const [cardErrors, setCardErrors] = useState<CardValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const { totals, appliedPromo } = useCart();

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleContinueToReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Your cart is empty. Please add items to checkout.");
      return;
    }

    const validation = validateShippingAddress(address);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setCurrentStep(2);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Your cart is empty. Please add items to checkout.");
      return;
    }

    // SCRUM-91: Validate simulated card details when paying with credit card
    if (paymentMethod === "credit_card") {
      const cardValidation = validateCardDetails(cardDetails);
      if (!cardValidation.isValid) {
        setCardErrors(cardValidation.errors);
        return;
      }
    }

    setCardErrors({});
    setIsSubmitting(true);

    // SCRUM-92: Simulated payment processing latency (1.5 seconds) with loading state
    setTimeout(() => {
      const reference = generateOrderReference();
      const cleanNum = cardDetails.cardNumber.replace(/\D/g, "");

      const newOrder: Order = {
        id: `ord-${Date.now().toString(36)}`,
        reference,
        userId: user.id,
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.image,
        })),
        shippingAddress: address,
        paymentMethod,
        paymentDetails:
          paymentMethod === "credit_card"
            ? {
                last4: cleanNum.slice(-4),
                brand: detectCardBrand(cardDetails.cardNumber),
                cardholderName: cardDetails.cardholderName,
              }
            : undefined,
        subtotal: totals.subtotal,
        discount: totals.discount,
        promoCode: appliedPromo?.code,
        shippingCost: totals.shippingCost,
        tax: totals.tax,
        total: totals.total,
        status: "completed",
        createdAt: new Date().toISOString(),
      };

      decrementStock(newOrder.items);
      saveOrder(newOrder);
      setCompletedOrder(newOrder);
      setIsSubmitting(false);
      onOrderPlaced(newOrder);

      // SCRUM-93: Redirect to dedicated order confirmation receipt screen
      router.push(`/checkout/success?ref=${reference}`);
    }, 1500);
  };

  // Order Confirmed State (in-page fallback)
  if (completedOrder) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <Badge
          variant="outline"
          className="mb-3 border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300"
        >
          Order Confirmed
        </Badge>

        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Thank you for your purchase!
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          A confirmation receipt has been dispatched to{" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-200">
            {completedOrder.shippingAddress.email}
          </span>
          .
        </p>

        {/* Order Reference Box */}
        <div className="my-6 rounded-lg border border-zinc-200 bg-zinc-50 p-5 text-left dark:border-zinc-800 dark:bg-zinc-950/50 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
            <div>
              <p className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
                Order Reference
              </p>
              <p className="font-mono text-base font-bold text-zinc-900 dark:text-zinc-100">
                {completedOrder.reference}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
                Total Paid
              </p>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                ${completedOrder.total.toFixed(2)}
              </p>
            </div>
          </div>

          {completedOrder.discount && completedOrder.discount > 0 ? (
            <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50/50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-md">
              <span>Promo Discount ({completedOrder.promoCode})</span>
              <span className="font-mono">-${completedOrder.discount.toFixed(2)}</span>
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-600 dark:text-zinc-400">
            <div>
              <p className="text-[10px] uppercase font-semibold text-zinc-400">
                Recipient
              </p>
              <p className="font-medium text-zinc-900 dark:text-zinc-200 mt-0.5">
                {completedOrder.shippingAddress.fullName}
              </p>
              <p className="text-[11px] text-zinc-500">
                {completedOrder.shippingAddress.email}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-zinc-400">
                Delivery Address
              </p>
              <p className="font-medium text-zinc-900 dark:text-zinc-200 mt-0.5">
                {completedOrder.shippingAddress.street}
              </p>
              <p className="text-[11px] text-zinc-500">
                {completedOrder.shippingAddress.postalCode}{" "}
                {completedOrder.shippingAddress.city},{" "}
                {completedOrder.shippingAddress.country}
              </p>
            </div>
          </div>

          <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" />
              Paid via{" "}
              {completedOrder.paymentMethod === "credit_card"
                ? `Credit Card ${completedOrder.paymentDetails?.last4 ? `(•••• ${completedOrder.paymentDetails.last4})` : ""}`
                : completedOrder.paymentMethod === "paypal"
                  ? "PayPal"
                  : "Apple Pay"}
            </span>
            <span>
              {completedOrder.items.length}{" "}
              {completedOrder.items.length === 1 ? "item" : "items"}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.print()}
            className="w-full sm:w-auto h-9 text-xs border-zinc-200 dark:border-zinc-800 gap-1.5 cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Receipt
          </Button>
          <Link href="/catalog" className="w-full sm:w-auto">
            <Button className="w-full h-9 text-xs bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 gap-1.5 cursor-pointer">
              <ShoppingBag className="h-3.5 w-3.5" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Simulated Gateway Processing Overlay (SCRUM-92) */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
              <Loader2 className="h-7 w-7 animate-spin text-zinc-900 dark:text-zinc-100" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Authorizing Payment...
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Contacting secure payment gateway ({paymentMethod === "credit_card" ? "Mock Visa/MC" : paymentMethod}). Processing transaction token...
            </p>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-mono text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Simulated 256-Bit SSL Handshake</span>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Step Stepper Header */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-center justify-between">
          {/* Step 1 Pill */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2.5 text-xs font-semibold transition-colors cursor-pointer ${
              currentStep === 1
                ? "text-zinc-900 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                currentStep > 1
                  ? "bg-emerald-600 text-white"
                  : currentStep === 1
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                    : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {currentStep > 1 ? <Check className="h-3.5 w-3.5" /> : "1"}
            </div>
            <span>1. Shipping Address</span>
          </button>

          <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800 mx-4" />

          {/* Step 2 Pill */}
          <button
            type="button"
            onClick={() => {
              const validation = validateShippingAddress(address);
              if (validation.isValid) {
                setErrors({});
                setCurrentStep(2);
              } else {
                setErrors(validation.errors);
              }
            }}
            className={`flex items-center gap-2.5 text-xs font-semibold transition-colors cursor-pointer ${
              currentStep === 2
                ? "text-zinc-900 dark:text-zinc-50"
                : "text-zinc-400 dark:text-zinc-500"
            }`}
          >
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                currentStep === 2
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                  : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              2
            </div>
            <span>2. Payment &amp; Review</span>
          </button>
        </div>
      </div>

      {/* STEP 1: SHIPPING INFORMATION */}
      {currentStep === 1 && (
        <form onSubmit={handleContinueToReview} noValidate className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Delivery Address Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Full Name */}
              <div className="space-y-1 sm:col-span-1">
                <label className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={address.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="e.g. Alex Vance"
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1 sm:col-span-1">
                <label className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Notification Email
                </label>
                <Input
                  type="email"
                  value={address.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="e.g. customer@aurastore.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Street Address */}
              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Street Address &amp; House Number
                </label>
                <Input
                  type="text"
                  value={address.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  placeholder="e.g. Dessauer Str. 3-5"
                  className={errors.street ? "border-red-500" : ""}
                />
                {errors.street && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.street}</span>
                  </p>
                )}
              </div>

              {/* City */}
              <div className="space-y-1 sm:col-span-1">
                <label className="font-semibold text-zinc-900 dark:text-zinc-100">
                  City
                </label>
                <Input
                  type="text"
                  value={address.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="e.g. Berlin"
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.city}</span>
                  </p>
                )}
              </div>

              {/* Postal Code */}
              <div className="space-y-1 sm:col-span-1">
                <label className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Postal / ZIP Code
                </label>
                <Input
                  type="text"
                  value={address.postalCode}
                  onChange={(e) =>
                    handleInputChange("postalCode", e.target.value)
                  }
                  placeholder="e.g. 10963"
                  className={errors.postalCode ? "border-red-500" : ""}
                />
                {errors.postalCode && (
                  <p className="text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.postalCode}</span>
                  </p>
                )}
              </div>

              {/* Country */}
              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Country / Region
                </label>
                <select
                  value={address.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                >
                  <option value="Germany">Germany (DE - 5-digit PLZ)</option>
                  <option value="Austria">Austria (AT - 5-digit PLZ)</option>
                  <option value="Switzerland">Switzerland (CH)</option>
                  <option value="Netherlands">Netherlands (NL)</option>
                  <option value="United Kingdom">United Kingdom (UK)</option>
                  <option value="United States">United States (US)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Continue CTA */}
          <Button
            type="submit"
            disabled={items.length === 0}
            className="w-full h-11 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-medium gap-2 cursor-pointer"
          >
            <span>Continue to Payment &amp; Review</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </form>
      )}

      {/* STEP 2: PAYMENT & REVIEW SNAPSHOT */}
      {currentStep === 2 && (
        <form onSubmit={handlePlaceOrder} className="space-y-6">
          {/* Shipping Address Review Card */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  Shipping Destination
                </h3>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(1)}
                className="h-9 sm:h-7 text-[11px] text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 gap-1 cursor-pointer"
              >
                <Edit2 className="h-3 w-3" />
                Edit
              </Button>
            </div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-0.5">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                {address.fullName} ({address.email})
              </p>
              <p>
                {address.street}, {address.postalCode} {address.city},{" "}
                {address.country}
              </p>
            </div>
          </div>

          {/* SCRUM-91: Payment Method Selector Component */}
          <PaymentMethodSelector
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            cardDetails={cardDetails}
            onCardDetailsChange={setCardDetails}
            errors={cardErrors}
            userName={user.name}
          />

          {/* Action Buttons: Back & Place Order */}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="h-11 px-4 text-xs border-zinc-200 dark:border-zinc-800 gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="flex-1 h-11 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-medium gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authorizing &amp; Placing Order...
                </span>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" />
                  <span>Authorize &amp; Place Order - ${totals.total.toFixed(2)}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
