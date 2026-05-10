create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  bio text,
  university text,
  headline text,
  portfolio_links text[] default '{}',
  skills text[] default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.skills (
  id bigserial primary key,
  slug text unique not null,
  name text not null,
  category text not null check (category in ('engineering', 'design', 'business'))
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  required_skills text[] default '{}',
  team_size int not null default 3,
  timeline text not null default '1-2 months',
  category text not null default 'engineering',
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  primary key (project_id, profile_id)
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  message text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_offers_receiver_status on public.offers(receiver_id, status);
create index if not exists idx_projects_created_at on public.projects(created_at desc);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.offers enable row level security;
alter table public.notifications enable row level security;

create policy "profiles_self_read_write" on public.profiles
for all using (id = auth.uid()) with check (id = auth.uid());

create policy "projects_read_open" on public.projects
for select using (true);

create policy "projects_creator_manage" on public.projects
for all using (creator_id = auth.uid()) with check (creator_id = auth.uid());

create policy "offers_sender_or_receiver_read" on public.offers
for select using (sender_id = auth.uid() or receiver_id = auth.uid());

create policy "offers_sender_insert" on public.offers
for insert with check (sender_id = auth.uid());

create policy "offers_receiver_update" on public.offers
for update using (receiver_id = auth.uid());

create policy "members_read" on public.project_members
for select using (true);

create policy "members_self_insert" on public.project_members
for insert with check (profile_id = auth.uid());

create policy "notifications_owner_only" on public.notifications
for all using (user_id = auth.uid()) with check (user_id = auth.uid());
