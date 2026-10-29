"use client";

import React, { useState, useMemo } from "react";
import { useAuth, RFC5322_EMAIL_REGEX } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, AlertCircle, Check, Circle, Loader2 } from "lucide-react";

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterForm({
  onSuccess,
  onSwitchToLogin,
}: RegisterFormProps) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordRules = useMemo(() => {
    const hasMinLength = password.length >= 8;
    const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
    const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>_\-+=/\\[\]~`]/.test(
      password,
    );
    const score = [hasMinLength, hasMixedCase, hasNumberOrSymbol].filter(
      Boolean,
    ).length;

    return {
      hasMinLength,
      hasMixedCase,
      hasNumberOrSymbol,
      score,
      label:
        password.length === 0
          ? "Enter a password"
          : score === 1
            ? "Weak"
            : score === 2
              ? "Good"
              : "Strong",
    };
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setError("Please enter your full name (at least 2 characters).");
      return;
    }

    const trimmedEmail = email.trim();
    if (!RFC5322_EMAIL_REGEX.test(trimmedEmail)) {
      setError(
        "Please enter a valid RFC 5322 email address (e.g. name@example.com).",
      );
      return;
    }

    if (!passwordRules.hasMinLength) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match. Please re-enter your confirmation password.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register(trimmedName, trimmedEmail, password);
      if (!res.success) {
        setError(res.error || "Registration failed.");
      } else if (onSuccess) {
        onSuccess();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {error && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50/80 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{error}</p>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          Full Name
        </label>
        <Input
          type="text"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(null);
          }}
          autoComplete="name"
          required
          className="h-10 text-xs border-zinc-200 dark:border-zinc-800"
        />
      </div>

      {/* Email Address */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          Email address
        </label>
        <Input
          type="email"
          placeholder="jane@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          autoComplete="email"
          required
          className="h-10 text-xs border-zinc-200 dark:border-zinc-800"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            Password
          </label>
          {password.length > 0 && (
            <span
              className={`text-[11px] font-medium ${
                passwordRules.score === 3
                  ? "text-emerald-600 dark:text-emerald-400"
                  : passwordRules.score === 2
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-red-600 dark:text-red-400"
              }`}
            >
              {passwordRules.label}
            </span>
          )}
        </div>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            autoComplete="new-password"
            required
            className="h-10 pr-9 text-xs border-zinc-200 dark:border-zinc-800"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Password Strength Indicator Bar & Checklist */}
        <div className="space-y-2 pt-0.5">
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-1 rounded-full transition-colors duration-200 ${
                  password.length === 0
                    ? "bg-zinc-200 dark:bg-zinc-800"
                    : passwordRules.score >= step
                      ? passwordRules.score === 3
                        ? "bg-emerald-500"
                        : passwordRules.score === 2
                          ? "bg-amber-500"
                          : "bg-red-500"
                      : "bg-zinc-200 dark:bg-zinc-800"
                }`}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              {passwordRules.hasMinLength ? (
                <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <Circle className="h-3 w-3 text-zinc-300 dark:text-zinc-700 shrink-0" />
              )}
              <span
                className={
                  passwordRules.hasMinLength
                    ? "text-zinc-700 dark:text-zinc-300 font-medium"
                    : ""
                }
              >
                At least 8 characters
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {passwordRules.hasMixedCase ? (
                <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <Circle className="h-3 w-3 text-zinc-300 dark:text-zinc-700 shrink-0" />
              )}
              <span
                className={
                  passwordRules.hasMixedCase
                    ? "text-zinc-700 dark:text-zinc-300 font-medium"
                    : ""
                }
              >
                Uppercase & lowercase letters
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {passwordRules.hasNumberOrSymbol ? (
                <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <Circle className="h-3 w-3 text-zinc-300 dark:text-zinc-700 shrink-0" />
              )}
              <span
                className={
                  passwordRules.hasNumberOrSymbol
                    ? "text-zinc-700 dark:text-zinc-300 font-medium"
                    : ""
                }
              >
                At least one number or symbol
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          Confirm Password
        </label>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Re-type your password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (error) setError(null);
          }}
          autoComplete="new-password"
          required
          className="h-10 text-xs border-zinc-200 dark:border-zinc-800"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 text-xs h-10 font-medium cursor-pointer"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Creating account...
          </span>
        ) : (
          "Complete registration"
        )}
      </Button>

      {/* Switch to Login */}
      <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 pt-1">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="inline-flex min-h-10 items-center font-semibold text-zinc-900 underline underline-offset-4 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300 cursor-pointer"
        >
          Sign in instead
        </button>
      </div>
    </form>
  );
}
