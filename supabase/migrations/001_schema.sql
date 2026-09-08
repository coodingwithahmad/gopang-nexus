-- ============================================================
-- Migration 001: Core schema for GOPANG IT SOLUTION
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- Extends auth.users — created automatically on signup via trigger
-- ============================================================
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  full_name   text,
  company     text,
  phone       text,
  role        text not null default 'client' check (role in ('client', 'admin')),
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'Public profile data extending auth.users. Passwords are handled exclusively by Supabase Auth.';

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- PROJECTS
-- ============================================================
create table public.projects (
  id           uuid primary key default uuid_generate_v4(),
  client_id    uuid not null references public.profiles(id) on delete cascade,
  title        text not null,
  description  text,
  status       text not null default 'scoping'
                 check (status in ('scoping', 'active', 'review', 'completed', 'paused')),
  start_date   date,
  due_date     date,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index projects_client_id_idx on public.projects(client_id);
create index projects_status_idx on public.projects(status);

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ============================================================
-- PROJECT MILESTONES
-- ============================================================
create table public.project_milestones (
  id          uuid primary key default uuid_generate_v4(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  title       text not null,
  description text,
  due_date    date,
  completed   boolean not null default false,
  sort_order  integer not null default 0
);

create index project_milestones_project_id_idx on public.project_milestones(project_id);

-- ============================================================
-- PROJECT UPDATES
-- ============================================================
create table public.project_updates (
  id          uuid primary key default uuid_generate_v4(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  author_id   uuid not null references public.profiles(id),
  content     text not null check (char_length(content) between 1 and 5000),
  created_at  timestamptz not null default now()
);

create index project_updates_project_id_idx on public.project_updates(project_id);

-- ============================================================
-- PROJECT FILES
-- ============================================================
create table public.project_files (
  id           uuid primary key default uuid_generate_v4(),
  project_id   uuid not null references public.projects(id) on delete cascade,
  uploaded_by  uuid not null references public.profiles(id),
  filename     text not null check (char_length(filename) between 1 and 255),
  storage_path text not null,
  file_size    bigint not null check (file_size > 0 and file_size <= 52428800), -- max 50MB
  mime_type    text not null,
  created_at   timestamptz not null default now()
);

create index project_files_project_id_idx on public.project_files(project_id);

-- ============================================================
-- TICKETS
-- ============================================================
create table public.tickets (
  id          uuid primary key default uuid_generate_v4(),
  client_id   uuid not null references public.profiles(id) on delete cascade,
  project_id  uuid references public.projects(id) on delete set null,
  subject     text not null check (char_length(subject) between 5 and 200),
  status      text not null default 'open'
                check (status in ('open', 'in_progress', 'resolved', 'closed')),
  priority    text not null default 'normal'
                check (priority in ('low', 'normal', 'high', 'urgent')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index tickets_client_id_idx on public.tickets(client_id);
create index tickets_status_idx on public.tickets(status);

create trigger tickets_updated_at
  before update on public.tickets
  for each row execute function public.set_updated_at();

-- ============================================================
-- TICKET MESSAGES
-- ============================================================
create table public.ticket_messages (
  id          uuid primary key default uuid_generate_v4(),
  ticket_id   uuid not null references public.tickets(id) on delete cascade,
  author_id   uuid not null references public.profiles(id),
  content     text not null check (char_length(content) between 1 and 5000),
  is_internal boolean not null default false,
  created_at  timestamptz not null default now()
);

create index ticket_messages_ticket_id_idx on public.ticket_messages(ticket_id);

-- ============================================================
-- INVOICES
-- ============================================================
create table public.invoices (
  id          uuid primary key default uuid_generate_v4(),
  client_id   uuid not null references public.profiles(id) on delete cascade,
  project_id  uuid references public.projects(id) on delete set null,
  invoice_no  text not null unique,
  status      text not null default 'draft'
                check (status in ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  amount      numeric(10, 2) not null check (amount >= 0),
  currency    text not null default 'USD',
  issued_date date not null,
  due_date    date not null,
  paid_date   date,
  notes       text check (char_length(notes) <= 2000),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index invoices_client_id_idx on public.invoices(client_id);
create index invoices_status_idx on public.invoices(status);

create trigger invoices_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();

-- ============================================================
-- INVOICE ITEMS
-- ============================================================
create table public.invoice_items (
  id          uuid primary key default uuid_generate_v4(),
  invoice_id  uuid not null references public.invoices(id) on delete cascade,
  description text not null check (char_length(description) between 1 and 500),
  quantity    numeric(10, 2) not null check (quantity > 0),
  unit_price  numeric(10, 2) not null check (unit_price >= 0),
  amount      numeric(10, 2) generated always as (quantity * unit_price) stored
);

create index invoice_items_invoice_id_idx on public.invoice_items(invoice_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table public.notifications (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  type       text not null,
  title      text not null check (char_length(title) between 1 and 200),
  body       text not null check (char_length(body) between 1 and 1000),
  read       boolean not null default false,
  link       text,
  created_at timestamptz not null default now()
);

create index notifications_user_id_unread_idx
  on public.notifications(user_id) where read = false;

-- ============================================================
-- PUBLIC CONTENT TABLES (marketing site)
-- ============================================================
create table public.services (
  id          uuid primary key default uuid_generate_v4(),
  slug        text not null unique,
  title       text not null,
  summary     text not null,
  description text not null,
  icon_name   text not null,
  sort_order  integer not null default 0,
  published   boolean not null default true
);

create table public.portfolio_projects (
  id          uuid primary key default uuid_generate_v4(),
  slug        text not null unique,
  title       text not null,
  summary     text not null,
  description text not null,
  tags        text[] not null default '{}',
  image_path  text,
  sort_order  integer not null default 0,
  published   boolean not null default true
);

create table public.blog_posts (
  id           uuid primary key default uuid_generate_v4(),
  slug         text not null unique,
  title        text not null,
  excerpt      text not null,
  content      text not null,
  author_id    uuid not null references public.profiles(id),
  published    boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index blog_posts_published_idx
  on public.blog_posts(published_at desc) where published = true;

create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();
