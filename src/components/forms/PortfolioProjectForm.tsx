"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createPortfolioProjectAction,
  updatePortfolioProjectAction,
} from "@/lib/actions/admin-projects";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/forms/ImageUpload";

type Project = {
  id?: string;
  title: string;
  slug?: string;
  summary: string;
  description: string;
  tags: string[];
  image_path?: string;
  published: boolean;
  sort_order: number;
};

export function PortfolioProjectForm({
  initialData,
}: {
  initialData?: Project;
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
        await updatePortfolioProjectAction(initialData.id, formData);
      } else {
        await createPortfolioProjectAction(formData);
      }
      router.push("/dashboard/admin/projects");
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An error occurred while saving.";
      setError(message);
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-4xl">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Project Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                defaultValue={initialData?.title}
                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. E-Commerce Redesign"
              />
            </div>

            <div>
              <label
                htmlFor="summary"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Summary (Max 160 chars)
              </label>
              <textarea
                id="summary"
                name="summary"
                required
                maxLength={160}
                rows={2}
                defaultValue={initialData?.summary}
                className="w-full flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="A compelling brief description..."
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Full Description (Markdown supported)
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={12}
                defaultValue={initialData?.description}
                className="w-full flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                placeholder="Elaborate on the challenge, solution, and results..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Featured Image
            </label>
            <ImageUpload
              name="image_path"
              defaultValue={initialData?.image_path}
              bucket="media"
              folder="portfolio"
            />
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Tags (Comma separated)
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              required
              defaultValue={initialData?.tags?.join(", ")}
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="React, Next.js, Stripe"
            />
          </div>

          <div>
            <label
              htmlFor="sort_order"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Sort Order
            </label>
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={initialData?.sort_order ?? 0}
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              id="published"
              name="published"
              type="checkbox"
              defaultChecked={initialData?.published ?? true}
              className="h-4 w-4 rounded border-input bg-background text-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <label
              htmlFor="published"
              className="text-sm font-medium text-foreground"
            >
              Publish Project
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-border">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {isEdit ? "Update Project" : "Create Project"}
        </button>
        <Link
          href="/dashboard/admin/projects"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
