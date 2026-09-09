import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { InternalProjectForm } from "@/components/forms/InternalProjectForm";

export default async function EditInternalProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: clients }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).single(),
    supabase.from("profiles").select("id, full_name, email").eq("role", "client").order("full_name")
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        href="/dashboard/admin/internal-projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to Internal Projects
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Edit Project</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Update the status and details for <strong>{project.title}</strong>.
        </p>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm p-6">
        <InternalProjectForm initialData={project as any} clients={(clients as any) || []} />
      </div>
    </div>
  );
}
