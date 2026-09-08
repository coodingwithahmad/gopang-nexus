import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

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
  const [projectsRes, ticketsRes, invoicesRes] = await Promise.all([
    supabase
      .from("projects")
      .select("id, title, status, due_date, updated_at")
      .eq("client_id", user.id)
      .in("status", ["scoping", "active", "review", "paused"])
      .order("updated_at", { ascending: false })
      .limit(5),

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

  const projects = projectsRes.data ?? [];
  const tickets = ticketsRes.data ?? [];
  const invoices = invoicesRes.data ?? [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-bold text-foreground">Overview</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Your active projects, open tickets, and outstanding invoices.
        </p>
      </div>

      {/* Active Projects */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Active Projects
          </h2>
          <Link
            href="/dashboard/projects"
            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
          >
            All projects <ArrowRight size={12} />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-lg border border-border bg-background p-6 text-center">
            <p className="text-sm text-muted-foreground">No active projects.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Projects you&apos;re working on with us will appear here.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="flex items-center justify-between gap-4 px-4 py-3 bg-background hover:bg-muted/40 transition-colors border-b border-border last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {project.title}
                  </p>
                  {project.due_date && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Due {formatDate(project.due_date)}
                    </p>
                  )}
                </div>
                <StatusBadge status={project.status} />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Open Tickets */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Open Tickets
          </h2>
          <Link
            href="/dashboard/tickets"
            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
          >
            All tickets <ArrowRight size={12} />
          </Link>
        </div>

        {tickets.length === 0 ? (
          <div className="rounded-lg border border-border bg-background p-6 text-center">
            <p className="text-sm text-muted-foreground">No open tickets.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Need help?{" "}
              <Link
                href="/dashboard/tickets/new"
                className="text-primary hover:underline"
              >
                Create a ticket.
              </Link>
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/dashboard/tickets/${ticket.id}`}
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
