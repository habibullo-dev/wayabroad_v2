import { KRW_PER_USD } from "@/lib/config";
import type { University } from "@/lib/data/types";
import { fieldTrust, getVerified, type TrustLevel } from "@/lib/data/verified";
import { formatKrw } from "@/lib/format";

/**
 * Single source of truth for a university's estimated yearly cost.
 *
 * Both the shortlist/dashboard cards and the university-detail CostBreakdown render from this,
 * so the headline number can never contradict itself across surfaces (the old card showed a
 * city-tier bucket while the detail page showed the verified figure). Methodology mirrors the
 * detail page: prefer the verified-official tuition (already per-year USD) when present, else the
 * seed estimate (per-semester USD × 2); dorm prefers a validated KRW/semester (×2), else the seed
 * column; living prefers validated USD/month (×12), else the seed column. Total excludes visa,
 * matching the "Yearly total (excl. visa)" row on the detail page.
 */
export interface YearlyCost {
  tuitionYear: number | null;
  dormYear: number | null;
  livingYear: number | null;
  visa: number | null;
  /** Tuition + dorm + living (excl. visa); null when nothing is known. */
  total: number | null;
  /** Trust level of the tuition figure that drives the headline ("verified" | "estimate" | "none"). */
  tuitionTrust: TrustLevel;
  tuitionIsWaiver: boolean;
  /** KRW/semester range string for the verified tuition, when available. */
  krwRange: string | null;
  tuitionSourceUrl: string | null;
  verifiedOn: string | null;
  dormSourceUrl: string | null;
  livingSourceUrl: string | null;
  /** Overall basis for a card chip: verified-official, a labeled estimate, or nothing to show. */
  basis: "verified" | "estimate" | "none";
  /** True when any figure on this card came from the AI web-search validator. */
  aiValidated: boolean;
  validatedOn: string | null;
}

function midpoint(a: number | null, b: number | null): number | null {
  if (a != null && b != null) return (a + b) / 2;
  return a ?? b ?? null;
}

function sum(values: (number | null)[]): number | null {
  const present = values.filter((v): v is number => v != null);
  if (present.length === 0) return null;
  return present.reduce((acc, v) => acc + v, 0);
}

export function yearlyCostUsd(university: University): YearlyCost {
  const verified = getVerified(university);

  // --- Tuition (provenance-aware) ---
  const vt = verified?.tuition_ug ?? null;
  const rawTuitionTrust: TrustLevel = vt ? fieldTrust(vt.status) : "none";
  const estTuitionYear = (() => {
    const semester = midpoint(
      university.tuition_ug_usd_min,
      university.tuition_ug_usd_max,
    );
    return semester != null ? semester * 2 : null;
  })();
  const useVerifiedTuition =
    rawTuitionTrust !== "none" && vt?.usd_per_year != null;
  const tuitionTrust: TrustLevel = useVerifiedTuition ? rawTuitionTrust : "none";
  const tuitionYear = useVerifiedTuition ? vt!.usd_per_year : estTuitionYear;
  const tuitionIsWaiver = useVerifiedTuition && tuitionYear === 0;

  // --- Dorm ---
  const vd = verified?.dorm ?? null;
  const useVd =
    !!vd && fieldTrust(vd.status) !== "none" && vd.krw_per_semester != null;
  const dormYear = useVd
    ? Math.round((vd!.krw_per_semester! * 2) / KRW_PER_USD)
    : university.dorm_usd_per_semester != null
      ? university.dorm_usd_per_semester * 2
      : null;

  // --- Living ---
  const vl = verified?.living ?? null;
  const useVl =
    !!vl && fieldTrust(vl.status) !== "none" && vl.usd_per_month != null;
  const livingYear = useVl
    ? vl!.usd_per_month! * 12
    : university.living_usd_per_month != null
      ? university.living_usd_per_month * 12
      : null;

  const krwRange =
    useVerifiedTuition &&
    vt!.krw_min != null &&
    vt!.krw_max != null &&
    vt!.krw_max > 0
      ? vt!.krw_min === vt!.krw_max
        ? `${formatKrw(vt!.krw_min)} / semester`
        : `${formatKrw(vt!.krw_min)}–${formatKrw(vt!.krw_max)} / semester`
      : null;

  const total = sum([tuitionYear, dormYear, livingYear]);
  const basis: YearlyCost["basis"] = useVerifiedTuition
    ? "verified"
    : total != null
      ? "estimate"
      : "none";

  return {
    tuitionYear,
    dormYear,
    livingYear,
    visa: university.visa_cost_usd,
    total,
    tuitionTrust,
    tuitionIsWaiver,
    krwRange,
    tuitionSourceUrl: useVerifiedTuition ? vt!.source_url : null,
    verifiedOn: useVerifiedTuition ? vt!.verified_on : null,
    dormSourceUrl: useVd ? vd!.source_url : null,
    livingSourceUrl: useVl ? vl!.source_url : null,
    basis,
    aiValidated: verified?.validated_via != null,
    validatedOn: verified?.validated_on ?? null,
  };
}
