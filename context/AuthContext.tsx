"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, StoredUser } from "@/types/auth";

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

  // Initialize users and active session from localStorage
  useEffect(() => {
    try {
      // Check stored registered users
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (!storedUsers) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      }

      // Check existing active session
      const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (storedSession) {
        const parsedUser = JSON.parse(storedSession);
        if (parsedUser && parsedUser.id && parsedUser.email) {
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
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = getUsers();
    const found = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!found || found.passwordHash !== password) {
      return {
        success: false,
        error:
          "Invalid email or password. Please verify your credentials and try again.",
      };
    }

    const sessionUser: User = {
      id: found.id,
      name: found.name,
      email: found.email,
      createdAt: found.createdAt,
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

    if (!trimmedName) {
      return { success: false, error: "Full name is required." };
    }
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      return { success: false, error: "A valid email address is required." };
    }
    if (password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters in length.",
      };
    }

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
