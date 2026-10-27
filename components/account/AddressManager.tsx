"use client";

import React, { useState } from "react";
import {
  SavedAddress,
  saveAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/lib/addresses";
import { validateShippingAddress } from "@/lib/orders";
import { ShippingAddress, AddressValidationErrors } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  Star,
  AlertCircle,
  X,
} from "lucide-react";

interface AddressManagerProps {
  userId: string;
  userName: string;
  userEmail: string;
  addresses: SavedAddress[];
  onAddressesChange: (updated: SavedAddress[]) => void;
}

export function AddressManager({
  userId,
  userName,
  userEmail,
  addresses,
  onAddressesChange,
}: AddressManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("Home");
  const [formData, setFormData] = useState<Partial<ShippingAddress>>({
    fullName: userName,
    email: userEmail,
    street: "",
    city: "Berlin",
    postalCode: "10115",
    country: "Germany",
  });
  const [errors, setErrors] = useState<AddressValidationErrors>({});

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateShippingAddress(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    saveAddress(userId, {
      fullName: formData.fullName || userName,
      email: formData.email || userEmail,
      street: formData.street || "",
      city: formData.city || "",
      postalCode: formData.postalCode || "",
      country: formData.country || "Germany",
      label: newLabel || "Other",
      isDefault: addresses.length === 0,
    });

    // Refresh
    const { getSavedAddresses } = require("@/lib/addresses");
    onAddressesChange(getSavedAddresses(userId, userName, userEmail));
    setIsAdding(false);
    setFormData({
      fullName: userName,
      email: userEmail,
      street: "",
      city: "Berlin",
      postalCode: "10115",
      country: "Germany",
    });
    setErrors({});
  };

  const handleDelete = (addressId: string) => {
    if (confirm("Are you sure you want to delete this saved address?")) {
      deleteAddress(userId, addressId);
      const { getSavedAddresses } = require("@/lib/addresses");
      onAddressesChange(getSavedAddresses(userId, userName, userEmail));
    }
  };

  const handleSetDefault = (addressId: string) => {
    setDefaultAddress(userId, addressId);
    const { getSavedAddresses } = require("@/lib/addresses");
    onAddressesChange(getSavedAddresses(userId, userName, userEmail));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
            <span>Saved Shipping Addresses</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage your delivery destinations for quick one-click checkout.
          </p>
        </div>

        {!isAdding && (
          <Button
            size="sm"
            onClick={() => setIsAdding(true)}
            className="h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 gap-1.5 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Address</span>
          </Button>
        )}
      </div>

      {/* Add Address Form Modal / Inline Box */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 p-5 space-y-4 animate-in fade-in-50"
        >
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              New Delivery Address
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setErrors({});
              }}
              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                Address Label (e.g. Home, Office, Studio)
              </label>
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Workspace Studio"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                Recipient Full Name
              </label>
              <Input
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Full name"
                className={`h-9 text-xs ${errors.fullName ? "border-red-500" : ""}`}
              />
              {errors.fullName && (
                <p className="text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                Street Address (include building number)
              </label>
              <Input
                value={formData.street}
                onChange={(e) => handleInputChange("street", e.target.value)}
                placeholder="e.g. Dessauer Str. 3-5"
                className={`h-9 text-xs ${errors.street ? "border-red-500" : ""}`}
              />
              {errors.street && (
                <p className="text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.street}</span>
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                Postal / ZIP Code
              </label>
              <Input
                value={formData.postalCode}
                onChange={(e) =>
                  handleInputChange("postalCode", e.target.value)
                }
                placeholder="e.g. 10963"
                className={`h-9 text-xs ${errors.postalCode ? "border-red-500" : ""}`}
              />
              {errors.postalCode && (
                <p className="text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.postalCode}</span>
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                City
              </label>
              <Input
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="e.g. Berlin"
                className={`h-9 text-xs ${errors.city ? "border-red-500" : ""}`}
              />
              {errors.city && (
                <p className="text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.city}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(false)}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
            >
              Save Address
            </Button>
          </div>
        </form>
      )}

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`rounded-xl border p-4.5 transition-all text-xs flex flex-col justify-between ${
              addr.isDefault
                ? "border-zinc-900 bg-white dark:border-zinc-100 dark:bg-zinc-950 shadow-xs ring-1 ring-zinc-900 dark:ring-zinc-100"
                : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                  {addr.label || "Delivery Destination"}
                </span>
                {addr.isDefault && (
                  <Badge
                    variant="outline"
                    className="border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 text-[10px] gap-1"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Default</span>
                  </Badge>
                )}
              </div>

              <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                {addr.fullName}
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                {addr.street}
              </p>
              <p className="text-zinc-600 dark:text-zinc-400">
                {addr.postalCode} {addr.city}, {addr.country}
              </p>
              <p className="text-[11px] text-zinc-400 mt-1.5 font-mono">
                {addr.email}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 mt-3 border-t border-zinc-100 dark:border-zinc-800">
              {!addr.isDefault ? (
                <button
                  type="button"
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-[11px] font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 flex items-center gap-1 cursor-pointer"
                >
                  <Star className="h-3 w-3" />
                  <span>Set as default</span>
                </button>
              ) : (
                <span className="text-[11px] text-zinc-400 font-medium">
                  Primary shipping
                </span>
              )}

              {addresses.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDelete(addr.id)}
                  aria-label="Delete address"
                  className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400 p-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
