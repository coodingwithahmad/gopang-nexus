import { createClient } from "@/lib/supabase/server";
import { formatRelative, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";
import { Users, Briefcase, Globe, FileText, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false },
};

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [
    clientsRes, 
    projectsRes, 
    publicProjectsRes, 
    invoicesRes,
    chatsRes
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact" }).eq("role", "client"),
    supabase.from("projects").select("id", { count: "exact" }).in("status", ["scoping", "active", "review"]),
    supabase.from("portfolio_projects").select("id", { count: "exact" }).eq("published", true),
    supabase.from("invoices").select("amount, status"),
    supabase.from("tickets").select("id, status, created_at, client:profiles!tickets_client_id_fkey(full_name)").order("created_at", { ascending: false }).limit(5)
  ]);

  const clientCount = clientsRes.count ?? 0;
  const activeProjectsCount = projectsRes.count ?? 0;
  const publicProjectsCount = publicProjectsRes.count ?? 0;
  const recentChats = chatsRes.data ?? [];

  const invoices = invoicesRes.data || [];
  const totalRevenue = invoices.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Welcome back! Here's what's happening today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-xl border border-border bg-background p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <FileText size={20} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Internal Projects</p>
            <p className="text-2xl font-bold text-foreground">{activeProjectsCount}</p>
          </div>
          <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <Briefcase size={20} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Active Clients</p>
            <p className="text-2xl font-bold text-foreground">{clientCount}</p>
          </div>
          <div className="h-10 w-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Public Portfolio</p>
            <p className="text-2xl font-bold text-foreground">{publicProjectsCount}</p>
          </div>
          <div className="h-10 w-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
            <Globe size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Client Chats</h3>
            <Link href="/dashboard/chats" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          {recentChats.length === 0 ? (
            <div className="rounded-lg border border-border bg-background p-8 text-center shadow-sm">
              <p className="text-sm text-muted-foreground">No recent conversations.</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden bg-background shadow-sm">
              <div className="divide-y divide-border">
                {recentChats.map((chat: any) => (
                  <div key={chat.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <MessageSquare size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{chat.client?.full_name || "Unknown Client"}</p>
                        <p className="text-xs text-muted-foreground">{formatRelative(chat.created_at)}</p>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/chats/${chat.id}`}
                      className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-md hover:bg-primary/20 transition-colors"
                    >
                      Open Chat
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/admin/services/new" className="p-4 rounded-lg border border-border bg-background shadow-sm hover:border-primary hover:shadow-md transition-all group flex flex-col gap-2">
              <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <Globe size={16} />
              </div>
              <p className="font-medium text-sm">Add Service</p>
              <p className="text-xs text-muted-foreground">Create a new public service</p>
            </Link>

            <Link href="/dashboard/admin/internal-projects/new" className="p-4 rounded-lg border border-border bg-background shadow-sm hover:border-primary hover:shadow-md transition-all group flex flex-col gap-2">
              <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <Briefcase size={16} />
              </div>
              <p className="font-medium text-sm">Start Project</p>
              <p className="text-xs text-muted-foreground">Initialize a new client project</p>
            </Link>

            <Link href="/dashboard/admin/blog/new" className="p-4 rounded-lg border border-border bg-background shadow-sm hover:border-primary hover:shadow-md transition-all group flex flex-col gap-2">
              <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <FileText size={16} />
              </div>
              <p className="font-medium text-sm">Write Article</p>
              <p className="text-xs text-muted-foreground">Publish to Blog & Insights</p>
            </Link>

            <Link href="/dashboard/admin/invoices" className="p-4 rounded-lg border border-border bg-background shadow-sm hover:border-primary hover:shadow-md transition-all group flex flex-col gap-2">
              <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <FileText size={16} />
              </div>
              <p className="font-medium text-sm">Bill Client</p>
              <p className="text-xs text-muted-foreground">Manage invoices & payments</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
