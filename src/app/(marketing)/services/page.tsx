import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Code,
  Laptop,
  Shield,
  Cloud,
  Globe,
  LayoutDashboard,
  MessageSquare,
  Wrench,
} from "lucide-react";
import { services as fallbackServices } from "@/lib/data/services";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Services | GOPANG IT SOLUTION",
  description:
    "Professional web development, business applications, IT consulting, and maintenance support.",
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

export const revalidate = 0; // Always fetch latest

export default async function ServicesPage() {
  let services: Array<{
    id?: string;
    slug: string;
    title: string;
    summary: string;
    icon_name?: string;
    iconName?: string;
  }> = fallbackServices;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const result = await supabase
      .from("services")
      .select("id, slug, title, summary, icon_name")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    const databaseServices = result.data ?? [];
    services = fallbackServices.map((fallback) => {
      const databaseService = databaseServices.find(
        (item) => item.slug === fallback.slug,
      );

      return databaseService
        ? { ...databaseService, title: fallback.title, summary: fallback.summary }
        : fallback;
    });
  }

  if (!services) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 lg:py-24">
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Services
          </h1>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-12 text-center">
          <p className="text-muted-foreground">
            Services are being updated. Please check back soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 lg:py-24">
      <div className="max-w-2xl mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Services
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          We help businesses plan, build, and maintain practical software:
          websites that explain the business clearly, applications that support
          daily operations, and technical guidance when the next decision
          matters.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
        {services?.map((service) => {
          const IconComponent =
            iconMap[service.icon_name || service.iconName || ""] || Code;
          return (
            <Link
              key={service.id || service.slug}
              href={`/services/${service.slug}`}
              className="group relative flex flex-col items-start justify-between rounded-2xl border border-border bg-background p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <IconComponent className="h-6 w-6" />
              </div>

              <h3 className="text-2xl font-semibold leading-tight text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
                {service.summary}
              </p>

              <div className="mt-auto flex items-center text-sm font-medium text-primary">
                View service{" "}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 pt-10 border-t border-border">
        <p className="text-muted-foreground">
          Not sure where your project fits?{" "}
          <Link
            href="/contact"
            className="text-primary hover:underline font-medium"
          >
            Tell us what you are trying to solve
          </Link>{" "}
          and we will point you in the right direction.
        </p>
      </div>
    </div>
  );
}
