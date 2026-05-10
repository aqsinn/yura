-- Hotfix for partial schemas where offers table exists without receiver_id

alter table if exists public.offers
  add column if not exists receiver_id uuid;

alter table if exists public.offers
  add column if not exists sender_id uuid;

alter table if exists public.offers
  add column if not exists project_id uuid;

alter table if exists public.offers
  add column if not exists status text default 'pending';

alter table if exists public.offers
  add column if not exists created_at timestamptz default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'offers'
      and column_name = 'receiver_id'
  ) then
    begin
      alter table public.offers
        add constraint offers_receiver_id_fkey
        foreign key (receiver_id) references public.profiles(id) on delete cascade;
    exception when duplicate_object then
      null;
    end;
  end if;
end $$;

create index if not exists idx_offers_receiver_status
  on public.offers(receiver_id, status);
