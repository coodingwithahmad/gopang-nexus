"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { marketingNav } from "@/config/nav";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  AccountMenu,
  type AccountMenuProfile,
} from "@/components/account/AccountMenu";

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState<AccountMenuProfile | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    async function syncUserRole(nextUser: User | null) {
      if (!mounted) return;

      if (!nextUser) {
        setProfile(null);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email, role, avatar_url")
        .eq("id", nextUser.id)
        .maybeSingle();

      if (mounted) {
        setProfile({
          full_name:
            profile?.full_name ??
            (typeof nextUser.user_metadata?.full_name === "string"
              ? nextUser.user_metadata.full_name
              : null),
          email: profile?.email ?? nextUser.email ?? "no-email@example.com",
          role: profile?.role === "admin" ? "admin" : "client",
          avatar_url:
            profile?.avatar_url ??
            (typeof nextUser.user_metadata?.avatar_url === "string"
              ? nextUser.user_metadata.avatar_url
              : null),
        });
      }
    }

    // Get initial session
    supabase.auth.getUser().then(({ data }) => {
      syncUserRole(data.user);
    });

    // Listen for auth changes (login/logout from other tabs, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUserRole(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-5 px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="font-semibold text-foreground tracking-tight hover:text-primary transition-colors"
          onClick={() => setMobileOpen(false)}
        >
          {siteConfig.shortName}
          <span className="text-primary">.</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:ml-auto md:flex items-center gap-1">
          {marketingNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {profile ? (
            <AccountMenu profile={profile} showDashboardLink />
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <ThemeToggle />
          {profile && <AccountMenu profile={profile} showDashboardLink />}
          <button
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="md:hidden border-t border-border bg-background"
        >
          <ul className="px-4 py-3 space-y-1">
            {marketingNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href ||
                      pathname.startsWith(item.href + "/")
                      ? "text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-4 pb-4 pt-1 flex flex-col gap-2">
            {!profile && (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
