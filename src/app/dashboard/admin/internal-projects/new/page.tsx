import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  InternalProjectForm,
  type InternalProjectClientOption,
} from "@/components/forms/InternalProjectForm";

export default async function NewInternalProjectPage() {
  const supabase = await createClient();

  const { data: clientsData } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "client")
    .order("full_name");
  const clients = (clientsData ?? []) as unknown as InternalProjectClientOption[];

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
        <h1 className="text-2xl font-bold text-foreground">Create Project</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Initialize a new project for a client.
        </p>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm p-6">
        <InternalProjectForm clients={clients} />
      </div>
    </div>
  );
}
