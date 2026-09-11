"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type InvoiceStatus = Database["public"]["Tables"]["invoices"]["Row"]["status"];

function requireString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error("Please fill in all required fields.");
  }

  return value.trim();
}

export async function createInvoiceAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden");

  const client_id = requireString(formData, "client_id");
  const invoice_no = requireString(formData, "invoice_no");
  const status = requireString(formData, "status") as InvoiceStatus;
  const amount = Number(requireString(formData, "amount"));
  const currency = requireString(formData, "currency").toUpperCase();
  const issued_date = requireString(formData, "issued_date");
  const due_date = requireString(formData, "due_date");
  const notesRaw = formData.get("notes");
  const notes =
    typeof notesRaw === "string" && notesRaw.trim() ? notesRaw.trim() : null;
  const paidDateRaw = formData.get("paid_date");
  const paid_date =
    typeof paidDateRaw === "string" && paidDateRaw.trim()
      ? paidDateRaw.trim()
      : null;

  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Invoice amount must be a valid number.");
  }

  if (!["draft", "sent", "paid", "overdue", "cancelled"].includes(status)) {
    throw new Error("Invalid invoice status.");
  }

  const { error } = await supabase.from("invoices").insert({
    client_id,
    invoice_no,
    status,
    amount,
    currency,
    issued_date,
    due_date,
    paid_date: status === "paid" ? paid_date : null,
    notes,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/admin/invoices");
  redirect("/dashboard/admin/invoices");
}
