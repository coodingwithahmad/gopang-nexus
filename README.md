# GOPANG IT SOLUTION — GoPang Nexus

A professional, high-performance marketing website and secure client portal for GOPANG IT SOLUTION. Built with a focus on clean design, strict security, and excellent user experience.

## 🚀 Features

### Marketing Website
* **Modern Design:** Typography-first, clean interface using a custom OKLCH color palette (dark slate & blue accent). 
* **Static Generation:** High-performance static routing for Services and Portfolio projects.
* **Consultation Flow:** Dynamic consultation request forms with integrated email notifications via Resend.
* **Responsive:** Fully mobile-optimized layouts without relying on generic, heavy illustrations.

### Secure Client Portal (GoPang Nexus)
* **Invite-Only Access:** Clients can only access the portal via admin invitations to ensure security.
* **Role-Based Access Control (RBAC):** Supabase Row Level Security (RLS) ensures clients can only see their own projects, tickets, and invoices.
* **Dashboard Overview:** Real-time visibility into active projects, outstanding balances, and open support tickets.
* **Support Ticketing System:** Threaded messaging for support requests. Internal team notes are hidden from clients at the database level.
* **Invoices:** Clean financial tracking with itemized invoices.
* **File Management:** Secure, signed-URL based file downloads to prevent unauthorized access to project assets.

## 🛠️ Tech Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **Frontend:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
* **Backend & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)
* **Form Validation:** React Hook Form + Zod
* **Emails:** [Resend](https://resend.com/)

## 💻 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/gopang-nexus.git
cd gopang-nexus
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory by copying the example file:
```bash
cp .env.local.example .env.local
```
Fill in your Supabase URL, Anon Key, Service Role Key, and Resend API key.

### 4. Database Setup (Supabase)
Run the SQL scripts located in the `supabase/` directory in your Supabase SQL Editor in the following order:
1. `supabase/migrations/001_schema.sql` (Creates tables)
2. `supabase/migrations/002_rls.sql` (Applies security policies)
3. `supabase/seed.sql` (Inserts initial portfolio and service data)

### 5. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🛡️ Security Note
This project utilizes strict Supabase Row Level Security (RLS). Server actions rely on `supabase.auth.getUser()` to securely verify identities on the backend before executing any database writes. 

## 📄 License
All rights reserved. GOPANG IT SOLUTION.
