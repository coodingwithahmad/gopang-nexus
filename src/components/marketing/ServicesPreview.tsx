import Link from "next/link";
import { Globe, LayoutDashboard, MessageSquare, Wrench, ArrowRight } from "lucide-react";
import { services } from "@/lib/data/services";

const iconMap = {
  Globe,
  LayoutDashboard,
  MessageSquare,
  Wrench,
} as const;

type IconName = keyof typeof iconMap;

export function ServicesPreview() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 lg:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Services built around real business needs
            </h2>
            <p className="mt-2 text-muted-foreground">
              Focused technical work for companies that need reliable systems,
              clear communication, and software that earns its place.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline shrink-0"
          >
            View all services
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((service) => {
            const Icon = iconMap[service.iconName as IconName];
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group block p-6 rounded-lg border border-border bg-background hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-md bg-primary/8 text-primary shrink-0">
                    {Icon && <Icon size={20} />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                      {service.summary}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
