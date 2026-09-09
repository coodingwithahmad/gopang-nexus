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

  // RLS ensures this only returns the client's own tickets
  const { data: ticket } = await supabase
    .from("tickets")
    .select("id, subject, status, priority, created_at, updated_at, project_id")
    .eq("id", id)
    .single();

  if (!ticket) notFound();

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
    <div className="max-w-3xl mx-auto">
      <Link
        href="/dashboard/chats"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        All chats
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6 pb-6 border-b border-border">
        <div>
          <h1 className="text-lg font-bold text-foreground">{ticket.subject}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Started {formatDateTime(ticket.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${
              statusStyle[ticket.status] ?? statusStyle.closed
            }`}
          >
            {statusLabel[ticket.status] ?? ticket.status}
          </span>
        </div>
      </div>

      <ChatThread 
        ticketId={ticket.id}
        initialMessages={messages ?? []}
        authorMap={authorMap}
        currentUserId={user.id}
        isTicketOpen={isTicketOpen}
      />
    </div>
  );
}
