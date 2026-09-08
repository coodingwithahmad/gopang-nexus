import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, LayoutDashboard, MessageSquare, Wrench } from "lucide-react";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web development, business applications, IT consulting, and ongoing maintenance for companies that need reliable software.",
};

const iconMap = {
  Globe,
  LayoutDashboard,
  MessageSquare,
  Wrench,
} as const;

type IconName = keyof typeof iconMap;

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-16">
      {/* Page header */}
      <div className="max-w-2xl mb-12 lg:mb-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Services
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          We work with businesses that have specific software problems. These are
          the four areas where we spend most of our time.
        </p>
      </div>

      {/* Service list */}
      <div className="space-y-12">
        {services.map((service) => {
          const Icon = iconMap[service.iconName as IconName];
          return (
            <article
              key={service.slug}
              className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 lg:gap-12 py-10 border-t border-border first:border-t-0 first:pt-0"
            >
              <div>
                <div className="inline-flex items-center gap-3 mb-4">
                  {Icon && (
                    <div className="p-2 rounded-md bg-primary/8 text-primary">
                      <Icon size={20} />
                    </div>
                  )}
                  <h2 className="text-xl font-bold text-foreground">
                    {service.title}
                  </h2>
                </div>
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mt-2"
                >
                  Learn more
                  <ArrowRight size={14} />
                </Link>
              </div>
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                <ul className="mt-5 space-y-1.5">
                  {service.deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 pt-10 border-t border-border">
        <p className="text-muted-foreground">
          Not sure which service applies to your situation?{" "}
          <Link href="/contact" className="text-primary hover:underline font-medium">
            Send us a message
          </Link>{" "}
          and we&apos;ll figure it out together.
        </p>
      </div>
    </div>
  );
}
