"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createInternalProjectAction, updateInternalProjectAction } from "@/lib/actions/internal-projects";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type InternalProject = {
  id?: string;
  client_id: string;
  title: string;
  description: string;
  status: string;
  start_date: string | null;
  due_date: string | null;
};

export function InternalProjectForm({
  initialData,
  clients,
}: {
  initialData?: InternalProject;
  clients: { id: string; full_name: string; email: string }[];
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!initialData?.id;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      if (isEdit && initialData?.id) {
        await updateInternalProjectAction(initialData.id, formData);
      } else {
        await createInternalProjectAction(formData);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while saving.");
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
            Project Name
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={initialData?.title}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="e.g. Website Redesign"
          />
        </div>

        <div>
          <label htmlFor="client_id" className="block text-sm font-medium text-foreground mb-1">
            Client
          </label>
          <select
            id="client_id"
            name="client_id"
            required
            defaultValue={initialData?.client_id || ""}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>Select a client</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.full_name || "Unknown"} ({c.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-foreground mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            required
            defaultValue={initialData?.status || "scoping"}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="scoping">Scoping</option>
            <option value="active">Active</option>
            <option value="review">Review</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
            Description / Notes
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={initialData?.description}
            className="w-full flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Internal notes about the project scope..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-foreground mb-1">
              Start Date
            </label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              defaultValue={initialData?.start_date || ""}
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-foreground mb-1">
              Due Date
            </label>
            <input
              id="due_date"
              name="due_date"
              type="date"
              defaultValue={initialData?.due_date || ""}
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {isEdit ? "Update Project" : "Create Project"}
        </button>
        <Link
          href="/dashboard/admin/internal-projects"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
