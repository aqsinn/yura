-- Allow authenticated users to create/update skills (public tag catalog).

alter table public.skills enable row level security;

drop policy if exists skills_insert_authenticated on public.skills;
create policy skills_insert_authenticated
on public.skills
for insert
with check (auth.role() = 'authenticated');

drop policy if exists skills_update_authenticated on public.skills;
create policy skills_update_authenticated
on public.skills
for update
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
