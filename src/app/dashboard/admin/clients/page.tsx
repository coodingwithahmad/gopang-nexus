import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";
import { Mail, Briefcase, Eye } from "lucide-react";

type ClientRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  company: string | null;
  created_at: string;
  projects?: Array<{ count: number }>;
};

export default async function ClientsDirectoryPage() {
  const supabase = await createClient();

  const { data: clientsData } = await supabase
    .from("profiles")
    .select(`
      *,
      projects:projects(count),
      tickets:tickets(count)
    `)
    .eq("role", "client")
    .order("created_at", { ascending: false });
  const clients = (clientsData ?? []) as unknown as ClientRow[];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Client Directory</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            View and manage all registered clients on the platform.
          </p>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Client Info</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Internal Projects</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {!clients || clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No clients found in the system.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground flex items-center gap-2">
                        {client.full_name || "Unnamed Client"}
                      </div>
                      <div className="text-muted-foreground text-xs mt-1 flex items-center gap-1">
                        <Mail size={12} /> {client.email || "No email"}
                      </div>
                      {client.company && (
                        <div className="text-muted-foreground text-xs mt-0.5 flex items-center gap-1">
                          <Briefcase size={12} /> {client.company}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDateTime(client.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                          {client.projects?.[0]?.count || 0} active
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-green-100 text-green-700 border border-green-200">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* A button to potentially "impersonate" or view details in future */}
                        <button
                          type="button"
                          className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10"
                          title="View Profile (Coming Soon)"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
