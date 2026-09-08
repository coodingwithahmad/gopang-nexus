import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects",
  robots: { index: false },
};

const statusLabel: Record<string, string> = {
  scoping: "Scoping",
  active: "Active",
  review: "In Review",
  completed: "Completed",
  paused: "Paused",
};

const statusStyle: Record<string, string> = {
  scoping: "bg-muted text-muted-foreground",
  active: "bg-blue-50 text-blue-700 border border-blue-200",
  review: "bg-amber-50 text-amber-700 border border-amber-200",
  completed: "bg-green-50 text-green-700 border border-green-200",
  paused: "bg-muted text-muted-foreground",
};

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, title, status, start_date, due_date, updated_at")
    .eq("client_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-sm text-destructive">
          We couldn&apos;t load your projects. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-foreground mb-6">Projects</h1>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-border bg-background p-8 text-center">
          <p className="text-sm font-medium text-foreground">No projects yet.</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
            When we start a project together, it will appear here with its
            status, milestones, and files.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Project
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                  Due date
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {project.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {project.due_date ? formatDate(project.due_date) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusStyle[project.status] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {statusLabel[project.status] ?? project.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
