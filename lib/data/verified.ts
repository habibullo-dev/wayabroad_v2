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

export interface VerifiedOverlay {
  rank: number | null;
  /** Record-level verification_status (verified | partially_verified | estimated | …). */
  status: string;
  official_site: string | null;
  tuition_ug: VerifiedTuition | null;
  scholarships: VerifiedScholarships | null;
  application_fee: VerifiedAppFee | null;
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

  return {
    rank: num(root.rank),
    status: str(root.status) ?? "pending",
    official_site: str(root.official_site),
    tuition_ug,
    scholarships,
    application_fee,
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
