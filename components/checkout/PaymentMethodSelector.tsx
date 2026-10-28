"use client";

import React from "react";
import {
  PaymentMethod,
  CardDetails,
  CardValidationErrors,
} from "@/types/order";
import {
  formatCardNumber,
  formatExpiry,
  detectCardBrand,
} from "@/lib/orders";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  ShieldCheck,
  Lock,
  Sparkles,
  AlertCircle,
  Smartphone,
  Wallet,
} from "lucide-react";

interface PaymentMethodSelectorProps {
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  cardDetails: CardDetails;
  onCardDetailsChange: (details: CardDetails) => void;
  errors: CardValidationErrors;
  userName?: string;
}

export function PaymentMethodSelector({
  paymentMethod,
  onPaymentMethodChange,
  cardDetails,
  onCardDetailsChange,
  errors,
  userName,
}: PaymentMethodSelectorProps) {
  const brand = detectCardBrand(cardDetails.cardNumber);

  const handleCardNumberChange = (raw: string) => {
    const formatted = formatCardNumber(raw);
    onCardDetailsChange({ ...cardDetails, cardNumber: formatted });
  };

  const handleExpiryChange = (raw: string) => {
    const formatted = formatExpiry(raw);
    onCardDetailsChange({ ...cardDetails, expiry: formatted });
  };

  const handleCvvChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    onCardDetailsChange({ ...cardDetails, cvv: digits });
  };

  const handleFillTestCard = () => {
    onCardDetailsChange({
      cardNumber: "4242 4242 4242 4242",
      cardholderName: userName && userName.trim().length > 0 ? userName : "Jane Doe",
      expiry: "12/28",
      cvv: "123",
    });
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Payment Method
          </h2>
        </div>
        <span className="text-[11px] text-zinc-500 font-medium flex items-center gap-1">
          <Lock className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          256-Bit Encrypted
        </span>
      </div>

      {/* Payment Method Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {[
          {
            id: "credit_card",
            label: "Credit Card",
            desc: "Simulated Visa / MC",
            icon: CreditCard,
          },
          {
            id: "paypal",
            label: "PayPal",
            desc: "Express sandbox",
            icon: Wallet,
          },
          {
            id: "apple_pay",
            label: "Apple Pay",
            desc: "One-click device token",
            icon: Smartphone,
          },
        ].map((method) => {
          const isSelected = paymentMethod === method.id;
          const IconComponent = method.icon;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onPaymentMethodChange(method.id as PaymentMethod)}
              className={`flex flex-col items-start p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                isSelected
                  ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-950/60 ring-1 ring-zinc-900 dark:ring-zinc-100"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {method.label}
                  </span>
                </div>
                <div
                  className={`h-3 w-3 rounded-full border transition-all ${
                    isSelected
                      ? "border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100"
                      : "border-zinc-300 dark:border-zinc-700"
                  }`}
                />
              </div>
              <span className="text-[10px] text-zinc-400 mt-1.5">
                {method.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Credit Card Input Sub-form */}
      {paymentMethod === "credit_card" && (
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Card Information
              </span>
              {brand !== "generic" && (
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-mono tracking-wider bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                >
                  {brand}
                </Badge>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFillTestCard}
              className="h-7 text-[11px] gap-1 border-dashed border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>Fill Test Card</span>
            </Button>
          </div>

          {/* Card Number */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Card Number
            </label>
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                value={cardDetails.cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                className={`font-mono text-xs pr-10 ${
                  errors.cardNumber ? "border-red-500" : ""
                }`}
              />
              <div className="absolute right-3 top-2.5 text-zinc-400">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            {errors.cardNumber && (
              <p className="text-[11px] text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.cardNumber}</span>
              </p>
            )}
          </div>

          {/* Cardholder Name */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Cardholder Name
            </label>
            <Input
              type="text"
              autoComplete="cc-name"
              value={cardDetails.cardholderName}
              onChange={(e) =>
                onCardDetailsChange({
                  ...cardDetails,
                  cardholderName: e.target.value,
                })
              }
              placeholder="e.g. Alex Vance"
              className={`text-xs ${
                errors.cardholderName ? "border-red-500" : ""
              }`}
            />
            {errors.cardholderName && (
              <p className="text-[11px] text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.cardholderName}</span>
              </p>
            )}
          </div>

          {/* Expiry & CVV Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Expiry Date
              </label>
              <Input
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                value={cardDetails.expiry}
                onChange={(e) => handleExpiryChange(e.target.value)}
                placeholder="MM/YY"
                maxLength={5}
                className={`font-mono text-xs ${
                  errors.expiry ? "border-red-500" : ""
                }`}
              />
              {errors.expiry && (
                <p className="text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.expiry}</span>
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Security Code (CVV)
              </label>
              <div className="relative">
                <Input
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  value={cardDetails.cvv}
                  onChange={(e) => handleCvvChange(e.target.value)}
                  placeholder="123"
                  maxLength={4}
                  className={`font-mono text-xs pr-8 ${
                    errors.cvv ? "border-red-500" : ""
                  }`}
                />
                <div className="absolute right-2.5 top-2.5 text-zinc-400">
                  <Lock className="h-3.5 w-3.5" />
                </div>
              </div>
              {errors.cvv && (
                <p className="text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.cvv}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Alternative payment info notice */}
      {paymentMethod === "paypal" && (
        <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-4 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200 space-y-1">
          <p className="font-semibold flex items-center gap-1.5">
            <Wallet className="h-4 w-4" />
            PayPal Express Checkout
          </p>
          <p className="text-[11px] text-blue-700 dark:text-blue-300">
            Clicking &quot;Authorize &amp; Place Order&quot; simulates a secure PayPal sandbox transaction and immediately generates your order receipt.
          </p>
        </div>
      )}

      {paymentMethod === "apple_pay" && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-200 space-y-1">
          <p className="font-semibold flex items-center gap-1.5">
            <Smartphone className="h-4 w-4" />
            Apple Pay Touch ID Authorization
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Payment token will be simulated using your connected biometric device credentials upon checkout authorization.
          </p>
        </div>
      )}

      {/* Demonstration disclaimer */}
      <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-500 bg-zinc-50/70 dark:bg-zinc-950/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>
          Simulated checkout gateway. All card authorizations are processed client-side with zero actual charges.
        </span>
      </div>
    </div>
  );
}
