import { ShippingAddress } from "@/types/order";

export interface SavedAddress extends ShippingAddress {
  id: string;
  label?: string;
  isDefault?: boolean;
  createdAt: string;
}

const ADDRESS_STORAGE_PREFIX = "aurastore_addresses_";

export function getAddressStorageKey(userId: string): string {
  return `${ADDRESS_STORAGE_PREFIX}${userId}`;
}

export function getDefaultSeedAddress(
  fullName = "Irish Rosita",
  email = "irish.rosita@ue-germany.de"
): SavedAddress {
  return {
    id: "addr-seed-default",
    fullName,
    email,
    street: "Dessauer Str. 3-5",
    city: "Berlin",
    postalCode: "10963",
    country: "Germany",
    label: "Primary Residence",
    isDefault: true,
    createdAt: "2026-09-23T10:00:00.000Z",
  };
}

/**
 * Retrieves all saved addresses for a specific authenticated customer.
 */
export function getSavedAddresses(
  userId: string,
  userFullName?: string,
  userEmail?: string
): SavedAddress[] {
  if (typeof localStorage === "undefined" || !userId) return [];
  try {
    const raw = localStorage.getItem(getAddressStorageKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // Seed default baseline address on initial query
    const defaultAddress = getDefaultSeedAddress(
      userFullName || "Irish Rosita",
      userEmail || "irish.rosita@ue-germany.de"
    );
    const initialList = [defaultAddress];
    localStorage.setItem(
      getAddressStorageKey(userId),
      JSON.stringify(initialList)
    );
    return initialList;
  } catch (e) {
    console.warn("Failed to retrieve saved addresses from storage:", e);
    return [];
  }
}

/**
 * Saves a new address record to customer's saved address book.
 */
export function saveAddress(
  userId: string,
  addressData: Omit<SavedAddress, "id" | "createdAt">
): SavedAddress {
  const current = getSavedAddresses(userId);
  const newId = `addr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const isFirst = current.length === 0;

  const newRecord: SavedAddress = {
    ...addressData,
    id: newId,
    isDefault: isFirst ? true : Boolean(addressData.isDefault),
    createdAt: new Date().toISOString(),
  };

  // If new address is default, reset existing defaults
  let updatedList: SavedAddress[];
  if (newRecord.isDefault) {
    updatedList = [
      newRecord,
      ...current.map((a) => ({ ...a, isDefault: false })),
    ];
  } else {
    updatedList = [...current, newRecord];
  }

  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(
        getAddressStorageKey(userId),
        JSON.stringify(updatedList)
      );
    } catch (e) {
      console.warn("Failed to persist new address to storage:", e);
    }
  }

  return newRecord;
}

/**
 * Deletes an address record by ID.
 */
export function deleteAddress(userId: string, addressId: string): boolean {
  const current = getSavedAddresses(userId);
  const filtered = current.filter((a) => a.id !== addressId);
  if (filtered.length === current.length) return false;

  // If deleted address was default, set the first remaining address as default
  if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
    filtered[0].isDefault = true;
  }

  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(
        getAddressStorageKey(userId),
        JSON.stringify(filtered)
      );
    } catch (e) {
      console.warn("Failed to delete address from storage:", e);
    }
  }

  return true;
}

/**
 * Sets a specific address as the primary default shipping address.
 */
export function setDefaultAddress(userId: string, addressId: string): boolean {
  const current = getSavedAddresses(userId);
  let found = false;

  const updatedList = current.map((a) => {
    if (a.id === addressId) {
      found = true;
      return { ...a, isDefault: true };
    }
    return { ...a, isDefault: false };
  });

  if (!found) return false;

  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(
        getAddressStorageKey(userId),
        JSON.stringify(updatedList)
      );
    } catch (e) {
      console.warn("Failed to update default address in storage:", e);
    }
  }

  return true;
}
