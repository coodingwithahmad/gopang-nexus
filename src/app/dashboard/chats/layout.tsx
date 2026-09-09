import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

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
      updated_at,
      client:profiles!tickets_client_id_fkey(id, full_name, email)
    `);

  const tickets = (ticketsData || []) as any[];

  const ticketIds = tickets.map((t) => t.id);
  let latestMessages: Record<string, any> = {};

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
    <div className="flex h-[calc(100vh-8rem)] bg-background border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Sidebar: Hidden on mobile (rendered in page.tsx on mobile instead), visible on Desktop */}
      <div className="hidden md:flex flex-col w-1/3 border-r border-border min-w-[280px] max-w-[350px]">
        <div className="p-4 border-b border-border bg-muted/20 shrink-0">
          <h2 className="font-bold text-lg text-foreground">Chats</h2>
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
