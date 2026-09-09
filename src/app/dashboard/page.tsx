import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ArrowRight, Send, MessageSquarePlus } from "lucide-react";
import { quickDiscussionAction } from "@/lib/actions/tickets";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    scoping: "bg-muted text-muted-foreground",
    active: "bg-blue-50 text-blue-700 border border-blue-200",
    review: "bg-amber-50 text-amber-700 border border-amber-200",
    completed: "bg-green-50 text-green-700 border border-green-200",
    paused: "bg-muted text-muted-foreground",
    open: "bg-blue-50 text-blue-700 border border-blue-200",
    in_progress: "bg-amber-50 text-amber-700 border border-amber-200",
    resolved: "bg-green-50 text-green-700 border border-green-200",
    closed: "bg-muted text-muted-foreground",
    sent: "bg-amber-50 text-amber-700 border border-amber-200",
    paid: "bg-green-50 text-green-700 border border-green-200",
    overdue: "bg-red-50 text-red-700 border border-red-200",
  };

  const labels: Record<string, string> = {
    in_progress: "In Progress",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch all dashboard data in parallel — limit results to what's useful
  const [ticketsRes, invoicesRes] = await Promise.all([
    supabase
      .from("tickets")
      .select("id, subject, status, priority, created_at, updated_at")
      .eq("client_id", user.id)
      .in("status", ["open", "in_progress"])
      .order("updated_at", { ascending: false })
      .limit(5),

    supabase
      .from("invoices")
      .select("id, invoice_no, status, amount, currency, due_date")
      .eq("client_id", user.id)
      .in("status", ["sent", "overdue"])
      .order("due_date", { ascending: true })
      .limit(5),
  ]);

  const tickets = ticketsRes.data ?? [];
  const invoices = invoicesRes.data ?? [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-bold text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Your active projects, Active Chats, and outstanding invoices.
        </p>
      </div>

      {/* Quick Discussion Card */}
      <section className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MessageSquarePlus size={16} className="text-primary" />
              Need to discuss something?
            </h2>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Send a quick message to the admin team and we'll get right back to you.
            </p>
          </div>
          <form action={quickDiscussionAction} className="flex w-full sm:w-auto gap-2">
            <input
              type="text"
              name="message"
              placeholder="Type your message..."
              required
              className="flex h-9 w-full sm:w-64 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              <Send size={14} className="mr-1.5" />
              Send
            </button>
          </form>
        </div>
      </section>

      {/* Active Chats */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Active Chats
          </h2>
          <Link
            href="/dashboard/chats"
            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
          >
            All chats <ArrowRight size={12} />
          </Link>
        </div>

        {tickets.length === 0 ? (
          <div className="rounded-lg border border-border bg-background p-6 text-center">
            <p className="text-sm text-muted-foreground">No Active Chats.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Need help?{" "}
              <Link
                href="/dashboard/chats"
                className="text-primary hover:underline"
              >
                Start a chat.
              </Link>
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/dashboard/chats/${ticket.id}`}
                className="flex items-center justify-between gap-4 px-4 py-3 bg-background hover:bg-muted/40 transition-colors border-b border-border last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {ticket.subject}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Updated {formatDate(ticket.updated_at)}
                  </p>
                </div>
                <StatusBadge status={ticket.status} />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Outstanding Invoices */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Outstanding Invoices
          </h2>
          <Link
            href="/dashboard/invoices"
            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
          >
            All invoices <ArrowRight size={12} />
          </Link>
        </div>

        {invoices.length === 0 ? (
          <div className="rounded-lg border border-border bg-background p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No outstanding invoices.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            {invoices.map((invoice) => (
              <Link
                key={invoice.id}
                href={`/dashboard/invoices/${invoice.id}`}
                className="flex items-center justify-between gap-4 px-4 py-3 bg-background hover:bg-muted/40 transition-colors border-b border-border last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {invoice.invoice_no}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Due {formatDate(invoice.due_date)}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(invoice.amount, invoice.currency)}
                  </span>
                  <StatusBadge status={invoice.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
