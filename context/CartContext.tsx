"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import { Product } from "@/types/product";
import { useAuth } from "@/context/AuthContext";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = "aurastore_cart_guest";
const LEGACY_STORAGE_KEY = "aurastore_cart";

const getStorageKey = (userId?: string | null): string => {
  return userId ? `aurastore_cart_${userId}` : GUEST_STORAGE_KEY;
};

const mergeCartItems = (
  existingItems: CartItem[],
  incomingItems: CartItem[],
): CartItem[] => {
  const merged = [...existingItems];
  for (const incoming of incomingItems) {
    const existingIndex = merged.findIndex(
      (item) => item.product.id === incoming.product.id,
    );
    if (existingIndex > -1) {
      merged[existingIndex] = {
        ...merged[existingIndex],
        quantity: merged[existingIndex].quantity + incoming.quantity,
      };
    } else {
      merged.push(incoming);
    }
  }
  return merged;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const itemsRef = useRef(items);
  itemsRef.current = items;

  // Track previous user id to detect transitions: undefined = unmounted, null = guest, string = auth user
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  // Sync / initialize cart when auth state is resolved or when user changes
  useEffect(() => {
    if (isAuthLoading) return;

    const currentUserId = user ? user.id : null;

    // 1. Initial mount hydration
    if (prevUserIdRef.current === undefined) {
      prevUserIdRef.current = currentUserId;

      const key = getStorageKey(currentUserId);
      let initialItems: CartItem[] = [];

      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            initialItems = parsed;
          }
        } else if (!currentUserId) {
          // Check for legacy storage key migration for guest
          const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
          if (legacy) {
            const parsedLegacy = JSON.parse(legacy);
            if (Array.isArray(parsedLegacy)) {
              initialItems = parsedLegacy;
              localStorage.setItem(GUEST_STORAGE_KEY, legacy);
            }
            localStorage.removeItem(LEGACY_STORAGE_KEY);
          }
        }
      } catch (e) {
        console.warn("Could not load cart from localStorage:", e);
      }

      setItems(initialItems);
      setIsInitialized(true);
      return;
    }

    // 2. Auth state changed
    const prevUserId = prevUserIdRef.current;
    if (prevUserId === currentUserId) return;

    // Guest -> User Login: migrate guest items into authenticated user cart
    if (prevUserId === null && currentUserId !== null) {
      let userSavedItems: CartItem[] = [];
      try {
        const stored = localStorage.getItem(getStorageKey(currentUserId));
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            userSavedItems = parsed;
          }
        }
      } catch (e) {
        console.warn("Could not load user cart:", e);
      }

      const combined = mergeCartItems(userSavedItems, itemsRef.current);
      setItems(combined);

      try {
        localStorage.setItem(
          getStorageKey(currentUserId),
          JSON.stringify(combined),
        );
        localStorage.removeItem(GUEST_STORAGE_KEY);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      } catch (e) {
        console.warn("Could not update user cart storage:", e);
      }
    }
    // User -> Guest Logout: reset active in-memory cart and clear guest cart
    else if (prevUserId !== null && currentUserId === null) {
      setItems([]);
      try {
        localStorage.removeItem(GUEST_STORAGE_KEY);
      } catch (e) {
        console.warn("Could not clear guest cart storage:", e);
      }
    }
    // User A -> User B direct account switch
    else if (
      prevUserId !== null &&
      currentUserId !== null &&
      prevUserId !== currentUserId
    ) {
      let newUserItems: CartItem[] = [];
      try {
        const stored = localStorage.getItem(getStorageKey(currentUserId));
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            newUserItems = parsed;
          }
        }
      } catch (e) {
        console.warn("Could not load new user cart:", e);
      }
      setItems(newUserItems);
    }

    prevUserIdRef.current = currentUserId;
  }, [user, isAuthLoading]);

  // Save cart to current user storage key whenever items change after initial load
  useEffect(() => {
    if (!isInitialized || isAuthLoading) return;
    const key = getStorageKey(user ? user.id : null);
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (e) {
      console.warn("Could not save cart to localStorage:", e);
    }
  }, [items, isInitialized, isAuthLoading, user]);

  const addItem = (product: Product, quantity = 1) => {
    if (!product.inStock) return;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id,
      );
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prevItems, { product, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId),
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
  }, [items]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
