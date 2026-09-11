import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

type ChatTicket = {
  id: string;
  updated_at: string;
  client?: {
    full_name: string | null;
    email: string | null;
  } | null;
};

type LatestMessage = {
  ticket_id: string;
  content: string;
  created_at: string;
  is_internal: boolean;
};

export default async function ChatsIndexPage() {
  const supabase = await createClient();
  
  // This page is only seen natively on mobile (or as the placeholder on desktop).
  // Fetch tickets for mobile list view.
  const { data: ticketsData } = await supabase
    .from("tickets")
    .select(`
      id,
      updated_at,
      client:profiles!tickets_client_id_fkey(id, full_name, email)
    `);

  const tickets = (ticketsData || []) as unknown as ChatTicket[];
  const ticketIds = tickets.map((t) => t.id);
  const latestMessages: Record<string, LatestMessage> = {};

  if (ticketIds.length > 0) {
    const { data: messages } = await supabase
      .from("ticket_messages")
      .select("ticket_id, content, created_at, is_internal")
      .in("ticket_id", ticketIds)
      .order("created_at", { ascending: false });

    messages?.forEach((msg) => {
      if (!latestMessages[msg.ticket_id]) {
        latestMessages[msg.ticket_id] = msg;
      }
    });
  }

  tickets.sort((a, b) => {
    const timeA = latestMessages[a.id]?.created_at || a.updated_at;
    const timeB = latestMessages[b.id]?.created_at || b.updated_at;
    return new Date(timeB).getTime() - new Date(timeA).getTime();
  });

  return (
    <>
      {/* DESKTOP: Empty State */}
      <div className="hidden md:flex flex-col items-center justify-center h-full text-muted-foreground p-6 text-center">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
          <MessageSquare size={32} className="opacity-50" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Your Conversations</h2>
        <p className="text-sm">Select a client from the list to view their messages.</p>
      </div>

      {/* MOBILE: List View */}
      <div className="md:hidden flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-border shrink-0">
          <h2 className="font-bold text-lg text-foreground">Client Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {tickets.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No active client conversations.
            </div>
          ) : (
            tickets.map((ticket) => {
              const latestMsg = latestMessages[ticket.id];
              return (
                <Link
                  key={ticket.id}
                  href={`/dashboard/chats/${ticket.id}`}
                  className="block p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="text-sm font-semibold text-foreground truncate pr-2">
                      {ticket.client?.full_name || "Unknown Client"}
                    </h3>
                    {latestMsg && (
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                        {formatDateTime(latestMsg.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1 truncate">
                    {ticket.client?.email || "No email"}
                  </p>
                  {latestMsg && (
                    <p className="text-sm text-muted-foreground truncate">
                      <span className="opacity-70">{latestMsg.is_internal ? "Internal: " : ""}</span>
                      {latestMsg.content}
                    </p>
                  )}
                </Link>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
