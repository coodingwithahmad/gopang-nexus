"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDateTime } from "@/lib/utils";
import { TicketReplyForm } from "@/components/forms/TicketReplyForm";
import { useRouter } from "next/navigation";

export type ChatMessage = {
  id: string;
  author_id: string;
  content: string;
  is_internal: boolean;
  created_at: string;
};

export type ChatAuthor = {
  id: string;
  full_name: string | null;
  role: "client" | "admin";
};

export function ChatThread({ 
  ticketId, 
  initialMessages, 
  authorMap, 
  currentUserId,
  isTicketOpen
}: { 
  ticketId: string;
  initialMessages: ChatMessage[];
  authorMap: Record<string, ChatAuthor>;
  currentUserId: string;
  isTicketOpen: boolean;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const supabase = createClient();
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Scroll to bottom on initial load and when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-ticket-${ticketId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ticket_messages",
          filter: `ticket_id=eq.${ticketId}`,
        },
        async (payload) => {
          const newMsg = payload.new as ChatMessage;
          // If the message is internal and the current user is a client, skip it
          // Wait, RLS doesn't apply to realtime payloads by default unless configured,
          // but our RLS says clients can only select non-internal. Let's filter on client side just in case,
          // though we should re-fetch to get the author profile safely.
          
          if (newMsg.is_internal && authorMap[currentUserId]?.role !== "admin") return;

          // Check if author is already in our map
          if (!authorMap[newMsg.author_id]) {
            // Refetch to get author and trigger full refresh
            router.refresh();
            return;
          }

          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticketId, supabase, authorMap, currentUserId, router]);

  return (
    <div>
      <div className="space-y-4 mb-6">
        {messages?.map((msg) => {
          const isOwnMessage = msg.author_id === currentUserId;
          const author = authorMap[msg.author_id] ?? { full_name: "Unknown", role: "client" };
          const isAdmin = author.role === "admin";

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${
                isOwnMessage ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-xs font-medium text-foreground">
                  {isAdmin ? "Admin Team" : author.full_name}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {formatDateTime(msg.created_at)}
                </span>
              </div>
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap shadow-sm ${
                  isOwnMessage
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-background border border-border text-foreground rounded-tl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {isTicketOpen ? (
        <div className="bg-background border border-border p-4 rounded-xl">
          <TicketReplyForm ticketId={ticketId} />
        </div>
      ) : (
        <div className="text-center py-6 text-sm text-muted-foreground bg-muted/30 rounded-xl border border-border border-dashed">
          This chat is closed. Please start a new chat if you need further assistance.
        </div>
      )}
    </div>
  );
}
