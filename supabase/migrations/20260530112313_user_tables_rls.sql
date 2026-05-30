-- User data: students (profile), applications, documents.
-- Strict own-data-only RLS. auth.uid() is wrapped in (select ...) so Postgres evaluates it
-- once per query instead of once per row (Supabase RLS performance best practice).

create extension if not exists moddatetime with schema extensions;

do $$ begin
  create type public.application_status as enum
    ('draft','submitted','under_review','interview','decision');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.document_type as enum
    ('sop','study_plan','personal_statement');
exception when duplicate_object then null; end $$;

-- One profile row per auth user (PK = auth.users.id).
create table if not exists public.students (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text,
  full_name       text,
  country         text,
  gpa             numeric(3,2),
  gpa_scale       numeric(3,1) default 4.0,
  language_test   text,
  language_score  numeric(4,1),
  budget_usd      int,
  intended_degree text,
  intended_field  text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table if not exists public.applications (
  id                uuid primary key default gen_random_uuid(),
  student_id        uuid not null references public.students(id) on delete cascade,
  program_id        bigint not null references public.programs(id) on delete restrict,
  status            public.application_status not null default 'draft',
  probability_score numeric(5,2),
  probability_band  text,
  notes             text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);
create index if not exists idx_applications_student on public.applications(student_id);
create index if not exists idx_applications_program on public.applications(program_id);

create table if not exists public.documents (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  type           public.document_type not null,
  title          text,
  content        text not null default '',
  version        int  not null default 1,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);
create index if not exists idx_documents_application on public.documents(application_id);

-- updated_at auto-maintenance
drop trigger if exists set_updated_at on public.students;
create trigger set_updated_at before update on public.students
  for each row execute function extensions.moddatetime(updated_at);
drop trigger if exists set_updated_at on public.applications;
create trigger set_updated_at before update on public.applications
  for each row execute function extensions.moddatetime(updated_at);
drop trigger if exists set_updated_at on public.documents;
create trigger set_updated_at before update on public.documents
  for each row execute function extensions.moddatetime(updated_at);

alter table public.students     enable row level security;
alter table public.applications enable row level security;
alter table public.documents    enable row level security;

-- students: a user can only touch their own profile row.
drop policy if exists "students select own" on public.students;
create policy "students select own" on public.students
  for select using ((select auth.uid()) = id);
drop policy if exists "students insert own" on public.students;
create policy "students insert own" on public.students
  for insert with check ((select auth.uid()) = id);
drop policy if exists "students update own" on public.students;
create policy "students update own" on public.students
  for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
drop policy if exists "students delete own" on public.students;
create policy "students delete own" on public.students
  for delete using ((select auth.uid()) = id);

-- applications: owned directly via student_id.
drop policy if exists "applications select own" on public.applications;
create policy "applications select own" on public.applications
  for select using ((select auth.uid()) = student_id);
drop policy if exists "applications insert own" on public.applications;
create policy "applications insert own" on public.applications
  for insert with check ((select auth.uid()) = student_id);
drop policy if exists "applications update own" on public.applications;
create policy "applications update own" on public.applications
  for update using ((select auth.uid()) = student_id)
  with check ((select auth.uid()) = student_id);
drop policy if exists "applications delete own" on public.applications;
create policy "applications delete own" on public.applications
  for delete using ((select auth.uid()) = student_id);

-- documents: ownership flows through the parent application.
drop policy if exists "documents select own" on public.documents;
create policy "documents select own" on public.documents
  for select using (exists (
    select 1 from public.applications a
    where a.id = documents.application_id and a.student_id = (select auth.uid())
  ));
drop policy if exists "documents insert own" on public.documents;
create policy "documents insert own" on public.documents
  for insert with check (exists (
    select 1 from public.applications a
    where a.id = documents.application_id and a.student_id = (select auth.uid())
  ));
drop policy if exists "documents update own" on public.documents;
create policy "documents update own" on public.documents
  for update using (exists (
    select 1 from public.applications a
    where a.id = documents.application_id and a.student_id = (select auth.uid())
  )) with check (exists (
    select 1 from public.applications a
    where a.id = documents.application_id and a.student_id = (select auth.uid())
  ));
drop policy if exists "documents delete own" on public.documents;
create policy "documents delete own" on public.documents
  for delete using (exists (
    select 1 from public.applications a
    where a.id = documents.application_id and a.student_id = (select auth.uid())
  ));
