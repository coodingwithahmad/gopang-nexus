import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { deleteProjectAction } from "@/lib/actions/admin-projects";

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  // Fetch all projects along with the client's name
  const { data: projects } = await supabase
    .from("projects")
    .select(`
      id, name, status, created_at,
      profiles ( full_name, email )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Manage Projects</h2>
          <p className="text-sm text-muted-foreground mt-1">Create, update, or remove client projects.</p>
        </div>
        <Link
          href="/dashboard/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} /> New Project
        </Link>
      </div>

      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project Name</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Client</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!projects || projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No projects found.
                </td>
              </tr>
            ) : (
              projects.map((project: any) => (
                <tr key={project.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{project.name}</td>
                  <td className="px-4 py-3">
                    <p className="text-foreground">{project.profiles?.full_name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{project.profiles?.email}</p>
                  </td>
                  <td className="px-4 py-3 capitalize">{project.status.replace("_", " ")}</td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteProjectAction}>
                      <input type="hidden" name="projectId" value={project.id} />
                      <button 
                        type="submit" 
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
