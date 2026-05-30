-- Reference data: universities, programs, admission_records.
-- Mirrors database/schema.sql (the source of truth for reference tables).
-- Public-read via RLS; writes happen only through the service role (which bypasses RLS).

create table if not exists public.universities (
  id                       bigint primary key,
  slug                     text unique not null,
  name                     text not null,
  city                     text,
  region                   text,
  country                  text default 'South Korea',
  type                     text check (type in ('national','public','private','science')),
  tier_band                text check (tier_band in ('elite','strong','mid','regional')),
  kr_rank_unirank_2026     int,
  website                  text,
  intl_office_note         text,
  tuition_ug_krw_min       int,
  tuition_ug_krw_max       int,
  tuition_ug_usd_min       int,
  tuition_ug_usd_max       int,
  tuition_grad_krw_min     int,
  tuition_grad_krw_max     int,
  dorm_krw_per_semester    int,
  dorm_usd_per_semester    int,
  application_fee_krw      int,
  living_krw_per_month     int,
  living_usd_per_month     int,
  visa_cost_usd            int,
  offers_english_programs  boolean default true,
  topik_min_undergrad      int,
  topik_min_grad           int,
  english_min_ielts        numeric(2,1),
  english_min_toefl_ibt    int,
  scholarship_note         text,
  data_confidence          text default 'medium',
  verify_before_launch     boolean default true,
  created_at               timestamptz default now()
);

create table if not exists public.programs (
  id                       bigint primary key,
  university_id            bigint not null references public.universities(id) on delete cascade,
  name                     text not null,
  field                    text,
  degree_level             text check (degree_level in ('Bachelor','Master','PhD')),
  language_of_instruction  text,
  min_gpa_4_0_scale        numeric(3,2),
  topik_required_level     int,
  english_min_ielts        numeric(2,1),
  deadline_spring_intake   text,
  deadline_fall_intake     text,
  tuition_krw_per_semester int,
  scholarship_notes        text,
  created_at               timestamptz default now()
);

-- SYNTHETIC bootstrap data for the probability engine. Replace with real outcomes over time.
create table if not exists public.admission_records (
  id                       bigint primary key,
  program_id               bigint not null references public.programs(id) on delete cascade,
  university_id            bigint references public.universities(id) on delete cascade,
  applicant_gpa_4_0        numeric(3,2),
  applicant_lang_test      text,
  applicant_lang_score     numeric(4,1),
  outcome                  text check (outcome in ('admit','reject')),
  year                     int,
  synthetic                boolean default true,
  created_at               timestamptz default now()
);

create index if not exists idx_programs_university   on public.programs(university_id);
create index if not exists idx_records_program       on public.admission_records(program_id);
create index if not exists idx_records_university    on public.admission_records(university_id);
create index if not exists idx_universities_tier     on public.universities(tier_band);

-- Reference data is world-readable. No write policies => only the service role can write.
alter table public.universities      enable row level security;
alter table public.programs          enable row level security;
alter table public.admission_records enable row level security;

drop policy if exists "public read universities" on public.universities;
create policy "public read universities"
  on public.universities for select using (true);

drop policy if exists "public read programs" on public.programs;
create policy "public read programs"
  on public.programs for select using (true);

drop policy if exists "public read admission_records" on public.admission_records;
create policy "public read admission_records"
  on public.admission_records for select using (true);
