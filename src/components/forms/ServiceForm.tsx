"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createServiceAction, updateServiceAction } from "@/lib/actions/services";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type Service = {
  id?: string;
  title: string;
  summary: string;
  description: string;
  icon_name: string;
  sort_order: number;
  published: boolean;
};

export function ServiceForm({ initialData }: { initialData?: Service }) {
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
        await updateServiceAction(initialData.id, formData);
      } else {
        await createServiceAction(formData);
      }
      router.push("/dashboard/admin/services");
      router.refresh();
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
            Service Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={initialData?.title}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="e.g. Web Development"
          />
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-foreground mb-1">
            Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            required
            rows={2}
            defaultValue={initialData?.summary}
            className="w-full flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="A short summary for cards (max 160 characters)"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
            Full Description (Markdown/Text)
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={8}
            defaultValue={initialData?.description}
            className="w-full flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
            placeholder="Detailed description..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="icon_name" className="block text-sm font-medium text-foreground mb-1">
              Icon Name (Lucide)
            </label>
            <input
              id="icon_name"
              name="icon_name"
              type="text"
              required
              defaultValue={initialData?.icon_name || "Code"}
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="e.g. Code, Monitor, Server"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Find icons at <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="underline">lucide.dev</a>
            </p>
          </div>

          <div>
            <label htmlFor="sort_order" className="block text-sm font-medium text-foreground mb-1">
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
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            id="published"
            name="published"
            type="checkbox"
            defaultChecked={initialData?.published ?? true}
            className="h-4 w-4 rounded border-input bg-background text-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <label htmlFor="published" className="text-sm font-medium text-foreground">
            Publish Service
          </label>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {isEdit ? "Update Service" : "Create Service"}
        </button>
        <Link
          href="/dashboard/admin/services"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
