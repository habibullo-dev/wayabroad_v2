-- M3 verified-DB overlay: one additive, nullable JSONB column holding normalized
-- per-field financial provenance loaded from files/universities_verified_v2.json.
-- Additive and reversible; existing estimate columns are untouched and remain the fallback.
alter table public.universities
  add column if not exists verified jsonb;

comment on column public.universities.verified is
  'M3 verified-DB overlay: normalized per-field financial provenance from files/universities_verified_v2.json. Shape: {rank,status,official_site,tuition_ug:{krw_min,krw_max,krw_per_semester,usd_per_year,status,source_url,verified_on,note},application_fee_krw:{...},scholarships:{...}}. NULL = no verified data. Gate display by per-field status: only "verified_official" may be shown as confirmed fact; "verified_thirdparty"/"estimated*" must be labeled estimates; "pending"/absent fall back to the existing estimate columns.';
