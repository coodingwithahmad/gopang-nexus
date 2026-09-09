-- ============================================================
-- Fix public content tables and RLS for services / portfolio / blog
-- Safe to run multiple times.
-- Paste this entire script into Supabase SQL Editor.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- Ensure helper function exists
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
-- Ensure public tables exist
-- ============================================================
create table if not exists public.services (
  id          uuid primary key default uuid_generate_v4(),
  slug        text not null unique,
  title       text not null,
  summary     text not null,
  description text not null,
  icon_name   text not null,
  sort_order  integer not null default 0,
  published   boolean not null default true
);

create table if not exists public.portfolio_projects (
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

create table if not exists public.blog_posts (
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

create index if not exists blog_posts_published_idx
  on public.blog_posts(published_at desc) where published = true;

-- ============================================================
-- Ensure trigger exists for blog_posts.updated_at
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blog_posts_updated_at on public.blog_posts;
create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ============================================================
-- Enable RLS on public content tables
-- ============================================================
alter table public.services enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.blog_posts enable row level security;

-- ============================================================
-- Drop old policies to avoid conflicts
-- ============================================================
drop policy if exists "services_public_read" on public.services;
drop policy if exists "services_admin_write" on public.services;
drop policy if exists "portfolio_public_read" on public.portfolio_projects;
drop policy if exists "portfolio_admin_write" on public.portfolio_projects;
drop policy if exists "blog_public_read" on public.blog_posts;
drop policy if exists "blog_admin_write" on public.blog_posts;

-- ============================================================
-- Create the correct RLS policies
-- Public content should be readable; admin can manage
-- ============================================================
create policy "services_public_read"
on public.services
for select
using (published = true or public.is_admin());

create policy "services_admin_write"
on public.services
for all
using (public.is_admin())
with check (public.is_admin());

create policy "portfolio_public_read"
on public.portfolio_projects
for select
using (published = true or public.is_admin());

create policy "portfolio_admin_write"
on public.portfolio_projects
for all
using (public.is_admin())
with check (public.is_admin());

create policy "blog_public_read"
on public.blog_posts
for select
using (published = true or public.is_admin());

create policy "blog_admin_write"
on public.blog_posts
for all
using (public.is_admin())
with check (public.is_admin());

-- ============================================================
-- Optional: seed one test row if the tables are empty
-- This helps verify the admin pages load
-- ============================================================
insert into public.services (slug, title, summary, description, icon_name, sort_order, published)
select 'sample-service', 'Sample Service', 'Sample summary', 'Sample description', 'briefcase', 1, true
where not exists (select 1 from public.services limit 1);

insert into public.portfolio_projects (slug, title, summary, description, tags, image_path, sort_order, published)
select 'sample-project', 'Sample Project', 'Sample summary', 'Sample description', array['web','design'], null, 1, true
where not exists (select 1 from public.portfolio_projects limit 1);

insert into public.blog_posts (slug, title, excerpt, content, author_id, published, published_at)
select 'sample-insight', 'Sample Insight', 'Sample excerpt', 'Sample content', p.id, true, now()
from public.profiles p
where not exists (select 1 from public.blog_posts limit 1)
limit 1;

-- ============================================================
-- Quick verification
-- ============================================================
select 'services' as table_name, count(*) as rows from public.services
union all
select 'portfolio_projects', count(*) from public.portfolio_projects
union all
select 'blog_posts', count(*) from public.blog_posts;
