"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, Menu, X, LogOut } from "lucide-react";
import { siteConfig } from "@/config/site";
import { marketingNav } from "@/config/nav";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"client" | "admin" | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    async function syncUserRole(nextUser: User | null) {
      if (!mounted) return;
      setUser(nextUser);

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

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setSigningOut(false);
    router.push("/");
    router.refresh();
  }

  const isAdmin = role === "admin";

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-16">
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
        <ul className="hidden md:flex items-center gap-1">
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
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-60"
            >
              <LogOut size={14} />
              {signingOut ? "Signing out..." : "Sign Out"}
            </button>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
          )}
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
            href="/contact"
            className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Get in touch
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
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
            {user ? (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleSignOut();
                }}
                disabled={signingOut}
                className="block text-center px-4 py-2 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-60"
              >
                {signingOut ? "Signing out..." : "Sign Out"}
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-4 py-2 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Sign In
              </Link>
            )}
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
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="block text-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
