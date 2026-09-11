"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { getInitials } from "@/lib/utils";
import type { Profile } from "@/types/database";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface HeaderProps {
  profile: Pick<Profile, "full_name" | "email" | "role" | "avatar_url">;
}

export function DashboardHeader({ profile }: HeaderProps) {
  const displayName = profile.full_name ?? profile.email;
  const initials = getInitials(displayName);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <header className="h-14 lg:h-12 flex items-center justify-end gap-3 px-4 sm:px-6 border-b border-border bg-background shrink-0 lg:mt-0 mt-14">
      <button
        className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Notifications"
      >
        <Bell size={16} />
      </button>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1 text-left shadow-sm transition-colors hover:bg-muted"
          aria-label="Open account menu"
          aria-expanded={open}
        >
          <span
            className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0"
            aria-hidden="true"
          >
            {initials}
          </span>
          <span className="hidden sm:block text-sm text-foreground font-medium truncate max-w-40">
            {displayName}
          </span>
          <ChevronDown
            size={14}
            className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-popover text-popover-foreground shadow-lg z-50">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile.email}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-primary">
                    <ShieldCheck size={12} />
                    {profile.role === "admin" ? "Administrator" : "Client"}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-border p-2">
              <Link
                href="/dashboard/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
              >
                <Settings size={16} />
                Account settings
              </Link>
              <div className="flex items-center justify-between rounded-md px-3 py-2">
                <span className="flex items-center gap-2 text-sm text-foreground">
                  <UserRound size={16} />
                  Theme
                </span>
                <ThemeToggle />
              </div>
            </div>

            <div className="border-t border-border p-2">
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
