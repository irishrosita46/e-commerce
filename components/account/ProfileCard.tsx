"use client";

import React, { useState } from "react";
import { User } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  ShieldCheck,
  Calendar,
  LogOut,
  Mail,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ProfileCardProps {
  user: User;
  onLogout: () => void;
}

export function ProfileCard({ user, onLogout }: ProfileCardProps) {
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AU";

  const memberDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      })
    : "September 2026";

  return (
    <>
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar Circle with Initials */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-lg font-mono shrink-0 shadow-sm">
              {initials}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {user.name}
                </h1>
                <Badge
                  variant="outline"
                  className="border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 text-[10px] gap-1"
                >
                  <ShieldCheck className="h-3 w-3" />
                  <span>Verified Customer</span>
                </Badge>
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-mono">
                <Mail className="h-3 w-3 text-zinc-400" />
                <span>{user.email}</span>
              </p>

              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                <span>Member since {memberDate}</span>
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSignOutModalOpen(true)}
            className="self-start sm:self-auto text-xs border-zinc-200 dark:border-zinc-800 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 gap-1.5 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      <Dialog open={isSignOutModalOpen} onOpenChange={setIsSignOutModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Confirm Sign Out
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
              Are you sure you want to end your active session, {user.name}? Your
              saved addresses and orders will remain securely stored.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSignOutModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsSignOutModalOpen(false);
                onLogout();
              }}
              className="bg-red-600 hover:bg-red-700 text-white text-xs cursor-pointer"
            >
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
