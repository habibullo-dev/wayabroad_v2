import type {
  AdmissionRecord as DbAdmissionRecord,
  Program,
  University,
} from "@/lib/data/types";
import { normalizeGpaTo4 } from "@/lib/profile/constants";
import type {
  AdmissionRecord,
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

/** Map DB admission_records rows into the engine's records (dropping incomplete rows). */
export function toAdmissionRecords(
  rows: DbAdmissionRecord[],
): AdmissionRecord[] {
  return rows.flatMap((r) => {
    if (
      r.applicant_gpa_4_0 == null ||
      r.applicant_lang_score == null ||
      (r.outcome !== "admit" && r.outcome !== "reject")
    ) {
      return [];
    }
    return [
      {
        applicantGpa: r.applicant_gpa_4_0,
        langTest: r.applicant_lang_test ?? "",
        langScore: r.applicant_lang_score,
        outcome: r.outcome,
      },
    ];
  });
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
