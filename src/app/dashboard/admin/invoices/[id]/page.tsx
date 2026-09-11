import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import type { Invoice, InvoiceItem } from "@/types/database";

export const metadata: Metadata = {
  title: "Invoice",
  robots: { index: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

const statusStyle: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-amber-50 text-amber-700 border border-amber-200",
  paid: "bg-green-50 text-green-700 border border-green-200",
  overdue: "bg-red-50 text-red-700 border border-red-200",
  cancelled: "bg-muted text-muted-foreground",
};

export default async function InvoiceDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // RLS ensures only this client's invoice is returned
  type InvoiceWithItems = Invoice & {
    invoice_items: InvoiceItem[];
  };

  const { data } = await supabase
    .from("invoices")
    .select("*, invoice_items(*)")
    .eq("id", id)
    .single();

  const invoice = data as InvoiceWithItems | null;

  if (!invoice) notFound();

  const items = invoice.invoice_items ?? [];

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/dashboard/admin/invoices"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        All invoices
      </Link>

      {/* Invoice header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Invoice</p>
          <h1 className="text-2xl font-bold text-foreground">{invoice.invoice_no}</h1>
        </div>
        <span
          className={`inline-flex items-center self-start px-3 py-1 rounded-md text-sm font-medium capitalize ${statusStyle[invoice.status]}`}
        >
          {invoice.status}
        </span>
      </div>

      {/* Invoice meta */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8 pb-8 border-b border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Issued</p>
          <p className="text-sm font-medium">{formatDate(invoice.issued_date)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">
            {invoice.paid_date ? "Paid" : "Due"}
          </p>
          <p className={`text-sm font-medium ${invoice.status === "overdue" ? "text-red-600" : ""}`}>
            {invoice.paid_date ? formatDate(invoice.paid_date) : formatDate(invoice.due_date)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Total</p>
          <p className="text-sm font-semibold">
            {formatCurrency(invoice.amount, invoice.currency)}
          </p>
        </div>
      </div>

      {/* Line items */}
      {items.length > 0 && (
        <div className="mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left pb-2 font-medium text-muted-foreground">Description</th>
                <th className="text-right pb-2 font-medium text-muted-foreground hidden sm:table-cell">Qty</th>
                <th className="text-right pb-2 font-medium text-muted-foreground hidden sm:table-cell">Unit price</th>
                <th className="text-right pb-2 font-medium text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-b-0">
                  <td className="py-3 text-foreground">{item.description}</td>
                  <td className="py-3 text-right text-muted-foreground hidden sm:table-cell">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right text-muted-foreground hidden sm:table-cell">
                    {formatCurrency(item.unit_price, invoice.currency)}
                  </td>
                  <td className="py-3 text-right font-medium text-foreground">
                    {formatCurrency(item.amount, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border">
                <td colSpan={3} className="pt-3 text-right font-semibold text-foreground hidden sm:table-cell">
                  Total
                </td>
                <td className="pt-3 text-right font-bold text-foreground text-base">
                  {formatCurrency(invoice.amount, invoice.currency)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {invoice.notes && (
        <div className="mb-8 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-1">Notes</p>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {invoice.notes}
          </p>
        </div>
      )}

      {/* Payment info */}
      {(invoice.status === "sent" || invoice.status === "overdue") && (
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Payment</p>
          <p>
            To pay this invoice, please contact us at{" "}
            <a href="mailto:hello@gopangit.com" className="text-primary hover:underline">
              hello@gopangit.com
            </a>{" "}
            referencing invoice <strong>{invoice.invoice_no}</strong>.
          </p>
        </div>
      )}
    </div>
  );
}
