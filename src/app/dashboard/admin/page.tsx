import { createClient } from "@/lib/supabase/server";
import { formatRelative } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel",
  robots: { index: false },
};

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  // Fetch summary counts for the admin overview
  const [clientsRes, projectsRes, ticketsRes] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact" }).eq("role", "client"),
    supabase.from("projects").select("id, status, title", { count: "exact" }).in("status", ["scoping", "active", "review"]),
    supabase.from("tickets").select("id, status, subject, priority, created_at").in("status", ["open", "in_progress"]).order("created_at", { ascending: false }).limit(10)
  ]);

  const clientCount = clientsRes.count ?? 0;
  const activeProjectsCount = projectsRes.count ?? 0;
  const openTickets = ticketsRes.data ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">High-level view of the business.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-1">Active Projects</p>
          <p className="text-3xl font-bold text-foreground">{activeProjectsCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-1">Open Tickets</p>
          <p className="text-3xl font-bold text-foreground">{openTickets.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-1">Total Clients</p>
          <p className="text-3xl font-bold text-foreground">{clientCount}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Support Tickets</h3>
        {openTickets.length === 0 ? (
          <div className="rounded-lg border border-border bg-background p-8 text-center">
            <p className="text-sm text-muted-foreground">No open support tickets.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden bg-background">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Subject</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Priority</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Opened</th>
                </tr>
              </thead>
              <tbody>
                {openTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{ticket.subject}</td>
                    <td className="px-4 py-3 capitalize">{ticket.status.replace("_", " ")}</td>
                    <td className="px-4 py-3 capitalize">{ticket.priority}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatRelative(ticket.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
