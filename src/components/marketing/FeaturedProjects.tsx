import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { portfolioProjects } from "@/lib/data/portfolio";

export function FeaturedProjects() {
  const featured = portfolioProjects.slice(0, 3);

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 lg:py-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Recent projects
          </h2>
          <p className="mt-2 text-muted-foreground">
            A sample of the work we&apos;ve done for clients.
          </p>
        </div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline shrink-0"
        >
          All projects
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-px border border-border rounded-lg overflow-hidden">
        {featured.map((project, i) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 p-5 sm:p-6 bg-background hover:bg-muted/40 transition-colors border-b border-border last:border-b-0"
          >
            <span className="text-sm text-muted-foreground font-mono shrink-0 sm:w-6 sm:text-right">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <span className="text-xs text-muted-foreground shrink-0">
                  {project.client}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {project.summary}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
