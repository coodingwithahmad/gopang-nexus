/**
 * Static portfolio project data.
 * When connected to Supabase, replace with database queries.
 */

export interface PortfolioItem {
  slug: string;
  title: string;
  client: string; // Generic client description, no real company names
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
    client: "Regional distribution company",
    summary:
      "A web-based inventory system replacing a spreadsheet workflow used by a team of 12.",
    description:
      "The client was managing stock across three warehouse locations using a shared Excel file. This created version conflicts, no audit trail, and frequent stock discrepancies. We built a web application that gave every team member a real-time view of stock levels, location, and movement history.",
    tags: ["Web Application", "React", "PostgreSQL"],
    challenge:
      "The existing spreadsheet approach meant stock data was always slightly out of date and errors were hard to trace. The team needed something fast to learn and work reliably on low-spec tablets.",
    solution:
      "A focused web application with role-based access, barcode scanning support, low-bandwidth optimization, and a daily PDF report generation for management.",
  },
  {
    slug: "client-billing-portal",
    title: "Client Billing Portal",
    client: "Professional services firm",
    summary:
      "A self-service portal giving clients access to their invoices, project status, and documents.",
    description:
      "The client's team was spending significant time each month sending invoices manually and answering status questions by email. We built a client portal where each client logs in to see their active projects, download invoices, and access shared documents.",
    tags: ["Client Portal", "Next.js", "Supabase"],
    challenge:
      "Each client needed a completely isolated view of their own data. Security and simplicity were both requirements — the client base ranged from tech-comfortable to very non-technical.",
    solution:
      "Row-level security in PostgreSQL ensures complete data isolation. The interface was kept intentionally simple with no unnecessary features.",
  },
  {
    slug: "field-service-scheduling",
    title: "Field Service Scheduling Tool",
    client: "Facilities management company",
    summary:
      "A scheduling and dispatch tool for coordinating field technicians across job sites.",
    description:
      "The client coordinated 20+ field technicians using phone calls and a whiteboard. Missed jobs, double-bookings, and no visibility into job status were regular problems. We built a web-based scheduling tool with a calendar view, job assignment, status updates, and a technician mobile view.",
    tags: ["Scheduling", "Mobile Web", "Real-time"],
    challenge:
      "Technicians needed access in the field on mobile devices, often with poor connectivity. The office team needed real-time job status without calling technicians.",
    solution:
      "Offline-capable mobile web interface for technicians, real-time dispatch view for coordinators, and automated SMS notifications on job assignment.",
  },
];

export function getProjectBySlug(slug: string): PortfolioItem | undefined {
  return portfolioProjects.find((p) => p.slug === slug);
}
