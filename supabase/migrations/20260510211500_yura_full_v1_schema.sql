-- Yura Full V1 Supabase schema
-- Safe to run on a fresh project. Uses IF NOT EXISTS where possible.

create extension if not exists pgcrypto;

-- =========================
-- Core profile + skills
-- =========================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  bio text,
  university text,
  headline text,
  skills text[] not null default '{}',
  portfolio_links text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  category text not null check (category in ('engineering', 'design', 'business')),
  created_at timestamptz not null default now()
);

create table if not exists public.profile_skills (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  skill_id bigint not null references public.skills(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, skill_id)
);

-- =========================
-- Projects + matching
-- =========================
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  required_skills text[] not null default '{}',
  team_size integer not null default 3 check (team_size between 1 and 20),
  timeline text not null,
  category text not null,
  status text not null default 'open' check (status in ('open', 'closed', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists skills text[] not null default '{}';
alter table public.projects add column if not exists required_skills text[] not null default '{}';

create table if not exists public.project_required_skills (
  project_id uuid not null references public.projects(id) on delete cascade,
  skill_id bigint not null references public.skills(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, skill_id)
);

create table if not exists public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member',
  status text not null default 'active' check (status in ('active', 'left', 'removed')),
  created_at timestamptz not null default now(),
  primary key (project_id, profile_id)
);

-- =========================
-- Offers + notifications
-- =========================
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  created_at timestamptz not null default now(),
  responded_at timestamptz
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- =========================
-- Indexes
-- =========================
create index if not exists idx_profile_skills_skill_id on public.profile_skills(skill_id);
create index if not exists idx_project_required_skills_skill_id on public.project_required_skills(skill_id);
create index if not exists idx_projects_creator_id on public.projects(creator_id);
create index if not exists idx_projects_status_created_at on public.projects(status, created_at desc);
create index if not exists idx_offers_receiver_status on public.offers(receiver_id, status);
create index if not exists idx_notifications_user_created_at on public.notifications(user_id, created_at desc);

-- =========================
-- Timestamp helper
-- =========================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

-- =========================
-- Auto-create profile on signup
-- =========================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    null
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- =========================
-- Matching function
-- =========================
create or replace function public.find_matching_profiles(p_project_id uuid, p_limit integer default 50)
returns table (
  profile_id uuid,
  matched_skills_count bigint
)
language sql
stable
as $$
  select
    ps.profile_id,
    count(*)::bigint as matched_skills_count
  from public.project_required_skills prs
  join public.profile_skills ps on ps.skill_id = prs.skill_id
  join public.projects p on p.id = prs.project_id
  where prs.project_id = p_project_id
    and ps.profile_id <> p.creator_id
  group by ps.profile_id
  order by matched_skills_count desc, ps.profile_id
  limit p_limit;
$$;

-- =========================
-- Create offers from matches
-- =========================
create or replace function public.create_project_offers(p_project_id uuid, p_sender_id uuid, p_message text default null)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer := 0;
begin
  with matches as (
    select * from public.find_matching_profiles(p_project_id, 100)
  ),
  inserted_offers as (
    insert into public.offers (project_id, sender_id, receiver_id, message, status)
    select p_project_id, p_sender_id, m.profile_id, p_message, 'pending'
    from matches m
    on conflict do nothing
    returning receiver_id
  )
  insert into public.notifications (user_id, type, payload)
  select
    io.receiver_id,
    'offer_received',
    jsonb_build_object('project_id', p_project_id, 'sender_id', p_sender_id)
  from inserted_offers io;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- =========================
-- Offer response helper
-- =========================
create or replace function public.respond_to_offer(p_offer_id uuid, p_decision text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_offer public.offers%rowtype;
  v_user_id uuid := auth.uid();
begin
  if p_decision not in ('accepted', 'declined') then
    raise exception 'Invalid decision: %', p_decision;
  end if;

  select *
  into v_offer
  from public.offers
  where id = p_offer_id;

  if not found then
    raise exception 'Offer not found';
  end if;

  if v_offer.receiver_id <> v_user_id then
    raise exception 'Not allowed to respond to this offer';
  end if;

  update public.offers
  set status = p_decision, responded_at = now()
  where id = p_offer_id;

  if p_decision = 'accepted' then
    insert into public.project_members (project_id, profile_id, role, status)
    values (v_offer.project_id, v_user_id, 'member', 'active')
    on conflict (project_id, profile_id) do update
      set status = excluded.status,
          role = excluded.role;
  end if;

  insert into public.notifications (user_id, type, payload)
  values (
    v_offer.sender_id,
    'offer_response',
    jsonb_build_object(
      'offer_id', v_offer.id,
      'project_id', v_offer.project_id,
      'receiver_id', v_offer.receiver_id,
      'decision', p_decision
    )
  );
end;
$$;

-- =========================
-- RLS
-- =========================
alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.profile_skills enable row level security;
alter table public.projects enable row level security;
alter table public.project_required_skills enable row level security;
alter table public.project_members enable row level security;
alter table public.offers enable row level security;
alter table public.notifications enable row level security;

drop policy if exists profiles_select_all on public.profiles;
create policy profiles_select_all on public.profiles
for select using (true);

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles
for insert with check (id = auth.uid());

drop policy if exists skills_select_all on public.skills;
create policy skills_select_all on public.skills
for select using (true);

drop policy if exists profile_skills_select_all on public.profile_skills;
create policy profile_skills_select_all on public.profile_skills
for select using (true);

drop policy if exists profile_skills_manage_self on public.profile_skills;
create policy profile_skills_manage_self on public.profile_skills
for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

drop policy if exists projects_select_all on public.projects;
create policy projects_select_all on public.projects
for select using (true);

drop policy if exists projects_insert_creator on public.projects;
create policy projects_insert_creator on public.projects
for insert with check (creator_id = auth.uid());

drop policy if exists projects_update_creator on public.projects;
create policy projects_update_creator on public.projects
for update using (creator_id = auth.uid()) with check (creator_id = auth.uid());

drop policy if exists projects_delete_creator on public.projects;
create policy projects_delete_creator on public.projects
for delete using (creator_id = auth.uid());

drop policy if exists prs_select_all on public.project_required_skills;
create policy prs_select_all on public.project_required_skills
for select using (true);

drop policy if exists prs_manage_project_creator on public.project_required_skills;
create policy prs_manage_project_creator on public.project_required_skills
for all using (
  exists (
    select 1 from public.projects p
    where p.id = project_required_skills.project_id
      and p.creator_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.projects p
    where p.id = project_required_skills.project_id
      and p.creator_id = auth.uid()
  )
);

drop policy if exists members_select_all on public.project_members;
create policy members_select_all on public.project_members
for select using (true);

drop policy if exists members_insert_self_or_creator on public.project_members;
create policy members_insert_self_or_creator on public.project_members
for insert with check (
  profile_id = auth.uid()
  or exists (
    select 1 from public.projects p
    where p.id = project_members.project_id
      and p.creator_id = auth.uid()
  )
);

drop policy if exists offers_select_sender_receiver on public.offers;
create policy offers_select_sender_receiver on public.offers
for select using (sender_id = auth.uid() or receiver_id = auth.uid());

drop policy if exists offers_insert_sender on public.offers;
create policy offers_insert_sender on public.offers
for insert with check (sender_id = auth.uid());

drop policy if exists offers_update_receiver_or_sender on public.offers;
create policy offers_update_receiver_or_sender on public.offers
for update using (receiver_id = auth.uid() or sender_id = auth.uid())
with check (receiver_id = auth.uid() or sender_id = auth.uid());

drop policy if exists notifications_select_owner on public.notifications;
create policy notifications_select_owner on public.notifications
for select using (user_id = auth.uid());

drop policy if exists notifications_insert_owner on public.notifications;
create policy notifications_insert_owner on public.notifications
for insert with check (user_id = auth.uid());

drop policy if exists notifications_update_owner on public.notifications;
create policy notifications_update_owner on public.notifications
for update using (user_id = auth.uid()) with check (user_id = auth.uid());
