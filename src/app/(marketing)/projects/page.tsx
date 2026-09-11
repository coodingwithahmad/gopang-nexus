import type { Metadata } from "next";
import Link from "next/link";
import { portfolioProjects as fallbackProjects } from "@/lib/data/portfolio";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A selection of websites, business applications, and internal tools we have built for clients.",
};

export const revalidate = 0; // Always fetch latest projects

export default async function ProjectsPage() {
  let portfolioProjects: Array<{
    slug: string;
    title: string;
    summary: string;
    tags?: unknown;
  }> = fallbackProjects;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const result = await supabase
      .from("portfolio_projects")
      .select("slug, title, summary, tags")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    portfolioProjects = result.data?.length ? result.data : fallbackProjects;
  }

  if (!portfolioProjects) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-16">
        <div className="max-w-2xl mb-12 lg:mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Projects
          </h1>
        </div>
        <div className="space-y-px border border-border rounded-lg overflow-hidden">
          <div className="p-8 text-center text-muted-foreground">
            More projects coming soon.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-16">
      <div className="max-w-2xl mb-12 lg:mb-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Projects
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          A selection of work we&apos;ve done for clients across different
          industries. Client names are kept confidential.
        </p>
      </div>

      <div className="space-y-px border border-border rounded-lg overflow-hidden">
        {!portfolioProjects || portfolioProjects.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            More projects coming soon.
          </div>
        ) : (
          portfolioProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 p-5 sm:p-6 bg-background hover:bg-muted/40 transition-colors border-b border-border last:border-b-0"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h2>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {project.summary}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(Array.isArray(project.tags) ? project.tags : []).map(
                    (tag) => (
                      <span
                        key={String(tag)}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground"
                      >
                        {String(tag)}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <p className="text-muted-foreground text-sm">
          Have a project similar to one of these?{" "}
          <Link
            href="/contact"
            className="text-primary hover:underline font-medium"
          >
            Let&apos;s talk.
          </Link>
        </p>
      </div>
    </div>
  );
}
