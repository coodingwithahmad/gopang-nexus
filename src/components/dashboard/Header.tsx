"use client";

import { Bell } from "lucide-react";
import type { Profile } from "@/types/database";
import { AccountMenu } from "@/components/account/AccountMenu";

interface HeaderProps {
  profile: Pick<Profile, "full_name" | "email" | "role" | "avatar_url">;
}

export function DashboardHeader({ profile }: HeaderProps) {
  return (
    <header className="h-14 lg:h-12 flex items-center justify-end gap-3 px-4 sm:px-6 border-b border-border bg-background shrink-0 lg:mt-0 mt-14">
      <button
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell size={18} />
      </button>
      <AccountMenu profile={profile} showDashboardLink />
    </header>
  );
}
