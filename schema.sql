-- KLAKZWEB Supabase schema. Run in Supabase SQL Editor on a new project.
-- Uses Supabase Auth + Row Level Security. Never expose service_role secrets in browser code.
create extension if not exists pgcrypto;
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 username text not null unique check (char_length(username) between 2 and 24),
 bio text not null default '' check (char_length(bio) <= 180),
 created_at timestamptz not null default now()
);
create table if not exists public.resources (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
 title text not null check (char_length(title) between 3 and 80), game text not null check (char_length(game) between 1 and 50),
 category text not null check (category in ('Mod','Araç','Rehber','Kod')), tags text[] not null default '{}',
 description text not null check (char_length(description) between 10 and 500), link text, code text not null default '',
 created_at timestamptz not null default now(), views integer not null default 0 check (views >= 0), approved boolean not null default false
);
create table if not exists public.favorites (
 user_id uuid not null references public.profiles(id) on delete cascade, resource_id uuid not null references public.resources(id) on delete cascade,
 created_at timestamptz not null default now(), primary key(user_id,resource_id)
);
create table if not exists public.reviews (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 resource_id uuid not null references public.resources(id) on delete cascade, rating integer not null check (rating between 1 and 5),
 body text not null default '' check (char_length(body) <= 500), created_at timestamptz not null default now(), unique(user_id,resource_id)
);
create table if not exists public.user_roles (
 user_id uuid primary key references public.profiles(id) on delete cascade, role text not null check(role in ('admin','moderator'))
);
create table if not exists public.notifications (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
 title text not null check(char_length(title) <= 100), body text not null check(char_length(body) <= 500),
 read_at timestamptz, created_at timestamptz not null default now()
);
-- Automatic profile row for newly registered users; username is editable in profile page.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
declare base_name text;
begin
 base_name := lower(regexp_replace(split_part(coalesce(new.email,'player'), '@', 1), '[^a-zA-Z0-9_]', '', 'g'));
 if length(base_name) < 2 then base_name := 'player'; end if;
 insert into public.profiles(id,username) values(new.id, left(base_name,16) || '_' || substr(replace(new.id::text,'-',''),1,5)) on conflict do nothing;
 return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
-- Security-definer role check avoids recursive RLS checks against user_roles.
create or replace function public.is_klakz_moderator() returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.user_roles where user_id=auth.uid() and role in ('admin','moderator'));
$$;
-- Public rating summary for resource cards.
create or replace view public.resource_rating_summary with (security_invoker=true) as
 select resource_id, round(avg(rating)::numeric,1) as average_rating, count(*)::integer as review_count from public.reviews group by resource_id;
-- Increment views safely without allowing clients to write arbitrary counts.
create or replace function public.increment_resource_views(resource_id_input uuid) returns void language sql security definer set search_path=public as $$
 update public.resources set views=views+1 where id=resource_id_input and approved=true;
$$;
grant execute on function public.increment_resource_views(uuid) to anon, authenticated;
-- RLS
alter table public.profiles enable row level security;
alter table public.resources enable row level security;
alter table public.favorites enable row level security;
alter table public.reviews enable row level security;
alter table public.user_roles enable row level security;
alter table public.notifications enable row level security;
-- Profiles public-readable; each account may only edit its own profile.
create policy "profiles public read" on public.profiles for select using (true);
create policy "profile owner update" on public.profiles for update using (auth.uid()=id) with check (auth.uid()=id);
-- Published resources are public. Authors can read their own pending submissions.
create policy "published or own resources read" on public.resources for select using (approved=true or auth.uid()=user_id or public.is_klakz_moderator());
create policy "users submit pending resources" on public.resources for insert with check (auth.uid()=user_id and approved=false and views=0);
-- Only moderators may update approval status. Owners can update content but not approval/views via trigger.
create or replace function public.guard_resource_update() returns trigger language plpgsql as $$
begin
 if public.is_klakz_moderator() then return new; end if;
 if auth.uid() is null or auth.uid() <> old.user_id then raise exception 'Not allowed'; end if;
 if new.user_id <> old.user_id or new.approved <> old.approved or new.views <> old.views or new.created_at <> old.created_at then raise exception 'Protected resource fields cannot be changed'; end if;
 return new;
end; $$;
create trigger resources_guard_update before update on public.resources for each row execute function public.guard_resource_update();
create policy "authors update own resources" on public.resources for update using (auth.uid()=user_id or public.is_klakz_moderator()) with check (auth.uid()=user_id or public.is_klakz_moderator());
create policy "authors or moderators delete resources" on public.resources for delete using (auth.uid()=user_id or public.is_klakz_moderator());
-- Notifications are visible and mutable only by their recipient.
create policy "notifications owner manage" on public.notifications for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
-- Notify a resource owner when their submission is approved.
create or replace function public.notify_resource_approval() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if old.approved=false and new.approved=true then
  insert into public.notifications(user_id,title,body) values(new.user_id,'Kaynağın yayınlandı', '“' || new.title || '” moderasyon tarafından onaylandı.');
 end if;
 return new;
end; $$;
drop trigger if exists resource_approval_notification on public.resources;
create trigger resource_approval_notification after update of approved on public.resources for each row execute function public.notify_resource_approval();
-- Notify a resource owner when someone reviews their published resource.
create or replace function public.notify_resource_review() returns trigger language plpgsql security definer set search_path=public as $$
declare owner_id uuid; resource_title text;
begin
 select user_id,title into owner_id,resource_title from public.resources where id=new.resource_id;
 if owner_id is not null and owner_id <> new.user_id then
  insert into public.notifications(user_id,title,body) values(owner_id,'Yeni değerlendirme', '“' || resource_title || '” için yeni bir puan/yorum geldi.');
 end if;
 return new;
end; $$;
drop trigger if exists review_notification on public.reviews;
create trigger review_notification after insert on public.reviews for each row execute function public.notify_resource_review();
-- Users manage only their own favorites.
create policy "favorites owner manage" on public.favorites for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
-- Reviews are public-readable, but users may only create/edit/delete their own review.
create policy "reviews public read" on public.reviews for select using (true);
create policy "reviews owner insert" on public.reviews for insert with check (auth.uid()=user_id);
create policy "reviews owner update" on public.reviews for update using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "reviews owner delete" on public.reviews for delete using (auth.uid()=user_id);
create policy "roles owner or moderator read" on public.user_roles for select using (auth.uid()=user_id or public.is_klakz_moderator());
-- Do NOT create client INSERT/UPDATE/DELETE policies on user_roles. Assign the first moderator below after registering.
-- After signing up, find your auth.users id and run:
-- insert into public.user_roles(user_id, role) values ('YOUR-AUTH-USER-UUID', 'admin');

-- Explicit table/view grants are required in addition to RLS policies.
grant select on public.profiles to anon, authenticated;
grant update on public.profiles to authenticated;
grant select, insert, update, delete on public.resources to authenticated;
grant select on public.resources to anon;
grant select, insert, delete on public.favorites to authenticated;
grant select, insert, update, delete on public.reviews to authenticated;
grant select on public.reviews to anon;
grant select on public.user_roles to authenticated;
grant select, update on public.notifications to authenticated;
grant select on public.resource_rating_summary to anon, authenticated;
