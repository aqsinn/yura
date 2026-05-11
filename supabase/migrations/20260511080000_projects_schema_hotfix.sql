-- Hotfix: align projects table columns with app usage (safe for partial schemas).

alter table if exists public.projects
  add column if not exists category text not null default 'engineering';

alter table if exists public.projects
  add column if not exists timeline text not null default '1-2 months';

alter table if exists public.projects
  add column if not exists team_size integer not null default 3;

alter table if exists public.projects
  add column if not exists required_skills text[] not null default '{}';

alter table if exists public.projects
  add column if not exists status text not null default 'open';

alter table if exists public.projects
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_projects_status_created_at
  on public.projects(status, created_at desc);
