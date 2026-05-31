import type { University } from "@/lib/data/types";

/**
 * Shape of the `universities.verified` JSONB overlay (M3 verified-DB).
 * Written by scripts/load-verified.ts from files/universities_verified_v2.json —
 * keep this type and that script's output in sync.
 *
 * Every financial field carries its own provenance + `status`. Display is GATED by status:
 * only `verified_official` may be shown as a confirmed fact; everything else is a labeled
 * estimate; `pending`/absent falls back to the existing estimate columns.
 */
export interface VerifiedField {
  status: string;
  source_url: string | null;
  verified_on: string | null;
  note: string | null;
}

export interface VerifiedTuition extends VerifiedField {
  krw_min: number | null;
  krw_max: number | null;
  /** Representative KRW/semester (midpoint of a range, or the single value). */
  krw_per_semester: number | null;
  usd_per_year: number | null;
}

export interface VerifiedScholarships extends VerifiedField {
  text: string | null;
}

export interface VerifiedAppFee extends VerifiedField {
  krw: number | null;
}

export interface VerifiedDorm extends VerifiedField {
  krw_per_semester: number | null;
}

export interface VerifiedLiving extends VerifiedField {
  usd_per_month: number | null;
}

export interface VerifiedRequirements extends VerifiedField {
  topik_min: number | null;
  ielts_min: number | null;
  toefl_ibt_min: number | null;
  deadline_text: string | null;
}

export interface VerifiedRanking extends VerifiedField {
  /** QS world ranking — a number or a band like "501-510". */
  qs_world: string | null;
}

export interface VerifiedAcceptance extends VerifiedField {
  rate_pct: number | null;
  intl_rate_pct: number | null;
}

export interface VerifiedOverlay {
  rank: number | null;
  /** Record-level verification_status (verified | partially_verified | estimated | ai_web | …). */
  status: string;
  official_site: string | null;
  /** Set by the AI web-search validator: ISO date + provider tag. */
  validated_on: string | null;
  validated_via: string | null;
  tuition_ug: VerifiedTuition | null;
  scholarships: VerifiedScholarships | null;
  application_fee: VerifiedAppFee | null;
  dorm: VerifiedDorm | null;
  living: VerifiedLiving | null;
  requirements: VerifiedRequirements | null;
  ranking: VerifiedRanking | null;
  acceptance: VerifiedAcceptance | null;
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() !== "" ? v : null;
}
function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}
function obj(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null;
}

/**
 * Safely read + sanitize the typed overlay off a university row (the column is `Json | null`).
 * Every leaf is coerced to a primitive (string/number) or null, so a malformed blob can never
 * reach React as a non-primitive child.
 */
export function getVerified(
  university: Pick<University, "verified">,
): VerifiedOverlay | null {
  const root = obj(university.verified);
  if (!root) return null;

  const t = obj(root.tuition_ug);
  const tuition_ug: VerifiedTuition | null = t
    ? {
        krw_min: num(t.krw_min),
        krw_max: num(t.krw_max),
        krw_per_semester: num(t.krw_per_semester),
        usd_per_year: num(t.usd_per_year),
        status: str(t.status) ?? "pending",
        source_url: str(t.source_url),
        verified_on: str(t.verified_on),
        note: str(t.note),
      }
    : null;

  const s = obj(root.scholarships);
  const scholarships: VerifiedScholarships | null = s
    ? {
        text: str(s.text),
        status: str(s.status) ?? "pending",
        source_url: str(s.source_url),
        verified_on: str(s.verified_on),
        note: str(s.note),
      }
    : null;

  const f = obj(root.application_fee);
  const application_fee: VerifiedAppFee | null = f
    ? {
        krw: num(f.krw),
        status: str(f.status) ?? "pending",
        source_url: str(f.source_url),
        verified_on: str(f.verified_on),
        note: str(f.note),
      }
    : null;

  const base = (o: Record<string, unknown>): VerifiedField => ({
    status: str(o.status) ?? "pending",
    source_url: str(o.source_url),
    verified_on: str(o.verified_on),
    note: str(o.note),
  });

  const d = obj(root.dorm);
  const dorm: VerifiedDorm | null = d
    ? { krw_per_semester: num(d.krw_per_semester), ...base(d) }
    : null;

  const lv = obj(root.living);
  const living: VerifiedLiving | null = lv
    ? { usd_per_month: num(lv.usd_per_month), ...base(lv) }
    : null;

  const rq = obj(root.requirements);
  const requirements: VerifiedRequirements | null = rq
    ? {
        topik_min: num(rq.topik_min),
        ielts_min: num(rq.ielts_min),
        toefl_ibt_min: num(rq.toefl_ibt_min),
        deadline_text: str(rq.deadline_text),
        ...base(rq),
      }
    : null;

  const rk = obj(root.ranking);
  const ranking: VerifiedRanking | null = rk
    ? { qs_world: str(rk.qs_world), ...base(rk) }
    : null;

  const ac = obj(root.acceptance);
  const acceptance: VerifiedAcceptance | null = ac
    ? {
        rate_pct: num(ac.rate_pct),
        intl_rate_pct: num(ac.intl_rate_pct),
        ...base(ac),
      }
    : null;

  return {
    rank: num(root.rank),
    status: str(root.status) ?? "pending",
    official_site: str(root.official_site),
    validated_on: str(root.validated_on),
    validated_via: str(root.validated_via),
    tuition_ug,
    scholarships,
    application_fee,
    dorm,
    living,
    requirements,
    ranking,
    acceptance,
  };
}

export type TrustLevel = "verified" | "estimate" | "none";

/**
 * Map a per-field provenance status to a display trust level.
 * Only `verified_official` is shown as confirmed fact (the methodology's hard rule).
 */
export function fieldTrust(status: string | null | undefined): TrustLevel {
  if (status === "verified_official") return "verified";
  if (!status || status === "pending") return "none";
  return "estimate"; // verified_thirdparty, estimated_class_average, etc.
}
