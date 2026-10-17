-- KLAKZWEB Supabase starter schema. Run in Supabase SQL Editor after reviewing.
-- Enable email auth in Supabase Auth settings. Do not expose service_role keys in the browser.
create extension if not exists pgcrypto;
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (char_length(username) between 2 and 24),
  bio text not null default '' check (char_length(bio) <= 180),
  created_at timestamptz not null default now()
);
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 70),
  game text not null check (char_length(game) between 1 and 40),
  category text not null check (category in ('Mod','Araç','Rehber')) ,
  description text not null check (char_length(description) <= 220),
  link text, code text not null default '',
  created_at timestamptz not null default now(), views integer not null default 0 check (views >= 0),
  approved boolean not null default false
);
create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id uuid not null references public.resources(id) on delete cascade,
  created_at timestamptz not null default now(), primary key(user_id,resource_id)
);
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id uuid not null references public.resources(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  body text not null default '' check (char_length(body) <= 300),
  created_at timestamptz not null default now(), unique(user_id,resource_id)
);
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null, body text not null, read_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','moderator'))
);
-- Turn on RLS for every table.
alter table public.profiles enable row level security;
alter table public.resources enable row level security;
alter table public.favorites enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.user_roles enable row level security;
-- Profiles are publicly readable; each user edits only their own.
create policy "profiles readable" on public.profiles for select using (true);
create policy "profile insert own" on public.profiles for insert with check (auth.uid() = id);
create policy "profile update own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
-- Approved resources are public. Authors can view their own pending submissions.
create policy "approved resources public" on public.resources for select using (approved = true or auth.uid() = user_id);
create policy "users create own resources" on public.resources for insert with check (auth.uid() = user_id);
create policy "authors update own resources" on public.resources for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "authors delete own resources" on public.resources for delete using (auth.uid() = user_id);
-- A user can only manage their own favorites, reviews, and notifications.
create policy "favorites own rows" on public.favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reviews public read" on public.reviews for select using (true);
create policy "reviews own insert" on public.reviews for insert with check (auth.uid() = user_id);
create policy "reviews own update" on public.reviews for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reviews own delete" on public.reviews for delete using (auth.uid() = user_id);
create policy "notifications own rows" on public.notifications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Role table is intentionally not writable from client sessions. Assign admins in SQL Editor.
create policy "users can read own role" on public.user_roles for select using (auth.uid() = user_id);
-- IMPORTANT: Admin-only operations should be implemented with RLS policies / trusted server functions.
-- Never rely on a hidden button or client-side password for admin security.
