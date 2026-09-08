import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Support Tickets",
  robots: { index: false },
};

const statusStyle: Record<string, string> = {
  open: "bg-blue-50 text-blue-700 border border-blue-200",
  in_progress: "bg-amber-50 text-amber-700 border border-amber-200",
  resolved: "bg-green-50 text-green-700 border border-green-200",
  closed: "bg-muted text-muted-foreground",
};

const priorityStyle: Record<string, string> = {
  low: "text-muted-foreground",
  normal: "text-foreground",
  high: "text-amber-600",
  urgent: "text-red-600 font-semibold",
};

export default async function TicketsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tickets, error } = await supabase
    .from("tickets")
    .select("id, subject, status, priority, created_at, updated_at")
    .eq("client_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-sm text-destructive">
          We couldn&apos;t load your tickets. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-foreground">Support Tickets</h1>
        <Link
          href="/dashboard/tickets/new"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus size={14} />
          New ticket
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="rounded-lg border border-border bg-background p-8 text-center">
          <p className="text-sm font-medium text-foreground">No support tickets yet.</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
            When you need help with a project, create a ticket and the
            conversation will appear here.
          </p>
          <Link
            href="/dashboard/tickets/new"
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={14} />
            Create your first ticket
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Subject
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                  Priority
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                  Updated
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/tickets/${ticket.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {ticket.subject}
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`capitalize text-xs ${priorityStyle[ticket.priority]}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {formatDate(ticket.updated_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${statusStyle[ticket.status] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {ticket.status === "in_progress" ? "In Progress" : ticket.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
