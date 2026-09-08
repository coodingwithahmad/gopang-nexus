import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatDateTime, formatRelative } from "@/lib/utils";
import { ArrowLeft, CheckCircle2, Circle, FileText, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Project",
  robots: { index: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

async function getSignedUrl(storagePath: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.storage
    .from("project-files")
    .createSignedUrl(storagePath, 300); // 5-minute expiry
  return data?.signedUrl ?? null;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch project — RLS ensures this only returns the client's own projects
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  // If project doesn't exist OR belongs to another client (RLS returns null), show 404
  if (!project) notFound();

  // Fetch related data in parallel
  const [milestonesRes, updatesRes, filesRes] = await Promise.all([
    supabase
      .from("project_milestones")
      .select("id, title, description, due_date, completed, sort_order")
      .eq("project_id", id)
      .order("sort_order"),

    supabase
      .from("project_updates")
      .select("id, content, created_at, author_id")
      .eq("project_id", id)
      .order("created_at", { ascending: false })
      .limit(20),

    supabase
      .from("project_files")
      .select("id, filename, file_size, mime_type, storage_path, created_at")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const milestones = milestonesRes.data ?? [];
  const updates = updatesRes.data ?? [];
  const files = filesRes.data ?? [];

  const completedMilestones = milestones.filter((m) => m.completed).length;

  const statusLabel: Record<string, string> = {
    scoping: "Scoping",
    active: "Active",
    review: "In Review",
    completed: "Completed",
    paused: "Paused",
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        All projects
      </Link>

      {/* Project header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="text-xl font-bold text-foreground">{project.title}</h1>
          {project.description && (
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-xl">
              {project.description}
            </p>
          )}
        </div>
        <span className="inline-flex items-center self-start px-2.5 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
          {statusLabel[project.status] ?? project.status}
        </span>
      </div>

      {/* Project meta */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 pb-8 border-b border-border">
        {[
          { label: "Start date", value: project.start_date ? formatDate(project.start_date) : "—" },
          { label: "Due date", value: project.due_date ? formatDate(project.due_date) : "—" },
          { label: "Milestones", value: milestones.length > 0 ? `${completedMilestones} / ${milestones.length}` : "—" },
          { label: "Last update", value: formatRelative(project.updated_at) },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-8">
          {/* Milestones */}
          <section>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
              Milestones
            </h2>
            {milestones.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No milestones have been added yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {milestones.map((m) => (
                  <li key={m.id} className="flex items-start gap-3">
                    {m.completed ? (
                      <CheckCircle2
                        size={18}
                        className="text-green-600 shrink-0 mt-0.5"
                      />
                    ) : (
                      <Circle
                        size={18}
                        className="text-muted-foreground shrink-0 mt-0.5"
                      />
                    )}
                    <div className="min-w-0">
                      <p
                        className={`text-sm ${m.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
                      >
                        {m.title}
                      </p>
                      {m.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {m.description}
                        </p>
                      )}
                      {m.due_date && !m.completed && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Due {formatDate(m.due_date)}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
              Project Updates
            </h2>
            {updates.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No updates yet. Updates from the team will appear here.
              </p>
            ) : (
              <div className="space-y-4">
                {updates.map((update) => (
                  <div
                    key={update.id}
                    className="border-l-2 border-border pl-4 py-1"
                  >
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {update.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {formatDateTime(update.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Files sidebar */}
        <aside>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
            Files
          </h2>
          {files.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No files have been shared yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {files.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background"
                >
                  <FileText
                    size={16}
                    className="text-muted-foreground shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.filename}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.file_size / 1024).toFixed(0)} KB ·{" "}
                      {formatDate(file.created_at)}
                    </p>
                  </div>
                  {/* File download is handled via a separate route to enforce auth */}
                  <Link
                    href={`/api/files/${file.id}/download`}
                    className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label={`Download ${file.filename}`}
                  >
                    <Download size={14} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}
