import type { Program, University } from "@/lib/data/types";
import { getVerified } from "@/lib/data/verified";
import { normalizeGpaTo4 } from "@/lib/profile/constants";
import type {
  AcceptanceBaseRate,
  ProgramInfo,
  StudentProfile,
  TierBand,
} from "@/lib/probability/score";

const TIERS: TierBand[] = ["elite", "strong", "mid", "regional"];

function toTier(band: string | null): TierBand | undefined {
  return band && (TIERS as string[]).includes(band)
    ? (band as TierBand)
    : undefined;
}

const TIER_SELECTIVITY: Record<string, number> = {
  elite: 0.9,
  strong: 0.65,
  mid: 0.4,
  regional: 0.2,
};

/**
 * Relative selectivity 0..1 (1 = most selective), from the university's national ranking
 * (`kr_rank_unirank_2026`), with tier as a coarse fallback. Feeds ProgramInfo.selectivity so the
 * engine spreads same-tier programs apart instead of returning one identical baseline.
 */
function toSelectivity(u: University): number | null {
  const rank = u.kr_rank_unirank_2026;
  if (rank != null && rank > 0) {
    // ~50 ranked Korean universities: rank 1 ≈ most selective, rank ≥ 50 ≈ least.
    return Math.max(0, Math.min(1, 1 - (rank - 1) / 49));
  }
  return u.tier_band ? (TIER_SELECTIVITY[u.tier_band] ?? null) : null;
}

/** Map a DB program + its university into the engine's ProgramInfo. */
export function toProgramInfo(
  program: Program,
  university: University,
): ProgramInfo {
  const language: ProgramInfo["language"] =
    program.language_of_instruction === "Korean" ? "Korean" : "English";
  return {
    name: `${university.name} — ${program.name}`,
    language,
    minGpa: program.min_gpa_4_0_scale ?? (language === "Korean" ? 2.5 : 3.0),
    minIelts: program.english_min_ielts,
    minToefl: university.english_min_toefl_ibt,
    minTopik: program.topik_required_level,
    tierBand: toTier(university.tier_band),
    selectivity: toSelectivity(university),
  };
}

/**
 * Build a validated base rate from a university's verified overlay, when the AI validator found
 * a cited acceptance rate. Prefers the international rate; returns null when none is available
 * (the engine then uses a clearly-labeled tier prior).
 */
export function toBaseRate(university: University): AcceptanceBaseRate | null {
  const acc = getVerified(university)?.acceptance;
  // Only a genuine, cited INTERNATIONAL acceptance rate may anchor the estimate. The overall
  // rate reflects the domestic (수능) competition — the wrong population for an international
  // applicant — so it is deliberately ignored; the engine uses its intl tier baseline instead.
  if (
    !acc ||
    !acc.source_url ||
    acc.intl_rate_pct == null ||
    acc.intl_rate_pct <= 0
  ) {
    return null;
  }
  return {
    rate: acc.intl_rate_pct / 100,
    sourceUrl: acc.source_url,
    international: true,
  };
}

/** Build a StudentProfile (GPA normalized to 4.0) from raw profile inputs. */
export function toStudentProfile(input: {
  gpa: number;
  gpaScale: number;
  languageTest: string | null;
  languageScore: number | null;
}): StudentProfile {
  const langTest =
    input.languageTest === "IELTS" ||
    input.languageTest === "TOEFL" ||
    input.languageTest === "TOPIK"
      ? input.languageTest
      : null;
  return {
    gpa: normalizeGpaTo4(input.gpa, input.gpaScale) ?? input.gpa,
    langTest,
    langScore: langTest ? input.languageScore : null,
  };
}
