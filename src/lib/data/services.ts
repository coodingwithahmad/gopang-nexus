/**
 * Static service data for the marketing site.
 *
 * These are rendered server-side. When a Supabase project is connected,
 * this file still acts as the editorial source for the four core services.
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
      "Professional websites and web applications built for clarity, speed, and long-term reliability.",
    description:
      "Your website should do more than look presentable. It should explain your business clearly, earn trust quickly, and make it easy for customers to take the next step.\n\nWe build company websites, service websites, landing pages, booking flows, and customer-facing web applications with a focus on performance, clean structure, and practical management after launch. The goal is not to add features for show. The goal is to build a site that is fast, credible, secure, and useful for your business.\n\nWhether you need a new website or a more serious web application, we plan the structure, design the user journey, build the interface, connect the right systems, and hand over something your team can continue using with confidence.",
    iconName: "Globe",
    deliverables: [
      "Business websites and service pages",
      "Landing pages designed for enquiries and conversions",
      "Customer portals, booking flows, and web applications",
      "Responsive design for desktop, tablet, and mobile",
      "Performance, technical SEO, and launch support",
    ],
  },
  {
    slug: "business-applications",
    title: "Business Applications",
    summary:
      "Custom dashboards, portals, and internal tools that replace messy manual workflows.",
    description:
      "Most growing businesses reach a point where spreadsheets, messages, and disconnected tools start slowing the team down. Important information is hard to find, reporting takes too long, and simple tasks depend on too much manual follow-up.\n\nWe build business applications around your real workflow. That can mean an internal dashboard, client portal, inventory system, invoice tracker, operations tool, CRM, reporting system, or a custom application built for a process that off-the-shelf software does not handle well.\n\nThe work starts with understanding how your team operates today. From there, we design a system that removes repeated work, improves visibility, and gives the right people access to the right information without making the software harder than the problem.",
    iconName: "LayoutDashboard",
    deliverables: [
      "Internal dashboards and admin panels",
      "Client, staff, and vendor portals",
      "Inventory, billing, booking, and operations systems",
      "Role-based access and secure data handling",
      "Reports, workflow automation, and integrations",
    ],
  },
  {
    slug: "it-consulting",
    title: "IT Consulting",
    summary:
      "Clear technical guidance before you spend money on the wrong system, tool, or build.",
    description:
      "A poor technology decision can be expensive long after the invoice is paid. The wrong platform, weak architecture, unclear requirements, or a rushed vendor choice can create months of avoidable problems.\n\nOur IT consulting service helps you make better decisions before you commit. We review your current systems, understand your business goals, compare realistic options, and explain the trade-offs in plain language. If a simple tool is enough, we will say so. If a custom system is the better long-term choice, we will explain why and what it should include.\n\nThis service is useful when you are planning a new project, replacing an old system, choosing software for your team, reviewing a vendor proposal, or trying to understand why your current tools are not working well.",
    iconName: "MessageSquare",
    deliverables: [
      "Technology audits and system reviews",
      "Software selection and vendor comparison",
      "Project scoping and technical planning",
      "Architecture, security, and performance recommendations",
      "Migration and implementation roadmaps",
    ],
  },
  {
    slug: "maintenance-support",
    title: "Maintenance & Support",
    summary:
      "Ongoing care for websites and applications that need to stay secure, updated, and online.",
    description:
      "Launching a website or application is not the end of the work. Software needs updates, monitoring, small improvements, security checks, backups, and someone responsible when something stops working.\n\nWe provide maintenance and support for websites, business applications, and internal tools that your company depends on. That includes routine updates, bug fixes, performance checks, security improvements, uptime monitoring, and practical support when your team needs help.\n\nThis is for businesses that want their systems looked after properly instead of waiting until a small issue becomes an urgent problem.",
    iconName: "Wrench",
    deliverables: [
      "Website and application updates",
      "Bug fixes, small improvements, and technical support",
      "Security checks, backups, and monitoring",
      "Performance reviews and reliability improvements",
      "Priority support for active clients",
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return services.find((service) => service.slug === slug);
}
