create table if not exists public.learner_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.learner_state enable row level security;
drop policy if exists "learner reads own state" on public.learner_state;
drop policy if exists "learner inserts own state" on public.learner_state;
drop policy if exists "learner updates own state" on public.learner_state;
create policy "learner reads own state" on public.learner_state for select to authenticated using (auth.uid() = user_id);
create policy "learner inserts own state" on public.learner_state for insert to authenticated with check (auth.uid() = user_id);
create policy "learner updates own state" on public.learner_state for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
revoke all on public.learner_state from anon;
grant select,insert,update on public.learner_state to authenticated;
