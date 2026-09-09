"use server";

import { createClient } from "@/lib/supabase/server";

export async function getOrCreateClientChat() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { status: "unauthenticated" as const };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") {
    return { status: "admin" as const };
  }

  // Check if they have a ticket
  let { data: ticket } = await supabase
    .from("tickets")
    .select("id")
    .eq("client_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (!ticket) {
    const { data: newTicket, error } = await supabase
      .from("tickets")
      .insert({
        client_id: user.id,
        subject: "Direct Chat",
        priority: "normal",
        status: "open",
      })
      .select("id")
      .single();
      
    if (error || !newTicket) {
      return { status: "error" as const, message: error.message };
    }
    ticket = newTicket;
  }

  // Fetch initial messages
  const { data: messages } = await supabase
    .from("ticket_messages")
    .select("id, content, author_id, is_internal, created_at")
    .eq("ticket_id", ticket.id)
    .order("created_at", { ascending: true });

  // Get authors
  const authorIds = [...new Set((messages ?? []).map((m) => m.author_id))];
  const { data: authors } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .in("id", authorIds);

  const authorMap = authors?.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {} as Record<string, any>) ?? {};

  return {
    status: "success" as const,
    ticketId: ticket.id,
    messages: messages ?? [],
    authorMap,
    currentUserId: user.id,
  };
}
