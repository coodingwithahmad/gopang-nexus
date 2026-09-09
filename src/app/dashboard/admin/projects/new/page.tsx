import { createClient } from "@/lib/supabase/server";
import { createProjectAction } from "@/lib/actions/admin-projects";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewAdminProjectPage() {
  const supabase = await createClient();

  // Fetch all clients to populate the dropdown
  const { data: clients } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "client")
    .order("full_name");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/dashboard/admin/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft size={14} /> Back to Projects
        </Link>
        <h2 className="text-2xl font-bold text-foreground">Create New Project</h2>
      </div>

      <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
        <form action={createProjectAction} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Select Client</label>
            <select
              name="clientId"
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">-- Select a client --</option>
              {clients?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.email})
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">The user must have already registered an account.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Project Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. E-Commerce Redesign"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Status</label>
            <select
              name="status"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="planning">Planning / Scoping</option>
              <option value="in_development">In Development</option>
              <option value="review">Under Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              name="description"
              rows={4}
              placeholder="Project goals and details..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
