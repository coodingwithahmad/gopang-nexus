import { createPortfolioProjectAction } from "@/lib/actions/admin-projects";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewAdminProjectPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/dashboard/admin/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft size={14} /> Back to Projects
        </Link>
        <h2 className="text-2xl font-bold text-foreground">Add Public Project</h2>
        <p className="text-sm text-muted-foreground mt-1">This project will instantly appear on the main website.</p>
      </div>

      <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
        <form action={createPortfolioProjectAction} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Project Title</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Acme Corp E-Commerce"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Short Summary</label>
            <input
              type="text"
              name="summary"
              required
              placeholder="A brief 1-sentence description."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Technologies & Tags</label>
            <input
              type="text"
              name="tags"
              required
              placeholder="React, Next.js, Stripe (comma separated)"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Full Description</label>
            <textarea
              name="description"
              required
              rows={5}
              placeholder="Detailed description of the project, problem, and solution..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Publish to Website
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
