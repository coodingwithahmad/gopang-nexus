"use client";

import { Bell, LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { getInitials } from "@/lib/utils";
import type { Profile } from "@/types/database";

interface HeaderProps {
  profile: Pick<Profile, "full_name" | "email" | "role" | "avatar_url">;
}

export function DashboardHeader({ profile }: HeaderProps) {
  const displayName = profile.full_name ?? profile.email;
  const initials = getInitials(displayName);

  return (
    <header className="h-14 lg:h-12 flex items-center justify-end gap-3 px-4 sm:px-6 border-b border-border bg-background shrink-0 lg:mt-0 mt-14">
      {/* Notifications placeholder — wired up in Phase 11 */}
      <button
        className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Notifications"
      >
        <Bell size={16} />
      </button>

      {/* User info */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0"
          aria-hidden="true"
        >
          {initials}
        </div>
        <span className="hidden sm:block text-sm text-foreground font-medium truncate max-w-[140px]">
          {displayName}
        </span>
      </div>

      {/* Logout */}
      <form action={logoutAction}>
        <button
          type="submit"
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Sign out"
        >
          <LogOut size={16} />
        </button>
      </form>
    </header>
  );
}
