import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Chats",
  robots: { index: false },
};

export default async function ChatsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  // CLIENT FLOW: Single Conversation
  if (profile.role === "client") {
    // Check if they have a ticket
    let { data: ticket } = await supabase
      .from("tickets")
      .select("id")
      .eq("client_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (!ticket) {
      // Create a master chat for them
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
        return <div>Error creating chat.</div>;
      }
      ticket = newTicket;
    }

    // Redirect straight into their single chat thread
    redirect(`/dashboard/chats/${ticket.id}`);
  }

  // ADMIN FLOW: Client Conversation Manager
  // Fetch all tickets with their latest message
  // Using a simplified approach since doing complex joins in Supabase JS is tricky:
  const { data } = await supabase
    .from("tickets")
    .select(`
      id,
      updated_at,
      client:profiles!tickets_client_id_fkey(id, full_name, email)
    `)
    .order("updated_at", { ascending: false });

  const tickets = data as any[];

  // Fetch latest messages
  const ticketIds = tickets?.map((t: any) => t.id) || [];
  let latestMessages: Record<string, any> = {};
  
  if (ticketIds.length > 0) {
    const { data: messages } = await supabase
      .from("ticket_messages")
      .select("ticket_id, content, created_at, is_internal")
      .in("ticket_id", ticketIds)
      .order("created_at", { ascending: false });

    // Group by ticket_id and pick the first one
    messages?.forEach((msg) => {
      if (!latestMessages[msg.ticket_id]) {
        latestMessages[msg.ticket_id] = msg;
      }
    });
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Client Conversations</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage all ongoing chats with your clients.
        </p>
      </div>

      <div className="bg-background rounded-xl border border-border overflow-hidden shadow-sm">
        {(!tickets || tickets.length === 0) ? (
          <div className="p-8 text-center text-muted-foreground">
            No active client conversations.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {tickets.map((ticket: any) => {
              const latestMsg = latestMessages[ticket.id];
              return (
                <Link
                  key={ticket.id}
                  href={`/dashboard/chats/${ticket.id}`}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        {ticket.client?.full_name || "Unknown Client"}
                      </h3>
                      {latestMsg && (
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
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
                        "{latestMsg.content}"
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
