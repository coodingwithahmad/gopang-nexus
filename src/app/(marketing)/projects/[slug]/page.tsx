import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProjectBySlug, portfolioProjects } from "@/lib/data/portfolio";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return portfolioProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-16">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        All projects
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 lg:gap-16">
        <div>
          <p className="text-sm text-muted-foreground mb-2">{project.client}</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {project.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="mt-6 text-muted-foreground leading-relaxed">
            {project.description}
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <h2 className="font-semibold text-foreground mb-2">
                The challenge
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.challenge}
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-foreground mb-2">
                What we built
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>
        </div>

        <aside>
          <div className="rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Building something similar?
            </p>
            <Link
              href="/contact"
              className="block text-center px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Get in touch
            </Link>
            <Link
              href="/projects"
              className="block text-center mt-2 px-4 py-2.5 rounded-md border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
            >
              View all projects
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
