import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { deletePortfolioProjectAction } from "@/lib/actions/admin-projects";

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("portfolio_projects")
    .select("id, title, slug, summary, published")
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Manage Public Projects</h2>
          <p className="text-sm text-muted-foreground mt-1">Add, edit, or delete projects shown on the main website.</p>
        </div>
        <Link
          href="/dashboard/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} /> Add Project
        </Link>
      </div>

      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Summary</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!projects || projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No public projects found.
                </td>
              </tr>
            ) : (
              projects.map((project: any) => (
                <tr key={project.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{project.title}</td>
                  <td className="px-4 py-3 text-muted-foreground truncate max-w-xs">{project.summary}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${project.published ? "bg-green-50 text-green-700" : "bg-muted text-muted-foreground"}`}>
                      {project.published ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={deletePortfolioProjectAction}>
                      <input type="hidden" name="id" value={project.id} />
                      <button 
                        type="submit" 
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                        title="Delete Project permanently"
                        onClick={(e) => {
                          if (!confirm("Are you sure you want to delete this project? This will remove it from the public website immediately.")) {
                            e.preventDefault();
                          }
                        }}
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
