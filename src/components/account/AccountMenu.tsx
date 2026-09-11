"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  KeyRound,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { getInitials } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export type AccountMenuProfile = {
  full_name: string | null;
  email: string;
  role: "admin" | "client";
  avatar_url?: string | null;
};

export function AccountMenu({
  profile,
  showDashboardLink = true,
}: {
  profile: AccountMenuProfile;
  showDashboardLink?: boolean;
}) {
  const displayName = profile.full_name || profile.email;
  const initials = getInitials(displayName);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dashboardHref =
    profile.role === "admin" ? "/dashboard/admin" : "/dashboard/settings";

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
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-colors hover:bg-muted"
        aria-label="Open account menu"
        aria-expanded={open}
      >
        <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[28rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl z-50">
          <div className="p-3">
            <div className="rounded-lg bg-muted/70 px-5 py-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary text-3xl font-semibold text-primary-foreground">
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <p className="mt-4 truncate text-base font-semibold text-foreground">
                {displayName}
              </p>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {profile.email}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-background px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-primary shadow-sm">
                <ShieldCheck size={12} />
                {profile.role === "admin" ? "Administrator" : "Client"}
              </span>
            </div>
          </div>

          <div className="px-3 pb-3 pt-1">
            {showDashboardLink && (
              <Link
                href={dashboardHref}
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 rounded-md px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted"
              >
                <LayoutDashboard size={18} className="text-muted-foreground" />
                {profile.role === "admin" ? "Admin dashboard" : "Client account"}
              </Link>
            )}
            <Link
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 rounded-md px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted"
            >
              <Settings size={18} className="text-muted-foreground" />
              Account settings
            </Link>
            <Link
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 rounded-md px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted"
            >
              <KeyRound size={18} className="text-muted-foreground" />
              Password and profile
            </Link>
            <div className="flex items-center justify-between rounded-md px-4 py-3">
              <span className="flex items-center gap-4 text-sm text-foreground">
                <UserRound size={18} className="text-muted-foreground" />
                Dark / light mode
              </span>
              <ThemeToggle />
            </div>
          </div>

          <div className="border-t border-border p-2">
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-4 rounded-md px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <LogOut size={18} />
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
