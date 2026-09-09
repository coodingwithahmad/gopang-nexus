import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Plus, Edit, Trash2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Invoices Manager",
  robots: { index: false },
};

const statusStyle: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-amber-100 text-amber-700 border border-amber-200",
  paid: "bg-green-100 text-green-700 border border-green-200",
  overdue: "bg-red-100 text-red-700 border border-red-200",
  cancelled: "bg-muted text-muted-foreground border border-border",
};

export default async function AdminInvoicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("*, client:profiles!invoices_client_id_fkey(full_name)")
    .order("issued_date", { ascending: false });

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-sm text-destructive">
          We couldn&apos;t load the invoices. Please try again.
        </p>
      </div>
    );
  }

  const invoicesList = (invoices || []) as any[];

  const totalRevenue = invoicesList
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const outstandingBalance = invoicesList
    .filter((inv) => inv.status === "sent" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage billing and track revenue across all clients.
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm cursor-not-allowed opacity-80"
          title="Full invoice creator coming in Phase 4"
        >
          <Plus size={16} /> Add Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg border border-border bg-background shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Total Revenue (Paid)</p>
          <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 shadow-sm text-amber-900">
          <p className="text-sm font-medium opacity-80">Outstanding Balance</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(outstandingBalance)}</p>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Invoice #</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Dates</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {!invoices || invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No invoices generated yet.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice: any) => (
                  <tr key={invoice.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {invoice.invoice_no}
                    </td>
                    <td className="px-6 py-4">
                      {invoice.client?.full_name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      <div>Issued: {formatDate(invoice.issued_date)}</div>
                      <div className="mt-1">
                        Due: {invoice.paid_date ? `Paid ${formatDate(invoice.paid_date)}` : formatDate(invoice.due_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${statusStyle[invoice.status] || "bg-muted text-muted-foreground"}`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
