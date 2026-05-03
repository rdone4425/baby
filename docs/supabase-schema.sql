create table if not exists public.baby_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  birth_date date not null,
  feeding_mode text not null,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  baby_id uuid not null references public.baby_profiles(id) on delete cascade,
  title text not null,
  starts_at timestamptz not null,
  location text not null default '',
  notes text not null default '',
  category text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  baby_id uuid not null references public.baby_profiles(id) on delete cascade,
  title text not null,
  due_at timestamptz not null,
  status text not null default 'todo',
  source text not null default 'manual',
  created_at timestamptz not null default now()
);

create table if not exists public.family_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  baby_id uuid not null references public.baby_profiles(id) on delete cascade,
  assignee_name text not null,
  title text not null,
  status text not null default 'todo',
  due_at timestamptz not null,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'baby_profiles_user_id_fkey'
      and conrelid = 'public.baby_profiles'::regclass
  ) then
    alter table public.baby_profiles
      add constraint baby_profiles_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete cascade;
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'appointments_user_id_fkey'
      and conrelid = 'public.appointments'::regclass
  ) then
    alter table public.appointments
      add constraint appointments_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete cascade;
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'reminders_user_id_fkey'
      and conrelid = 'public.reminders'::regclass
  ) then
    alter table public.reminders
      add constraint reminders_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete cascade;
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'family_tasks_user_id_fkey'
      and conrelid = 'public.family_tasks'::regclass
  ) then
    alter table public.family_tasks
      add constraint family_tasks_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete cascade;
  end if;
end
$$;

alter table public.baby_profiles enable row level security;
alter table public.appointments enable row level security;
alter table public.reminders enable row level security;
alter table public.family_tasks enable row level security;

do $$
begin
  drop policy if exists baby_profiles_select_own on public.baby_profiles;
  create policy baby_profiles_select_own
    on public.baby_profiles
    for select
    using (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists baby_profiles_insert_own on public.baby_profiles;
  create policy baby_profiles_insert_own
    on public.baby_profiles
    for insert
    with check (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists baby_profiles_update_own on public.baby_profiles;
  create policy baby_profiles_update_own
    on public.baby_profiles
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists baby_profiles_delete_own on public.baby_profiles;
  create policy baby_profiles_delete_own
    on public.baby_profiles
    for delete
    using (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists appointments_select_own on public.appointments;
  create policy appointments_select_own
    on public.appointments
    for select
    using (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists appointments_insert_own on public.appointments;
  create policy appointments_insert_own
    on public.appointments
    for insert
    with check (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists appointments_update_own on public.appointments;
  create policy appointments_update_own
    on public.appointments
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists appointments_delete_own on public.appointments;
  create policy appointments_delete_own
    on public.appointments
    for delete
    using (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists reminders_select_own on public.reminders;
  create policy reminders_select_own
    on public.reminders
    for select
    using (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists reminders_insert_own on public.reminders;
  create policy reminders_insert_own
    on public.reminders
    for insert
    with check (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists reminders_update_own on public.reminders;
  create policy reminders_update_own
    on public.reminders
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists reminders_delete_own on public.reminders;
  create policy reminders_delete_own
    on public.reminders
    for delete
    using (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists family_tasks_select_own on public.family_tasks;
  create policy family_tasks_select_own
    on public.family_tasks
    for select
    using (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists family_tasks_insert_own on public.family_tasks;
  create policy family_tasks_insert_own
    on public.family_tasks
    for insert
    with check (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists family_tasks_update_own on public.family_tasks;
  create policy family_tasks_update_own
    on public.family_tasks
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists family_tasks_delete_own on public.family_tasks;
  create policy family_tasks_delete_own
    on public.family_tasks
    for delete
    using (auth.uid() = user_id);
end
$$;

create table if not exists public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  baby_id uuid references public.baby_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  trigger text not null,
  strategy_version text not null,
  snapshot jsonb not null,
  recommendations jsonb not null
);

create table if not exists public.agent_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recommendation_id text not null,
  recommendation_kind text not null,
  verdict text not null,
  channel text not null,
  applied_at timestamptz not null,
  note text not null default '',
  outing_scenario text,
  assignee_name text
);

alter table public.agent_runs enable row level security;
alter table public.agent_feedback enable row level security;

do $$
begin
  drop policy if exists agent_runs_select_own on public.agent_runs;
  create policy agent_runs_select_own
    on public.agent_runs
    for select
    using (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists agent_runs_insert_own on public.agent_runs;
  create policy agent_runs_insert_own
    on public.agent_runs
    for insert
    with check (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists agent_runs_update_own on public.agent_runs;
  create policy agent_runs_update_own
    on public.agent_runs
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists agent_runs_delete_own on public.agent_runs;
  create policy agent_runs_delete_own
    on public.agent_runs
    for delete
    using (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists agent_feedback_select_own on public.agent_feedback;
  create policy agent_feedback_select_own
    on public.agent_feedback
    for select
    using (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists agent_feedback_insert_own on public.agent_feedback;
  create policy agent_feedback_insert_own
    on public.agent_feedback
    for insert
    with check (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists agent_feedback_update_own on public.agent_feedback;
  create policy agent_feedback_update_own
    on public.agent_feedback
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
end
$$;

do $$
begin
  drop policy if exists agent_feedback_delete_own on public.agent_feedback;
  create policy agent_feedback_delete_own
    on public.agent_feedback
    for delete
    using (auth.uid() = user_id);
end
$$;

create index if not exists baby_profiles_user_id_idx
  on public.baby_profiles(user_id);

create index if not exists appointments_baby_id_starts_at_idx
  on public.appointments(baby_id, starts_at);

create index if not exists reminders_baby_id_due_at_idx
  on public.reminders(baby_id, due_at);

create index if not exists family_tasks_baby_id_due_at_idx
  on public.family_tasks(baby_id, due_at);

create index if not exists agent_runs_user_id_created_at_idx
  on public.agent_runs(user_id, created_at desc);

create index if not exists agent_feedback_user_id_applied_at_idx
  on public.agent_feedback(user_id, applied_at desc);
