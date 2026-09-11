import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquare, Search } from "lucide-react";

type ChatTicket = {
  id: string;
  subject: string | null;
  status: string;
  priority: string;
  created_at: string;
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

export default async function AdminChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/"); // Clients shouldn't be here
  }

  // Fetch all tickets with latest messages for the sidebar
  const { data: ticketsData } = await supabase
    .from("tickets")
    .select(`
      id,
      subject,
      status,
      priority,
      created_at,
      updated_at,
      client:profiles!tickets_client_id_fkey(id, full_name, email)
    `)
    .order("updated_at", { ascending: false })
    .limit(50);

  const tickets = (ticketsData || []) as unknown as ChatTicket[];

  const ticketIds = tickets.map((t) => t.id);
  const latestMessages: Record<string, LatestMessage> = {};

  if (ticketIds.length > 0) {
    const { data: messages } = await supabase
      .from("ticket_messages")
      .select("ticket_id, content, created_at, is_internal")
      .in("ticket_id", ticketIds)
      .order("created_at", { ascending: false })
      .limit(150);

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

  const openCount = tickets.filter((ticket) =>
    ["open", "in_progress"].includes(ticket.status),
  ).length;

  return (
    <div className="flex h-[calc(100vh-7rem)] bg-background border border-border rounded-lg shadow-sm overflow-hidden">
      {/* Sidebar: Hidden on mobile (rendered in page.tsx on mobile instead), visible on Desktop */}
      <div className="hidden md:flex flex-col w-1/3 border-r border-border min-w-[280px] max-w-[350px]">
        <div className="p-4 border-b border-border bg-muted/20 shrink-0 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-base text-foreground">Client Chats</h2>
              <p className="text-xs text-muted-foreground">
                {openCount} open of {tickets.length} conversations
              </p>
            </div>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <MessageSquare size={16} />
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
            <Search size={14} />
            <span>Newest conversations first</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {tickets.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Client conversations will appear here when a client starts a chat.
            </div>
          ) : (
            tickets.map((ticket) => {
              const latestMsg = latestMessages[ticket.id];
              return (
                <Link
                  key={ticket.id}
                  href={`/dashboard/chats/${ticket.id}`}
                  className="block p-4 hover:bg-muted/30 transition-colors focus:bg-muted/50"
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
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {ticket.status.replace("_", " ")}
                    </span>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {ticket.priority}
                    </span>
                  </div>
                  {latestMsg ? (
                    <p className="text-xs text-muted-foreground truncate">
                      <span className="opacity-70">{latestMsg.is_internal ? "Internal: " : ""}</span>
                      {latestMsg.content}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground italic opacity-70">No messages yet</p>
                  )}
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {children}
      </div>
    </div>
  );
}
