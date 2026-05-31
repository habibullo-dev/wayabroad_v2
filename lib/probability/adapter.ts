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
  };
}

/**
 * Build a validated base rate from a university's verified overlay, when the AI validator found
 * a cited acceptance rate. Prefers the international rate; returns null when none is available
 * (the engine then uses a clearly-labeled tier prior).
 */
export function toBaseRate(university: University): AcceptanceBaseRate | null {
  const acc = getVerified(university)?.acceptance;
  // Require a citation — an uncited rate must not become a "validated_rate" basis.
  if (!acc || !acc.source_url) return null;
  const intl = acc.intl_rate_pct;
  const overall = acc.rate_pct;
  const pct = intl != null && intl > 0 ? intl : overall;
  if (pct == null || pct <= 0) return null;
  return {
    rate: pct / 100,
    sourceUrl: acc.source_url,
    international: intl != null && intl > 0,
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
