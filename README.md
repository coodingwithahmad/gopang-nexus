# GOPANG IT SOLUTION - GoPang Nexus

GoPang Nexus is a professional business website and secure client portal for GOPANG IT SOLUTION. It combines a public marketing website with an authenticated dashboard for managing clients, projects, invoices, services, blog posts, FAQs, and support chats.

The project is built for a real service business: public visitors can learn about the company and contact the team, while signed-in clients and admins get a private account experience powered by Supabase.

## What This Project Includes

### Public Website

- Home page for GOPANG IT SOLUTION
- Services pages
- Portfolio/project pages
- Blog and insights pages
- FAQ page
- Contact and consultation forms
- Light and dark theme support
- Responsive layout for desktop and mobile

### Authentication

- Email and password login
- Register page
- Forgot password and reset password flow
- Persistent login sessions
- Account/profile dropdown after login
- Role-based redirects for admins and clients

### Admin Dashboard

- Admin overview dashboard
- Client management
- Internal project management
- Public project/portfolio management
- Service management
- Blog and insights management
- FAQ management
- Invoice management
- Chat/support area
- Admin-only route protection

### Client Account Area

- Client profile/account page
- Password update
- Theme toggle
- Client-safe dashboard access
- Account menu available from the public website after login

### Security

- Supabase Auth for user authentication
- Supabase Row Level Security policies
- Server-side auth checks with `supabase.auth.getUser()`
- Admin-only server actions
- Protected dashboard routes
- Environment variables kept outside Git

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase Auth and PostgreSQL
- Supabase Row Level Security
- Resend for contact/consultation emails
- React Hook Form
- Zod
- Lucide React icons

## Project Structure

```text
gopang-nexus/
  docs/                    Project notes and walkthrough files
  public/                  Static assets
  src/
    app/                   Next.js app routes
      (auth)/              Login, register, forgot/reset password
      (marketing)/         Public website routes
      api/                 API route handlers
      dashboard/           Admin and client dashboard routes
    components/            Reusable UI, forms, dashboard, marketing components
    config/                Site and navigation config
    lib/                   Actions, Supabase clients, utilities, data
    types/                 TypeScript database types
  supabase/
    migrations/            Database schema and RLS SQL
    seed.sql               Demo services and portfolio data
    fix_public_content_rls.sql
  middleware.ts            Auth/session middleware
  next.config.ts           Next.js config
  package.json             Scripts and dependencies
```

## Requirements

Before running the project, install:

- Node.js 20 or newer
- npm
- A Supabase project
- Optional: a Resend account if you want contact forms to send emails

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/coodingwithahmad/gopang-nexus.git
cd gopang-nexus
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create the Environment File

Create a file named `.env.local` in the project root.

Paste this template into `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

RESEND_API_KEY=your-resend-api-key
CONTACT_EMAIL_TO=hello@gopangit.com
CONTACT_EMAIL_FROM=noreply@gopangit.com
```

### 4. Where to Find Supabase Keys

Open your Supabase project, then go to:

```text
Project Settings -> API
```

Copy this value:

```text
Project URL
```

Paste it into:

```env
NEXT_PUBLIC_SUPABASE_URL=
```

Then copy:

```text
anon public key
```

Paste it into:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Example format:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Do not paste the service role key into client-side code. If you add a service role key later, keep it server-only and never expose it in the browser.

## Supabase Database Setup

Open Supabase, select your project, then go to:

```text
SQL Editor -> New query
```

Run these SQL files in this order:

```text
1. supabase/migrations/001_schema.sql
2. supabase/migrations/002_rls.sql
3. supabase/migrations/003_chat_realtime.sql
4. supabase/migrations/004_admin_extensions.sql
5. supabase/seed.sql
```

Copy the full contents of each file, paste it into the Supabase SQL editor, and click `Run`.

If public services, projects, or blog pages show database/RLS errors, also run:

```text
supabase/fix_public_content_rls.sql
```

That script is safe to run again if the public content policies need to be repaired.

## Create an Admin Account

1. Start the app locally.
2. Go to:

```text
http://localhost:3000/register
```

3. Create your user account.
4. Open Supabase.
5. Go to:

```text
Table Editor -> profiles
```

6. Find your user row.
7. Change the `role` column from:

```text
client
```

to:

```text
admin
```

You can also run this SQL in Supabase SQL Editor:

```sql
update public.profiles
set role = 'admin'
where email = 'your-email@example.com';
```

After that, sign in again. Admin users are redirected to:

```text
/dashboard/admin
```

Client users are redirected to the public website and can open their account from the profile icon.

## Run the Project Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Useful routes:

```text
/login
/register
/dashboard
/dashboard/admin
/dashboard/settings
/services
/projects
/insights
/contact
/consultation
```

## Email Setup with Resend

The contact and consultation forms use Resend.

In Resend:

1. Create an account.
2. Add and verify your domain.
3. Create an API key.
4. Put the API key in `.env.local`:

```env
RESEND_API_KEY=re_your_key_here
```

Set the recipient and sender:

```env
CONTACT_EMAIL_TO=hello@gopangit.com
CONTACT_EMAIL_FROM=noreply@gopangit.com
```

For production, `CONTACT_EMAIL_FROM` should use a verified Resend domain.

## Deploy to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial project setup"
git push origin main
```

### 2. Import in Vercel

1. Open Vercel.
2. Click `Add New Project`.
3. Import the GitHub repository.
4. Keep the framework as `Next.js`.
5. Add the same environment variables from `.env.local`.

For production, use your real site URL:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
RESEND_API_KEY=your-resend-key
CONTACT_EMAIL_TO=hello@gopangit.com
CONTACT_EMAIL_FROM=noreply@your-domain.com
```

If you are using the default Vercel domain, `NEXT_PUBLIC_SITE_URL` can be:

```env
NEXT_PUBLIC_SITE_URL=https://gopang-nexus.vercel.app
```

### 3. Update Supabase Auth URLs

In Supabase, go to:

```text
Authentication -> URL Configuration
```

Set:

```text
Site URL:
https://your-domain.com
```

Add redirect URLs:

```text
http://localhost:3000/**
https://your-domain.com/**
https://your-vercel-project.vercel.app/**
```

For this project, the auth callback route is:

```text
/api/auth/callback
```

So these should be allowed:

```text
http://localhost:3000/api/auth/callback
https://your-domain.com/api/auth/callback
https://your-vercel-project.vercel.app/api/auth/callback
```

## Common Problems

### The website says Supabase variables are missing

Check `.env.local` and make sure these exist:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Restart the dev server after changing `.env.local`.

### Login works but admin panel does not open

Your user is probably still a client. In Supabase, update the `profiles.role` value to `admin`.

### Services, projects, or blog pages show an error

Run this script in Supabase SQL Editor:

```text
supabase/fix_public_content_rls.sql
```

Then refresh the website.

### Contact form does not send email

Check:

```env
RESEND_API_KEY=
CONTACT_EMAIL_TO=
CONTACT_EMAIL_FROM=
```

Also make sure the sender email domain is verified inside Resend.

### Changes do not appear on Vercel

Check:

- The latest commit was pushed to GitHub.
- Vercel deployment finished successfully.
- Environment variables are added in Vercel.
- Supabase Auth URLs include the deployed domain.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Notes for Developers

- Keep secrets out of Git. `.env.local` is ignored by `.gitignore`.
- Use server actions for database writes.
- Use `supabase.auth.getUser()` for server-side auth checks.
- Keep admin-only logic on the server, not only in the UI.
- Run `npm run lint` and `npm run build` before deploying important changes.

## License

All rights reserved. GOPANG IT SOLUTION.
