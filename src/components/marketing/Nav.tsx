"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { marketingNav } from "@/config/nav";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState<"client" | "admin" | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    async function syncUserRole(nextUser: User | null) {
      if (!mounted) return;

      if (!nextUser) {
        setRole(null);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", nextUser.id)
        .single();

      if (mounted) {
        setRole(profile?.role ?? null);
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

  const isAdmin = role === "admin";

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
          {isAdmin && (
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border bg-background text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <LayoutDashboard size={14} />
              Admin Panel
            </Link>
          )}
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Sign in
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <ThemeToggle />
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
            {isAdmin && (
              <Link
                href="/dashboard/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <LayoutDashboard size={14} />
                Admin Panel
              </Link>
            )}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block text-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
