"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBlogPostAction, updateBlogPostAction } from "@/lib/actions/blog";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type BlogPost = {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  published: boolean;
};

export function BlogForm({ initialData }: { initialData?: BlogPost }) {
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
        await updateBlogPostAction(initialData.id, formData);
      } else {
        await createBlogPostAction(formData);
      }
      router.push("/dashboard/admin/blog");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred while saving.");
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-4xl">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
            Post Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={initialData?.title}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="e.g. The Future of Web Development"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-foreground mb-1">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            required
            rows={2}
            defaultValue={initialData?.excerpt}
            className="w-full flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="A short summary of the post..."
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-foreground mb-1">
            Post Content (Markdown supported)
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={15}
            defaultValue={initialData?.content}
            className="w-full flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
            placeholder="Write your article here..."
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            id="published"
            name="published"
            type="checkbox"
            defaultChecked={initialData?.published ?? false}
            className="h-4 w-4 rounded border-input bg-background text-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <label htmlFor="published" className="text-sm font-medium text-foreground">
            Publish Post
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
          {isEdit ? "Update Post" : "Create Post"}
        </button>
        <Link
          href="/dashboard/admin/blog"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
