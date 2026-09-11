import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  PortfolioProjectForm,
  type PortfolioProjectFormData,
} from "@/components/forms/PortfolioProjectForm";

export default async function EditAdminProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  const projectData = project as unknown as PortfolioProjectFormData;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        href="/dashboard/admin/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to Public Projects
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Edit Project</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Update the details for <strong>{projectData.title}</strong>.
        </p>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm p-6">
        <PortfolioProjectForm initialData={projectData} />
      </div>
    </div>
  );
}
