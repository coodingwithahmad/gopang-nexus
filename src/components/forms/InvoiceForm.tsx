"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createInvoiceAction } from "@/lib/actions/invoices";

export type InvoiceClientOption = {
  id: string;
  full_name: string | null;
  email: string | null;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function defaultDueDate() {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().slice(0, 10);
}

export function InvoiceForm({ clients }: { clients: InvoiceClientOption[] }) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      await createInvoiceAction(formData);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An error occurred while saving.";
      setError(message);
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {error && (
        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="client_id" className="mb-1 block text-sm font-medium">
            Client
          </label>
          <select
            id="client_id"
            name="client_id"
            required
            defaultValue=""
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="" disabled>
              Select a client
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.full_name || "Unnamed client"} ({client.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="invoice_no" className="mb-1 block text-sm font-medium">
            Invoice number
          </label>
          <input
            id="invoice_no"
            name="invoice_no"
            type="text"
            required
            placeholder="INV-2026-001"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div>
          <label htmlFor="amount" className="mb-1 block text-sm font-medium">
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="0.00"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div>
          <label htmlFor="currency" className="mb-1 block text-sm font-medium">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            defaultValue="USD"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="USD">USD</option>
            <option value="PKR">PKR</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div>
          <label htmlFor="issued_date" className="mb-1 block text-sm font-medium">
            Issued date
          </label>
          <input
            id="issued_date"
            name="issued_date"
            type="date"
            required
            defaultValue={today()}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div>
          <label htmlFor="due_date" className="mb-1 block text-sm font-medium">
            Due date
          </label>
          <input
            id="due_date"
            name="due_date"
            type="date"
            required
            defaultValue={defaultDueDate()}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue="sent"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label htmlFor="paid_date" className="mb-1 block text-sm font-medium">
            Paid date
          </label>
          <input
            id="paid_date"
            name="paid_date"
            type="date"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          maxLength={2000}
          placeholder="Payment terms or internal invoice notes..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex items-center gap-4 border-t border-border pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          Create Invoice
        </button>
        <Link
          href="/dashboard/admin/invoices"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
