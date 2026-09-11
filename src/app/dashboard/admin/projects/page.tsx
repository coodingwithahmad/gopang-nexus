import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { deletePortfolioProjectAction } from "@/lib/actions/admin-projects";
import { ConfirmSubmitButton } from "@/components/dashboard/ConfirmSubmitButton";

type AdminPortfolioProject = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  published: boolean;
  sort_order: number | null;
};

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  const { data: projectsData } = await supabase
    .from("portfolio_projects")
    .select("id, title, slug, summary, published, sort_order")
    .order("sort_order", { ascending: true });
  const projects = (projectsData ?? []) as unknown as AdminPortfolioProject[];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Public Projects</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage the portfolio projects shown on the main website.
          </p>
        </div>
        <Link
          href="/dashboard/admin/projects/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Project
        </Link>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Project</th>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {!projects || projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No public projects found.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{project.title}</div>
                      <div className="text-muted-foreground text-xs truncate max-w-sm mt-1">
                        {project.summary}
                      </div>
                    </td>
                    <td className="px-6 py-4">{project.sort_order}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                          project.published
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        {project.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/admin/projects/${project.id}/edit`}
                          className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <form action={deletePortfolioProjectAction}>
                          <input type="hidden" name="id" value={project.id} />
                          <ConfirmSubmitButton message="Are you sure you want to delete this project?" />
                        </form>
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
