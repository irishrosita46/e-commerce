"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Lock, UserPlus } from "lucide-react";

export function AuthModal() {
  const router = useRouter();
  const {
    isAuthModalOpen,
    closeAuthModal,
    authMode,
    setAuthMode,
    authRedirectUrl,
  } = useAuth();

  const handleSuccess = () => {
    closeAuthModal();
    if (authRedirectUrl) {
      router.push(authRedirectUrl);
    }
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="w-full max-w-md border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950 sm:rounded-2xl">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 mb-1">
            {authMode === "login" ? (
              <Lock className="h-5 w-5" />
            ) : (
              <UserPlus className="h-5 w-5" />
            )}
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {authMode === "login" ? "Sign in to AuraStore" : "Create your account"}
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
            {authMode === "login"
              ? "Access your saved cart, addresses, and order history."
              : "Register to unlock secure checkout and order tracking."}
          </DialogDescription>
        </DialogHeader>

        <div className="pt-2">
          {authMode === "login" ? (
            <LoginForm
              onSuccess={handleSuccess}
              onSwitchToRegister={() => setAuthMode("register")}
            />
          ) : (
            <RegisterForm
              onSuccess={handleSuccess}
              onSwitchToLogin={() => setAuthMode("login")}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
