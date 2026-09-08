import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { NewTicketForm } from "@/components/forms/TicketForm";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "New Ticket",
  robots: { index: false },
};

export default async function NewTicketPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch client's active projects for the dropdown
  const { data: projects } = await supabase
    .from("projects")
    .select("id, title")
    .eq("client_id", user.id)
    .in("status", ["scoping", "active", "review"])
    .order("title");

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dashboard/tickets"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        All tickets
      </Link>

      <h1 className="text-xl font-bold text-foreground mb-6">New Support Ticket</h1>

      <NewTicketForm projects={projects ?? []} />
    </div>
  );
}
