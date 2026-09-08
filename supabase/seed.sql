-- ============================================================
-- Seed data: Realistic demo data for development
-- All client names are fictional. Clearly marked as demo.
-- ============================================================

-- NOTE: This seed requires real auth users to exist first.
-- Run this after creating accounts in Supabase Auth dashboard.
-- Replace the UUIDs below with actual auth.users UUIDs.

-- Demo admin user (create in Supabase Auth first)
-- INSERT INTO public.profiles (id, email, full_name, role)
-- VALUES ('REPLACE_WITH_ADMIN_UUID', 'admin@gopangit.com', 'GOPANG Admin', 'admin');

-- Demo client user (create in Supabase Auth first)
-- INSERT INTO public.profiles (id, email, full_name, company)
-- VALUES ('REPLACE_WITH_CLIENT_UUID', 'client@meridian-logistics.example', 'Sarah Okonkwo', 'Meridian Logistics Ltd');

-- ============================================================
-- Services (static — used if switching from file-based to DB)
-- ============================================================
insert into public.services (slug, title, summary, description, icon_name, sort_order) values
  ('web-development', 'Web Development',
   'Websites and web applications built to work reliably and scale with your business.',
   'We design and build websites and web applications that serve a clear purpose. Whether you need a company website, a booking platform, or a customer-facing web app, we build it with clean code, good performance, and a structure your team can maintain.',
   'Globe', 1),
  ('business-applications', 'Business Applications',
   'Internal tools and business software designed around how your team actually works.',
   'Generic software rarely fits the way your business operates. We build internal tools, dashboards, and business applications that match your actual workflow.',
   'LayoutDashboard', 2),
  ('it-consulting', 'IT Consulting',
   'Practical technology advice for businesses making decisions about software and systems.',
   'Technology decisions made poorly are expensive to fix. We help businesses evaluate their options, plan their systems, and avoid common mistakes.',
   'MessageSquare', 3),
  ('maintenance-support', 'Maintenance & Support',
   'Ongoing technical support for websites and applications your business depends on.',
   'Software needs maintenance. We offer ongoing support agreements for websites and applications — keeping them updated, monitored, secure, and running.',
   'Wrench', 4)
on conflict (slug) do nothing;

-- ============================================================
-- Portfolio projects
-- ============================================================
insert into public.portfolio_projects (slug, title, summary, description, tags, sort_order) values
  ('inventory-management-system',
   'Inventory Management System',
   'A web-based inventory system replacing a spreadsheet workflow used by a team of 12.',
   'The client was managing stock across three warehouse locations using a shared Excel file. We built a web application that gave every team member a real-time view of stock levels, location, and movement history.',
   array['Web Application', 'React', 'PostgreSQL'], 1),
  ('client-billing-portal',
   'Client Billing Portal',
   'A self-service portal giving clients access to their invoices, project status, and documents.',
   'The client''s team was spending significant time each month sending invoices manually. We built a client portal where each client logs in to see their active projects, download invoices, and access shared documents.',
   array['Client Portal', 'Next.js', 'Supabase'], 2),
  ('field-service-scheduling',
   'Field Service Scheduling Tool',
   'A scheduling and dispatch tool for coordinating field technicians across job sites.',
   'The client coordinated 20+ field technicians using phone calls and a whiteboard. We built a web-based scheduling tool with a calendar view, job assignment, and status updates.',
   array['Scheduling', 'Mobile Web', 'Real-time'], 3)
on conflict (slug) do nothing;
