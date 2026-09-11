/**
 * Static portfolio project data.
 * When connected to Supabase, replace with database queries.
 */

export interface PortfolioItem {
  slug: string;
  title: string;
  client: string;
  summary: string;
  description: string;
  tags: string[];
  challenge: string;
  solution: string;
}

export const portfolioProjects: PortfolioItem[] = [
  {
    slug: "inventory-management-system",
    title: "Inventory Management System",
    client: "Distribution business",
    summary:
      "A stock management platform that replaced shared spreadsheets and gave the team a single source of truth.",
    description:
      "The client was managing stock across multiple locations through a shared spreadsheet. Updates were delayed, mistakes were hard to trace, and managers did not have a reliable view of what was available. We built a web-based inventory system with stock movements, location tracking, user roles, and practical reporting.",
    tags: ["Inventory", "Operations", "Reporting"],
    challenge:
      "The team needed accurate stock information without forcing staff into a complicated system. The existing process was familiar, but it created errors and wasted time.",
    solution:
      "We designed a focused inventory application with role-based access, movement history, location visibility, and reports that management could review without asking staff to prepare manual updates.",
  },
  {
    slug: "client-billing-portal",
    title: "Client Billing Portal",
    client: "Professional services firm",
    summary:
      "A secure portal where clients can view invoices, project status, shared documents, and account updates.",
    description:
      "The business was spending too much time sending invoice updates, answering status questions, and sharing documents through email threads. We built a client portal that gives each client a private, organized view of their account information.",
    tags: ["Client Portal", "Invoices", "Secure Access"],
    challenge:
      "The system needed to be simple enough for non-technical clients while keeping each client's information isolated and secure.",
    solution:
      "We built a clean portal with account-based access, invoice visibility, project updates, document areas, and a structure that staff can manage without relying on scattered email communication.",
  },
  {
    slug: "field-service-scheduling",
    title: "Field Service Scheduling Tool",
    client: "Facilities company",
    summary:
      "A scheduling and dispatch system for assigning field work, tracking job status, and reducing missed updates.",
    description:
      "The client coordinated field technicians through phone calls, messages, and a whiteboard. Jobs were easy to miss, status updates were inconsistent, and office staff had limited visibility once technicians left for the day. We built a scheduling tool with job assignment, technician views, and status tracking.",
    tags: ["Scheduling", "Field Teams", "Status Tracking"],
    challenge:
      "The office needed better control over scheduling without making the mobile experience difficult for technicians in the field.",
    solution:
      "We created a web-based scheduling system with clear job views, technician assignments, status updates, and a dispatch view that helps the office team understand what is happening in real time.",
  },
];

export function getProjectBySlug(slug: string): PortfolioItem | undefined {
  return portfolioProjects.find((project) => project.slug === slug);
}
