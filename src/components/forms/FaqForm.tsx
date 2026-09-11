"use client";

import { useState } from "react";
import { createFaqAction, updateFaqAction } from "@/lib/actions/faqs";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type Faq = {
  id?: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: boolean;
};

export function FaqForm({ initialData }: { initialData?: Faq }) {
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
        await updateFaqAction(initialData.id, formData);
      } else {
        await createFaqAction(formData);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An error occurred while saving.";
      setError(message);
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
          <label
            htmlFor="question"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Question
          </label>
          <input
            id="question"
            name="question"
            type="text"
            required
            defaultValue={initialData?.question}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="e.g. How long does a project take?"
          />
        </div>

        <div>
          <label
            htmlFor="answer"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Answer
          </label>
          <textarea
            id="answer"
            name="answer"
            required
            rows={5}
            defaultValue={initialData?.answer}
            className="w-full flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Detailed answer..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Category
            </label>
            <input
              id="category"
              name="category"
              type="text"
              required
              defaultValue={initialData?.category || "General"}
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="e.g. General, Pricing, Support"
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
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            defaultChecked={initialData?.is_active ?? true}
            className="h-4 w-4 rounded border-input bg-background text-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <label
            htmlFor="is_active"
            className="text-sm font-medium text-foreground"
          >
            Publish FAQ
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
          {isEdit ? "Update FAQ" : "Create FAQ"}
        </button>
        <Link
          href="/dashboard/admin/faqs"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
