import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  InvoiceForm,
  type InvoiceClientOption,
} from "@/components/forms/InvoiceForm";

export default async function NewInvoicePage() {
  const supabase = await createClient();

  const { data: clientsData } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "client")
    .order("full_name");

  const clients = (clientsData ?? []) as unknown as InvoiceClientOption[];

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/dashboard/admin/invoices"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Back to Invoices
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Add Invoice</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a client invoice and track its payment status.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
        {clients.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Add a client account before creating an invoice.
          </p>
        ) : (
          <InvoiceForm clients={clients} />
        )}
      </div>
    </div>
  );
}
