import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Invoices",
  robots: { index: false },
};

const statusStyle: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-amber-50 text-amber-700 border border-amber-200",
  paid: "bg-green-50 text-green-700 border border-green-200",
  overdue: "bg-red-50 text-red-700 border border-red-200",
  cancelled: "bg-muted text-muted-foreground",
};

export default async function InvoicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("id, invoice_no, status, amount, currency, issued_date, due_date, paid_date")
    .eq("client_id", user.id)
    .order("issued_date", { ascending: false });

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-sm text-destructive">
          We couldn&apos;t load your invoices. Please try again.
        </p>
      </div>
    );
  }

  const outstanding = invoices
    .filter((inv) => inv.status === "sent" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-foreground mb-6">Invoices</h1>

      {outstanding > 0 && (
        <div className="mb-6 px-4 py-3 rounded-lg border border-amber-200 bg-amber-50 text-sm text-amber-800">
          Outstanding balance:{" "}
          <span className="font-semibold">
            {formatCurrency(outstanding)}
          </span>
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="rounded-lg border border-border bg-background p-8 text-center">
          <p className="text-sm font-medium text-foreground">No invoices yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Invoices will appear here when they are issued.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Invoice</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Issued</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Due</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/invoices/${invoice.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {invoice.invoice_no}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {formatDate(invoice.issued_date)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {invoice.paid_date
                      ? `Paid ${formatDate(invoice.paid_date)}`
                      : formatDate(invoice.due_date)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">
                    {formatCurrency(invoice.amount, invoice.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${statusStyle[invoice.status] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {invoice.status}
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
