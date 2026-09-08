import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { TicketReplyForm } from "@/components/forms/TicketReplyForm";

export const metadata: Metadata = {
  title: "Ticket",
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

export default async function TicketDetailPage({ params }: Props) {
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

  // Fetch messages — RLS hides is_internal=true messages from clients
  const { data: messages } = await supabase
    .from("ticket_messages")
    .select("id, content, author_id, is_internal, created_at")
    .eq("ticket_id", id)
    .order("created_at");

  // Fetch author profiles for messages
  const authorIds = [...new Set((messages ?? []).map((m) => m.author_id))];
  const { data: authors } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .in("id", authorIds);

  const authorMap = new Map(authors?.map((a) => [a.id, a]) ?? []);
  const isTicketOpen = ["open", "in_progress"].includes(ticket.status);

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/dashboard/tickets"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        All tickets
      </Link>

      {/* Ticket header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6 pb-6 border-b border-border">
        <div>
          <h1 className="text-lg font-bold text-foreground">{ticket.subject}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Opened {formatDateTime(ticket.created_at)}
          </p>
        </div>
        <span
          className={`inline-flex items-center self-start px-2.5 py-1 rounded text-xs font-medium shrink-0 ${statusStyle[ticket.status]}`}
        >
          {statusLabel[ticket.status]}
        </span>
      </div>

      {/* Messages */}
      <div className="space-y-4 mb-8">
        {(messages ?? []).map((message) => {
          const author = authorMap.get(message.author_id);
          const isOwnMessage = message.author_id === user.id;
          const isAdmin = author?.role === "admin";

          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5"
                style={{
                  background: isAdmin ? "var(--color-primary)" : "var(--color-muted)",
                  color: isAdmin ? "var(--color-primary-foreground)" : "var(--color-muted-foreground)",
                }}
                aria-hidden="true"
              >
                {isAdmin ? "G" : "Y"}
              </div>
              <div className={`max-w-[75%] ${isOwnMessage ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div
                  className={`px-4 py-3 rounded-lg text-sm leading-relaxed whitespace-pre-wrap ${
                    isOwnMessage
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted text-foreground rounded-tl-none"
                  }`}
                >
                  {message.content}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isAdmin ? "GOPANG Team" : "You"} ·{" "}
                  {formatDateTime(message.created_at)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply form */}
      {isTicketOpen ? (
        <div className="border-t border-border pt-6">
          <TicketReplyForm ticketId={ticket.id} />
        </div>
      ) : (
        <div className="border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            This ticket is {ticket.status}. If you need further assistance,{" "}
            <Link href="/dashboard/tickets/new" className="text-primary hover:underline">
              open a new ticket.
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
