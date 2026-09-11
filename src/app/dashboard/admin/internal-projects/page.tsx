import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { deleteInternalProjectAction } from "@/lib/actions/internal-projects";
import { ConfirmSubmitButton } from "@/components/dashboard/ConfirmSubmitButton";

type AdminInternalProject = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  start_date: string | null;
  due_date: string | null;
  client?: {
    full_name: string | null;
  } | null;
};

export default async function InternalProjectsPage() {
  const supabase = await createClient();

  const { data: projectsData } = await supabase
    .from("projects")
    .select("*, client:profiles!projects_client_id_fkey(full_name)")
    .order("created_at", { ascending: false });
  const projects = (projectsData ?? []) as unknown as AdminInternalProject[];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-blue-100 text-blue-700 border-blue-200";
      case "review": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "paused": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-purple-100 text-purple-700 border-purple-200"; // scoping
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Internal Projects</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage active client projects and track progress.
          </p>
        </div>
        <Link
          href="/dashboard/admin/internal-projects/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus size={16} />
          New Project
        </Link>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Project</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Timeline</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {!projects || projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No internal projects found.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{project.title}</div>
                      {project.description && (
                        <div className="text-muted-foreground text-xs truncate max-w-[200px] mt-1">
                          {project.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {project.client?.full_name || "Unknown"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider border ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {project.start_date ? new Date(project.start_date).toLocaleDateString() : "TBD"}
                      {" - "}
                      {project.due_date ? new Date(project.due_date).toLocaleDateString() : "TBD"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/admin/internal-projects/${project.id}/edit`}
                          className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <form action={deleteInternalProjectAction.bind(null, project.id)}>
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
