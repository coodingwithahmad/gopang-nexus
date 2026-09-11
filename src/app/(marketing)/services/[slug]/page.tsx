import { notFound } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getServiceBySlug } from "@/lib/data/services";
import {
  ArrowLeft,
  Code,
  Laptop,
  Shield,
  Cloud,
  Globe,
  LayoutDashboard,
  MessageSquare,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

const iconMap: Record<string, React.ElementType> = {
  Code,
  Laptop,
  Shield,
  Cloud,
  Globe,
  LayoutDashboard,
  MessageSquare,
  Wrench,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isSupabaseConfigured()) {
    const service = getServiceBySlug(slug);
    return service
      ? {
          title: `${service.title} | GOPANG IT SOLUTION`,
          description: service.summary,
        }
      : { title: "Service Not Found" };
  }

  const supabase = await createClient();
  const { data: service, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !service) {
    return { title: "Service Not Found" };
  }

  return {
    title: `${service.title} | GOPANG IT SOLUTION`,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const fallbackService = getServiceBySlug(slug);
  let service: {
    title: string;
    summary: string;
    description: string;
    deliverables?: string[];
    icon_name?: string;
    iconName?: string;
  } | null = fallbackService
    ? {
        title: fallbackService.title,
        summary: fallbackService.summary,
        description: fallbackService.description,
        deliverables: fallbackService.deliverables,
        iconName: fallbackService.iconName,
      }
    : null;
  let error = null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const result = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    service = fallbackService
      ? {
          title: fallbackService.title,
          summary: fallbackService.summary,
          description: fallbackService.description,
          deliverables: fallbackService.deliverables,
          iconName: fallbackService.iconName,
        }
      : result.data || service;
    error = result.error;
  }

  if (error || !service) {
    notFound();
  }

  const IconComponent =
    iconMap[service.icon_name || service.iconName || ""] || Code;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 lg:py-24">
      <div className="mb-8">
        <Link
          href="/services"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Services
        </Link>
      </div>

      <div className="mb-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary mb-8">
          <IconComponent className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
          {service.title}
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          {service.summary}
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary">
        <ReactMarkdown>
          {service.description || "More details coming soon."}
        </ReactMarkdown>
      </div>

      {service.deliverables?.length ? (
        <div className="mt-12 rounded-lg border border-border bg-muted/20 p-6">
          <h2 className="text-lg font-semibold text-foreground">
            What this can include
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {service.deliverables.map((item) => (
              <li key={item} className="text-sm text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
