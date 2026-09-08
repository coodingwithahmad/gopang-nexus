import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getServiceBySlug, services } from "@/lib/data/services";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.summary,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-16">
      <Link
        href="/services"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        All services
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 lg:gap-16">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {service.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {service.summary}
          </p>
          <div className="mt-8 prose prose-neutral max-w-none">
            <p className="text-foreground leading-relaxed">{service.description}</p>
          </div>
        </div>

        <aside>
          <div className="rounded-lg border border-border p-6">
            <h2 className="font-semibold text-foreground mb-4">
              What&apos;s included
            </h2>
            <ul className="space-y-2">
              {service.deliverables.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Ready to discuss a project?
              </p>
              <Link
                href="/contact"
                className="block text-center px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
