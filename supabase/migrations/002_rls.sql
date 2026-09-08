-- ============================================================
-- Migration 002: Row Level Security policies
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles         enable row level security;
alter table public.projects          enable row level security;
alter table public.project_milestones enable row level security;
alter table public.project_updates   enable row level security;
alter table public.project_files     enable row level security;
alter table public.tickets           enable row level security;
alter table public.ticket_messages   enable row level security;
alter table public.invoices          enable row level security;
alter table public.invoice_items     enable row level security;
alter table public.notifications     enable row level security;
alter table public.services          enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.blog_posts        enable row level security;

-- ============================================================
-- Helper: check if the current user is an admin
-- Using a stable function avoids repeated subqueries in policies
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- PROFILES
-- ============================================================
-- Users can read and update their own profile
create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    -- Clients cannot change their own role — only admins can
    and (role = (select role from public.profiles where id = auth.uid()))
  );

create policy "profiles_admin_all"
  on public.profiles for all
  using (public.is_admin());

-- ============================================================
-- PROJECTS
-- ============================================================
create policy "projects_client_select"
  on public.projects for select
  using (client_id = auth.uid() or public.is_admin());

create policy "projects_admin_all"
  on public.projects for insert update delete
  using (public.is_admin());

-- ============================================================
-- PROJECT MILESTONES
-- Clients can view milestones for their own projects
-- ============================================================
create policy "milestones_client_select"
  on public.project_milestones for select
  using (
    exists (
      select 1 from public.projects
      where id = project_id and client_id = auth.uid()
    )
    or public.is_admin()
  );

create policy "milestones_admin_all"
  on public.project_milestones for insert update delete
  using (public.is_admin());

-- ============================================================
-- PROJECT UPDATES
-- ============================================================
create policy "updates_client_select"
  on public.project_updates for select
  using (
    exists (
      select 1 from public.projects
      where id = project_id and client_id = auth.uid()
    )
    or public.is_admin()
  );

create policy "updates_admin_all"
  on public.project_updates for insert update delete
  using (public.is_admin());

-- ============================================================
-- PROJECT FILES
-- ============================================================
create policy "files_client_select"
  on public.project_files for select
  using (
    exists (
      select 1 from public.projects
      where id = project_id and client_id = auth.uid()
    )
    or public.is_admin()
  );

create policy "files_admin_all"
  on public.project_files for insert update delete
  using (public.is_admin());

-- ============================================================
-- TICKETS
-- ============================================================
create policy "tickets_client_select"
  on public.tickets for select
  using (client_id = auth.uid() or public.is_admin());

create policy "tickets_client_insert"
  on public.tickets for insert
  with check (client_id = auth.uid());

create policy "tickets_admin_all"
  on public.tickets for update delete
  using (public.is_admin());

-- ============================================================
-- TICKET MESSAGES
-- Clients can see non-internal messages on their own tickets
-- ============================================================
create policy "messages_client_select"
  on public.ticket_messages for select
  using (
    (
      exists (
        select 1 from public.tickets
        where id = ticket_id and client_id = auth.uid()
      )
      and is_internal = false
    )
    or public.is_admin()
  );

create policy "messages_client_insert"
  on public.ticket_messages for insert
  with check (
    author_id = auth.uid()
    and is_internal = false
    and exists (
      select 1 from public.tickets
      where id = ticket_id and client_id = auth.uid()
    )
  );

create policy "messages_admin_all"
  on public.ticket_messages for insert update delete
  using (public.is_admin());

-- ============================================================
-- INVOICES
-- ============================================================
create policy "invoices_client_select"
  on public.invoices for select
  using (client_id = auth.uid() or public.is_admin());

create policy "invoices_admin_all"
  on public.invoices for insert update delete
  using (public.is_admin());

-- ============================================================
-- INVOICE ITEMS
-- Accessible if the parent invoice is accessible
-- ============================================================
create policy "invoice_items_client_select"
  on public.invoice_items for select
  using (
    exists (
      select 1 from public.invoices
      where id = invoice_id and (client_id = auth.uid() or public.is_admin())
    )
  );

create policy "invoice_items_admin_all"
  on public.invoice_items for insert update delete
  using (public.is_admin());

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create policy "notifications_own"
  on public.notifications for select update
  using (user_id = auth.uid() or public.is_admin());

create policy "notifications_admin_insert"
  on public.notifications for insert
  using (public.is_admin());

-- ============================================================
-- PUBLIC CONTENT (services, portfolio, blog)
-- Anyone can read published content; only admins can write
-- ============================================================
create policy "services_public_read"
  on public.services for select
  using (published = true or public.is_admin());

create policy "services_admin_write"
  on public.services for insert update delete
  using (public.is_admin());

create policy "portfolio_public_read"
  on public.portfolio_projects for select
  using (published = true or public.is_admin());

create policy "portfolio_admin_write"
  on public.portfolio_projects for insert update delete
  using (public.is_admin());

create policy "blog_public_read"
  on public.blog_posts for select
  using (published = true or public.is_admin());

create policy "blog_admin_write"
  on public.blog_posts for insert update delete
  using (public.is_admin());
