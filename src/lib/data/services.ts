/**
 * Static service data for the marketing site.
 *
 * These are rendered server-side. When a Supabase project is connected,
 * this can be replaced with a database query (or kept as static for performance).
 */

export interface ServiceItem {
  slug: string;
  title: string;
  summary: string;
  description: string;
  iconName: string;
  deliverables: string[];
}

export const services: ServiceItem[] = [
  {
    slug: "web-development",
    title: "Web Development",
    summary:
      "Websites and web applications built to work reliably and scale with your business.",
    description:
      "We design and build websites and web applications that serve a clear purpose. Whether you need a company website, a booking platform, or a customer-facing web app, we build it with clean code, good performance, and a structure your team can maintain.",
    iconName: "Globe",
    deliverables: [
      "Custom website design and development",
      "E-commerce and booking systems",
      "Progressive web applications",
      "CMS integration",
      "Performance and SEO optimization",
    ],
  },
  {
    slug: "business-applications",
    title: "Business Applications",
    summary:
      "Internal tools and business software designed around how your team actually works.",
    description:
      "Generic software rarely fits the way your business operates. We build internal tools, dashboards, and business applications that match your actual workflow — whether that's inventory management, a client portal, a reporting system, or something specific to your industry.",
    iconName: "LayoutDashboard",
    deliverables: [
      "Internal dashboards and admin tools",
      "Client and vendor portals",
      "Inventory and operations management",
      "Reporting and analytics tools",
      "Process automation",
    ],
  },
  {
    slug: "it-consulting",
    title: "IT Consulting",
    summary:
      "Practical technology advice for businesses making decisions about software and systems.",
    description:
      "Technology decisions made poorly are expensive to fix. We help businesses evaluate their options, plan their systems, and avoid common mistakes — without the jargon. Whether you're choosing between platforms, planning a new system, or reviewing an existing one, we give you an honest assessment.",
    iconName: "MessageSquare",
    deliverables: [
      "Technology assessment and planning",
      "Software selection and vendor evaluation",
      "System architecture review",
      "Data migration planning",
      "Team training",
    ],
  },
  {
    slug: "maintenance-support",
    title: "Maintenance & Support",
    summary:
      "Ongoing technical support for websites and applications your business depends on.",
    description:
      "Software needs maintenance. We offer ongoing support agreements for websites and applications — keeping them updated, monitored, secure, and running. When something breaks, you have someone to call.",
    iconName: "Wrench",
    deliverables: [
      "Scheduled maintenance and updates",
      "Security monitoring and patches",
      "Bug fixes and minor improvements",
      "Uptime monitoring",
      "Priority support response",
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return services.find((s) => s.slug === slug);
}
