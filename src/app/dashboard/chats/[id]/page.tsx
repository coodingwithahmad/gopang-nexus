import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { ChatThread } from "@/components/dashboard/ChatThread";

export const metadata: Metadata = {
  title: "Chat",
  robots: { index: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

const statusLabel: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

const statusStyle: Record<string, string> = {
  open: "bg-blue-50 text-blue-700 border border-blue-200",
  in_progress: "bg-amber-50 text-amber-700 border border-amber-200",
  resolved: "bg-green-50 text-green-700 border border-green-200",
  closed: "bg-muted text-muted-foreground",
};

export default async function ChatDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  const { data } = await supabase
    .from("tickets")
    .select(`
      id, subject, status, priority, created_at, updated_at, project_id,
      client:profiles!tickets_client_id_fkey(full_name, email)
    `)
    .eq("id", id)
    .single();

  const ticket = data as any;

  if (!ticket) notFound();

  // If a client tries to access someone else's ticket, block it.
  // Note: RLS handles this, but double checking is good practice.
  
  const { data: messages } = await supabase
    .from("ticket_messages")
    .select("id, content, author_id, is_internal, created_at")
    .eq("ticket_id", id)
    .order("created_at");

  const authorIds = [...new Set((messages ?? []).map((m) => m.author_id))];
  const { data: authors } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .in("id", authorIds);

  const authorMap = authors?.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {} as Record<string, any>) ?? {};

  const isTicketOpen = ["open", "in_progress"].includes(ticket.status);

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Mobile back button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-border shrink-0 bg-muted/20">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/chats"
            className="md:hidden inline-flex p-1.5 -ml-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-base font-bold text-foreground">
              {ticket.client?.full_name || "Unknown Client"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {ticket.client?.email || "No email"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-muted/10 relative">
        <ChatThread 
          ticketId={ticket.id}
          initialMessages={messages ?? []}
          authorMap={authorMap}
          currentUserId={user.id}
          isTicketOpen={true}
        />
      </div>
    </div>
  );
}
