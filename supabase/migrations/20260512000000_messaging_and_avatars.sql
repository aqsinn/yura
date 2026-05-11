-- Add avatar_url column if missing and create messaging tables

-- Ensure avatar_url exists in profiles (should already exist per full schema)
alter table if not exists public.profiles
  add column if not exists avatar_url text;

-- =========================
-- Conversations (1:1 messaging)
-- =========================
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  participant_a uuid not null references public.profiles(id) on delete cascade,
  participant_b uuid not null references public.profiles(id) on delete cascade,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  unique(participant_a, participant_b)
);

create index if not exists idx_conversations_participants on public.conversations(participant_a, participant_b);

-- =========================
-- Messages
-- =========================
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_conversation_created on public.messages(conversation_id, created_at asc);

-- =========================
-- RLS for new tables
-- =========================
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

drop policy if exists conversations_select_participants on public.conversations;
create policy conversations_select_participants on public.conversations
  for select using (participant_a = auth.uid() or participant_b = auth.uid());

drop policy if exists conversations_insert_self on public.conversations;
create policy conversations_insert_self on public.conversations
  for insert with check (participant_a = auth.uid() or participant_b = auth.uid());

drop policy if exists messages_select_conversation_participants on public.messages;
create policy messages_select_conversation_participants on public.messages
  for select using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and (c.participant_a = auth.uid() or c.participant_b = auth.uid())
    )
  );

drop policy if exists messages_insert_sender on public.messages;
create policy messages_insert_sender on public.messages
  for insert with check (sender_id = auth.uid());

drop policy if exists messages_update_read on public.messages;
create policy messages_update_read on public.messages
  for update using (sender_id = auth.uid() or exists (
    select 1 from public.conversations c
    where c.id = messages.conversation_id
      and (c.participant_a = auth.uid() or c.participant_b = auth.uid())
  ));

-- =========================
-- Profiles: allow avatar_url updates
-- =========================
drop policy if exists profiles_update_avatar on public.profiles;
create policy profiles_update_avatar on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- =========================
-- Storage bucket for avatars
-- =========================
insert into storage.buckets (id, name, public, file_size_limit, allowedMimeTypes)
values (
  'avatars',
  'avatars',
  true,
  5 * 1024 * 1024,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

drop policy if exists avatars_public_read on storage.objects;
create policy avatars_public_read on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists avatars_auth_upload on storage.objects;
create policy avatars_auth_upload on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists avatars_auth_delete on storage.objects;
create policy avatars_auth_delete on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
