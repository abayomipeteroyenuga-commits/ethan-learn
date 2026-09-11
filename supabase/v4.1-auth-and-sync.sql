-- ETHAN Learn v4.1 — Supabase Auth + learner cloud sync
-- Run this once in Supabase SQL Editor for the ETHAN Learn project.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text not null default 'Learner',
  learner_type text,
  level text,
  goal text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create table if not exists public.learner_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.learner_state enable row level security;

drop policy if exists "learner_state_select_own" on public.learner_state;
create policy "learner_state_select_own"
on public.learner_state for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "learner_state_insert_own" on public.learner_state;
create policy "learner_state_insert_own"
on public.learner_state for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "learner_state_update_own" on public.learner_state;
create policy "learner_state_update_own"
on public.learner_state for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

revoke all on table public.profiles from anon;
revoke all on table public.learner_state from anon;
grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update on table public.learner_state to authenticated;
