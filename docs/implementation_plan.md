# Comprehensive Admin Panel Implementation Plan

This document outlines the step-by-step strategy for building the comprehensive Admin Panel for GOPANG IT SOLUTION, as requested.

## User Review Required
> [!IMPORTANT]
> The requested Admin Panel represents a massive scope (essentially a full-featured CMS, CRM, and Helpdesk combined). To ensure quality and stability, I propose splitting the work into **four distinct phases**. Please review this plan and let me know if you approve this phased approach, or if you prefer I prioritize a specific phase first.

## Open Questions
> [!WARNING]
> 1. **Rich Text Editor**: Do you have a preferred Rich Text Editor library (e.g., TipTap, React Quill, or simple Markdown) for blog posts and descriptions?
> 2. **File Storage**: The prompt mentions "Supabase Storage". Does your current Supabase project already have a storage bucket named `media` created, or should I write the SQL to create it?
> 3. **Icons**: For the `services` table, you mentioned "Lucide icon library". Do you want a predefined dropdown of 10-15 common Lucide icons, or a full search input?

## Proposed Implementation Phases

### Phase 1: Database Expansion & Foundation
Before building the UI, we must ensure the backend fully supports all features.
- [NEW] `supabase/migrations/004_admin_extensions.sql`
  - Create the `faqs` table.
  - Create the `settings` table (for company info, hero text, etc.).
  - Create the `audit_logs` table for admin tracking.
  - Setup Storage Buckets (`media`) and appropriate RLS policies for file uploads.

### Phase 2: CMS - Public Content Management
Building the interfaces to manage what visitors see.
- **Portfolio Projects** (`/dashboard/admin/projects`): Add rich-text edit views, image uploading, and drag-and-drop sort ordering.
- **Services** (`/dashboard/admin/services`): Build the CRUD interface for services, including icon selection.
- **Blog & Insights** (`/dashboard/admin/blog`): Create the article editor with slug generation, publish scheduling, and image handling.
- **FAQs** (`/dashboard/admin/faqs`): Build the Q&A manager with category grouping.

### Phase 3: CRM & Business Operations
Building the interfaces to manage client relationships and revenue.
- **Internal Projects** (`/dashboard/admin/internal-projects`): Manage scoped/active client projects, timelines, and statuses.
- **Invoices** (`/dashboard/admin/invoices`): Create invoice generator, line-item management, and PDF generation logic.
- **Client Manager** (`/dashboard/admin/clients`): Build the client overview directory (viewing associated projects and stats).

### Phase 4: Settings, Dashboard Analytics & Polish
Tying the system together with overarching controls.
- **Analytics Dashboard**: Build the charts (revenue, active projects, new clients) on `/dashboard/admin`.
- **Global Settings** (`/dashboard/admin/settings`): Form for managing homepage hero text, footer links, and SEO metadata.
- **Media Library**: A dedicated page to view all uploaded Supabase Storage files.

## Verification Plan

### Automated Tests
- TypeScript compilation checks to ensure all Supabase types align with the new tables.
- `npm run build` verification for Next.js App Router stability.

### Manual Verification
- Testing RLS: Attempting to access admin routes with a standard Client account to ensure a hard block.
- Creating a test Blog Post, uploading an image, and verifying it appears perfectly on the public website.
