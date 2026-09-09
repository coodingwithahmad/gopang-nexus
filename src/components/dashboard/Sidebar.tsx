"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  FileText,
  Settings,
  X,
  Menu,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Chats", href: "/dashboard/chats", icon: MessageSquare, exact: false },
  { label: "Invoices", href: "/dashboard/invoices", icon: FileText, exact: false },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, exact: false },
];

interface SidebarProps {
  role: string;
}

function NavItem({
  item,
  pathname,
  onClick,
}: {
  item: (typeof navItems)[0];
  pathname: string;
  onClick?: () => void;
}) {
  const isActive = item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
      )}
    >
      <item.icon size={16} className="shrink-0" />
      {item.label}
    </Link>
  );
}

// Desktop sidebar — fixed, visible on lg+
function DesktopSidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:shrink-0 bg-sidebar border-r border-sidebar-border min-h-screen">
      <div className="flex items-center h-14 px-4 border-b border-sidebar-border shrink-0">
        <Link
          href="/"
          className="font-semibold text-sidebar-foreground tracking-tight text-sm"
        >
          {siteConfig.shortName}
          <span className="text-sidebar-primary">.</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => (
          <NavItem key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>
      {role === "admin" && (
        <div className="px-3 pb-4 border-t border-sidebar-border pt-3">
          <p className="px-3 text-xs font-medium text-sidebar-foreground/40 uppercase tracking-wider mb-1">
            Admin
          </p>
          <Link
            href="/dashboard/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground transition-colors"
          >
            Admin Panel
          </Link>
        </div>
      )}
    </aside>
  );
}

// Mobile sidebar — sheet/drawer
function MobileSidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile header bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center h-14 px-4 bg-sidebar border-b border-sidebar-border">
        <Link
          href="/"
          className="font-semibold text-sidebar-foreground tracking-tight text-sm"
        >
          {siteConfig.shortName}
          <span className="text-sidebar-primary">.</span>
        </Link>
        <button
          className="ml-auto p-2 rounded-md text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 transition-colors"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex flex-col w-64 bg-sidebar border-r border-sidebar-border shadow-xl">
            <div className="flex items-center justify-between h-14 px-4 border-b border-sidebar-border shrink-0">
              <Link
                href="/"
                className="font-semibold text-sidebar-foreground tracking-tight text-sm"
                onClick={() => setOpen(false)}
              >
                {siteConfig.shortName}
                <span className="text-sidebar-primary">.</span>
              </Link>
              <button
                className="p-2 rounded-md text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  onClick={() => setOpen(false)}
                />
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export function DashboardSidebar({ role }: SidebarProps) {
  return (
    <>
      <DesktopSidebar role={role} />
      <MobileSidebar role={role} />
    </>
  );
}
