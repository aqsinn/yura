-- Subscriptions and Plans schema

-- Plan enum
create type public.subscription_tier as enum ('free', 'starter', 'pro');

-- Update profiles to include tier and subscription status
alter table public.profiles add column if not exists tier public.subscription_tier not null default 'free';
alter table public.profiles add column if not exists stripe_customer_id text;

-- Subscriptions table
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null check (status in ('active', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'trialing')),
  price_id text,
  quantity integer,
  cancel_at_period_end boolean,
  created timestamptz not null default now(),
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz not null default now(),
  ended_at timestamptz,
  cancel_at timestamptz,
  canceled_at timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  stripe_subscription_id text unique
);

-- RLS for subscriptions
alter table public.subscriptions enable row level security;

create policy "Users can view their own subscription"
on public.subscriptions for select
using (auth.uid() = user_id);

-- Function to sync profile tier when subscription changes
create or replace function public.handle_subscription_update()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Logic to update profiles.tier based on the subscription price_id
  -- For now, we'll just use a simple mapping or let the webhook handle it.
  -- This is a placeholder for real logic.
  return new;
end;
$$;

create trigger on_subscription_updated
after insert or update on public.subscriptions
for each row
execute function public.handle_subscription_update();
