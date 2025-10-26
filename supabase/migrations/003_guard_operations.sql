-- Migration: introduce guard, site, incident, shift, report, and client tables for B6 Security operations

create extension if not exists pgcrypto;

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  name text not null,
  contact_name text,
  contact_email text,
  contact_phone text,
  status text not null default 'active' check (status in ('active','pending','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clients_account_idx on public.clients(account_id, status);

create trigger set_clients_updated_at
before update on public.clients
for each row
execute function public.handle_updated_at();

create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  name text not null,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  timezone text not null default 'UTC',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sites_account_idx on public.sites(account_id, is_active);

create trigger set_sites_updated_at
before update on public.sites
for each row
execute function public.handle_updated_at();

create table if not exists public.guards (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  badge_number text,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  status text not null default 'active' check (status in ('active','inactive','suspended')),
  shift_preference text check (shift_preference in ('day','swing','night')),
  primary_site_id uuid references public.sites(id) on delete set null,
  hire_date date,
  certifications text[],
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists guards_account_idx on public.guards(account_id, status);

create trigger set_guards_updated_at
before update on public.guards
for each row
execute function public.handle_updated_at();

create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  site_id uuid not null references public.sites(id) on delete cascade,
  guard_id uuid references public.guards(id) on delete set null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled','filled','in_progress','completed','missed','cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shifts_account_idx on public.shifts(account_id, start_time);

create trigger set_shifts_updated_at
before update on public.shifts
for each row
execute function public.handle_updated_at();

create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  site_id uuid not null references public.sites(id) on delete cascade,
  guard_id uuid references public.guards(id) on delete set null,
  shift_id uuid references public.shifts(id) on delete set null,
  occurred_at timestamptz not null,
  type text not null,
  summary text not null,
  status text not null default 'open' check (status in ('open','in_review','resolved','archived')),
  severity text not null default 'medium' check (severity in ('low','medium','high','critical')),
  follow_up_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists incidents_account_idx on public.incidents(account_id, status, severity);

create trigger set_incidents_updated_at
before update on public.incidents
for each row
execute function public.handle_updated_at();

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  site_id uuid references public.sites(id) on delete set null,
  guard_id uuid references public.guards(id) on delete set null,
  shift_id uuid references public.shifts(id) on delete set null,
  report_type text not null,
  submitted_at timestamptz not null default now(),
  title text not null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reports_account_idx on public.reports(account_id, report_type);

create trigger set_reports_updated_at
before update on public.reports
for each row
execute function public.handle_updated_at();

alter table public.clients enable row level security;
alter table public.sites enable row level security;
alter table public.guards enable row level security;
alter table public.shifts enable row level security;
alter table public.incidents enable row level security;
alter table public.reports enable row level security;

create or replace view public.v_account_membership as
select account_id, user_id, role
from public.account_members;

create policy "Account members can view clients" on public.clients for select using (
  exists (
    select 1
    from public.account_members am
    where am.account_id = clients.account_id
      and am.user_id = auth.uid()
  )
);

create policy "Account managers manage clients" on public.clients for all using (
  exists (
    select 1
    from public.account_members am
    where am.account_id = clients.account_id
      and am.user_id = auth.uid()
      and am.role in ('owner','manager','supervisor')
  )
) with check (
  exists (
    select 1
    from public.account_members am
    where am.account_id = clients.account_id
      and am.user_id = auth.uid()
      and am.role in ('owner','manager','supervisor')
  )
);

create policy "Account members can view sites" on public.sites for select using (
  exists (
    select 1
    from public.account_members am
    where am.account_id = sites.account_id
      and am.user_id = auth.uid()
  )
);

create policy "Account managers manage sites" on public.sites for all using (
  exists (
    select 1
    from public.account_members am
    where am.account_id = sites.account_id
      and am.user_id = auth.uid()
      and am.role in ('owner','manager','supervisor')
  )
) with check (
  exists (
    select 1
    from public.account_members am
    where am.account_id = sites.account_id
      and am.user_id = auth.uid()
      and am.role in ('owner','manager','supervisor')
  )
);

create policy "Account members can view guards" on public.guards for select using (
  exists (
    select 1
    from public.account_members am
    where am.account_id = guards.account_id
      and am.user_id = auth.uid()
  )
);

create policy "Account managers manage guards" on public.guards for all using (
  exists (
    select 1
    from public.account_members am
    where am.account_id = guards.account_id
      and am.user_id = auth.uid()
      and am.role in ('owner','manager','supervisor')
  )
) with check (
  exists (
    select 1
    from public.account_members am
    where am.account_id = guards.account_id
      and am.user_id = auth.uid()
      and am.role in ('owner','manager','supervisor')
  )
);

create policy "Account members can view shifts" on public.shifts for select using (
  exists (
    select 1
    from public.account_members am
    where am.account_id = shifts.account_id
      and am.user_id = auth.uid()
  )
);

create policy "Account managers manage shifts" on public.shifts for all using (
  exists (
    select 1
    from public.account_members am
    where am.account_id = shifts.account_id
      and am.user_id = auth.uid()
      and am.role in ('owner','manager','supervisor')
  )
) with check (
  exists (
    select 1
    from public.account_members am
    where am.account_id = shifts.account_id
      and am.user_id = auth.uid()
      and am.role in ('owner','manager','supervisor')
  )
);

create policy "Account members can view incidents" on public.incidents for select using (
  exists (
    select 1
    from public.account_members am
    where am.account_id = incidents.account_id
      and am.user_id = auth.uid()
  )
);

create policy "Account members can insert incidents" on public.incidents for insert with check (
  exists (
    select 1
    from public.account_members am
    where am.account_id = incidents.account_id
      and am.user_id = auth.uid()
  )
);

create policy "Account managers update incidents" on public.incidents for update using (
  exists (
    select 1
    from public.account_members am
    where am.account_id = incidents.account_id
      and am.user_id = auth.uid()
      and am.role in ('owner','manager','supervisor')
  )
) with check (
  exists (
    select 1
    from public.account_members am
    where am.account_id = incidents.account_id
      and am.user_id = auth.uid()
      and am.role in ('owner','manager','supervisor')
  )
);

create policy "Account members can view reports" on public.reports for select using (
  exists (
    select 1
    from public.account_members am
    where am.account_id = reports.account_id
      and am.user_id = auth.uid()
  )
);

create policy "Account managers manage reports" on public.reports for all using (
  exists (
    select 1
    from public.account_members am
    where am.account_id = reports.account_id
      and am.user_id = auth.uid()
      and am.role in ('owner','manager','supervisor')
  )
) with check (
  exists (
    select 1
    from public.account_members am
    where am.account_id = reports.account_id
      and am.user_id = auth.uid()
      and am.role in ('owner','manager','supervisor')
  )
);

comment on table public.guards is 'Security guards and supervisors managed by each account.';
comment on table public.sites is 'Client properties that require guard coverage.';
comment on table public.incidents is 'Operational incidents captured by field teams.';
comment on table public.shifts is 'Scheduled guard assignments at client sites.';
comment on table public.reports is 'Published summaries and daily activity reports for clients.';
comment on table public.clients is 'Client organizations linked to an account.';
