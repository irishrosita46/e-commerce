"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, StoredUser } from "@/types/auth";

export const RFC5322_EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authMode: "login" | "register";
  authRedirectUrl: string | null;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  openAuthModal: (mode?: "login" | "register", redirectUrl?: string) => void;
  closeAuthModal: () => void;
  setAuthMode: (mode: "login" | "register") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = "aurastore_users";
const SESSION_STORAGE_KEY = "aurastore_session";
const DEFAULT_SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const EXTENDED_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function createSessionToken(userId: string): string {
  const randomPart = Math.random().toString(36).substring(2, 10);
  const timePart = Date.now().toString(36);
  return `tok_${userId.replace(/[^a-zA-Z0-9]/g, "")}_${timePart}_${randomPart}`;
}

// Pre-seeded default users
const INITIAL_USERS: StoredUser[] = [
  {
    id: "usr-demo-01",
    name: "Alex Vance",
    email: "customer@aurastore.com",
    passwordHash: "Password123!",
    createdAt: "2026-09-20T10:00:00Z",
  },
  {
    id: "usr-demo-02",
    name: "Irish Rosita",
    email: "irish.rosita@ue-germany.de",
    passwordHash: "Password123!",
    createdAt: "2026-09-21T10:00:00Z",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authRedirectUrl, setAuthRedirectUrl] = useState<string | null>(null);

  // Initialize users and active session from localStorage with expiry check
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (!storedUsers) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      }

      const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (storedSession) {
        const parsedUser: User = JSON.parse(storedSession);
        if (parsedUser && parsedUser.id && parsedUser.email) {
          if (parsedUser.expiresAt) {
            const expiryTime = new Date(parsedUser.expiresAt).getTime();
            if (Number.isFinite(expiryTime) && Date.now() > expiryTime) {
              localStorage.removeItem(SESSION_STORAGE_KEY);
              setUser(null);
              return;
            }
          }
          setUser(parsedUser);
        }
      }
    } catch (e) {
      console.warn("Could not access localStorage for AuthContext:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUsers = (): StoredUser[] => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not read users:", e);
    }
    return INITIAL_USERS;
  };

  const login = async (
    email: string,
    password: string,
    rememberMe = false,
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!RFC5322_EMAIL_REGEX.test(trimmedEmail)) {
      return {
        success: false,
        error: "Please enter a valid RFC 5322 email address.",
      };
    }

    // Brief verification pause for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 300));

    const users = getUsers();
    const found = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!found || found.passwordHash !== password) {
      return {
        success: false,
        error:
          "Invalid email or password. Please verify your credentials and try again.",
      };
    }

    const ttl = rememberMe ? EXTENDED_SESSION_TTL_MS : DEFAULT_SESSION_TTL_MS;
    const sessionUser: User = {
      id: found.id,
      name: found.name,
      email: found.email,
      createdAt: found.createdAt,
      sessionToken: createSessionToken(found.id),
      expiresAt: new Date(Date.now() + ttl).toISOString(),
    };

    setUser(sessionUser);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
    } catch (e) {
      console.warn("Could not save session:", e);
    }

    setIsAuthModalOpen(false);
    return { success: true };
  };

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || trimmedName.length < 2) {
      return {
        success: false,
        error: "Full name must be at least 2 characters.",
      };
    }
    if (!RFC5322_EMAIL_REGEX.test(trimmedEmail)) {
      return {
        success: false,
        error: "Please enter a valid RFC 5322 email address.",
      };
    }
    if (password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters in length.",
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    const users = getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return {
        success: false,
        error:
          "An account with this email address already exists. Please sign in instead.",
      };
    }

    const newUser: StoredUser = {
      id: `usr-${Date.now().toString(36)}`,
      name: trimmedName,
      email: trimmedEmail,
      passwordHash: password,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    } catch (e) {
      console.warn("Could not save new user:", e);
    }

    const sessionUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      sessionToken: createSessionToken(newUser.id),
      expiresAt: new Date(Date.now() + DEFAULT_SESSION_TTL_MS).toISOString(),
    };

    setUser(sessionUser);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
    } catch (e) {
      console.warn("Could not save session:", e);
    }

    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.warn("Could not clear session:", e);
    }
  };

  const openAuthModal = (
    mode: "login" | "register" = "login",
    redirectUrl?: string,
  ) => {
    setAuthMode(mode);
    setAuthRedirectUrl(redirectUrl || null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthRedirectUrl(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        authMode,
        authRedirectUrl,
        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal,
        setAuthMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
