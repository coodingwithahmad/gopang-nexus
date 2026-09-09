import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: project, error } = await supabase
    .from("portfolio_projects")
    .select("title, summary")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !project) return { title: "Not Found" };

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: project, error } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !project) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 lg:py-16">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to projects
      </Link>

      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {project.summary}
          </p>
        </header>

        {project.image_path && (
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted border border-border">
            {/* Image would go here */}
          </div>
        )}

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{project.description}</p>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Ready to start your project?
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Get a consultation
          </Link>
        </div>
      </div>
    </div>
  );
}
