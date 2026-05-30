import { KRW_PER_USD } from "@/lib/config";
import type { Program, University } from "@/lib/data/types";

export type MatchLevel = "high" | "medium" | "low";

export interface MatchProfile {
  /** GPA normalized to a 0–4.0 scale. */
  gpa4: number | null;
  languageTest: string | null;
  languageScore: number | null;
  budgetUsd: number | null;
  field: string | null;
  degree: string | null;
}

export interface ProgramMatch {
  program: Program;
  university: University;
  score: number; // 0–100
  level: MatchLevel;
  reasons: string[];
  estAnnualCostUsd: number | null;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const isGraduate = (degree: string | null) =>
  degree === "Master" || degree === "PhD";

/**
 * Rough estimated yearly cost in USD = annual tuition + 12 months of living.
 * Tuition source, in order: the program's per-semester KRW (×2 → annual); for graduate
 * programs, the university's graduate KRW/semester range; otherwise the university's
 * undergraduate USD/semester range. All figures are annualized. Null when nothing is known.
 */
export function estimateAnnualCostUsd(
  program: Program,
  university: University,
): number | null {
  let tuition: number | null = null;
  if (program.tuition_krw_per_semester != null) {
    tuition = (program.tuition_krw_per_semester * 2) / KRW_PER_USD;
  } else if (
    isGraduate(program.degree_level) &&
    university.tuition_grad_krw_min != null &&
    university.tuition_grad_krw_max != null
  ) {
    // KRW/semester range → annual USD: (min + max) / FX (the ×2 and ÷2 cancel).
    tuition =
      (university.tuition_grad_krw_min + university.tuition_grad_krw_max) /
      KRW_PER_USD;
  } else if (
    university.tuition_ug_usd_min != null &&
    university.tuition_ug_usd_max != null
  ) {
    // USD/semester range → annual midpoint = (min + max).
    tuition = university.tuition_ug_usd_min + university.tuition_ug_usd_max;
  }
  const living =
    university.living_usd_per_month != null
      ? university.living_usd_per_month * 12
      : null;
  if (tuition == null && living == null) return null;
  return Math.round((tuition ?? 0) + (living ?? 0));
}

function gpaFit(profile: MatchProfile, program: Program): number {
  const min = program.min_gpa_4_0_scale;
  if (min == null) return 0.6; // unknown requirement → neutral
  if (profile.gpa4 == null) return 0.5;
  if (profile.gpa4 >= min) return 1;
  return clamp01(1 - (min - profile.gpa4)); // ~1.0 GPA short → 0
}

function approxIeltsFromToefl(toefl: number): number {
  if (toefl >= 100) return 7;
  if (toefl >= 90) return 6.5;
  if (toefl >= 80) return 6;
  return 5;
}

function languageFit(profile: MatchProfile, program: Program): number {
  const ielts = program.english_min_ielts;
  const topik = program.topik_required_level;

  if (ielts != null) {
    if (profile.languageTest === "IELTS" && profile.languageScore != null) {
      return profile.languageScore >= ielts ? 1 : 0.5;
    }
    if (profile.languageTest === "TOEFL" && profile.languageScore != null) {
      return approxIeltsFromToefl(profile.languageScore) >= ielts ? 1 : 0.5;
    }
    return 0.4; // no English test yet — many programs allow conditional admission
  }

  if (topik != null) {
    if (profile.languageTest === "TOPIK" && profile.languageScore != null) {
      return profile.languageScore >= topik ? 1 : 0.5;
    }
    return 0.4;
  }

  return 0.6; // no stated language requirement
}

function fieldFit(profile: MatchProfile, program: Program): number {
  if (!profile.field || !program.field) return 0.4;
  return program.field.toLowerCase() === profile.field.toLowerCase() ? 1 : 0.3;
}

function budgetFit(profile: MatchProfile, estCost: number | null): number {
  if (profile.budgetUsd == null || estCost == null) return 0.6;
  if (estCost <= profile.budgetUsd) return 1;
  return clamp01(profile.budgetUsd / estCost);
}

const WEIGHTS = { gpa: 0.35, lang: 0.2, field: 0.25, budget: 0.2 } as const;

export function levelFor(score: number): MatchLevel {
  if (score >= 70) return "high";
  if (score >= 45) return "medium";
  return "low";
}

/**
 * Score and rank programs for a student profile. Pure and deterministic. This is the M2
 * "fit" score — distinct from the M3 admission-probability engine (which blends real
 * outcome data). Programs of the student's intended degree are preferred.
 */
export function rankPrograms(
  profile: MatchProfile,
  programs: Program[],
  universitiesById: Map<number, University>,
  limit = 12,
): ProgramMatch[] {
  // Intended degree is a hard filter — the shortlist must not mix in other degree levels.
  const pool = profile.degree
    ? programs.filter((p) => p.degree_level === profile.degree)
    : programs;

  const matches: ProgramMatch[] = [];
  for (const program of pool) {
    const university = universitiesById.get(program.university_id);
    if (!university) continue;

    const estAnnualCostUsd = estimateAnnualCostUsd(program, university);
    const g = gpaFit(profile, program);
    const l = languageFit(profile, program);
    const f = fieldFit(profile, program);
    const b = budgetFit(profile, estAnnualCostUsd);
    const score = Math.round(
      100 *
        (WEIGHTS.gpa * g +
          WEIGHTS.lang * l +
          WEIGHTS.field * f +
          WEIGHTS.budget * b),
    );

    const reasons: string[] = [];
    if (f >= 1) reasons.push("Matches your field");
    if (g >= 1) reasons.push("Meets the GPA bar");
    else if (program.min_gpa_4_0_scale != null) {
      reasons.push(`Asks GPA ≥ ${program.min_gpa_4_0_scale}`);
    }
    if (b >= 1 && profile.budgetUsd != null) reasons.push("Within budget");

    matches.push({
      program,
      university,
      score,
      level: levelFor(score),
      reasons,
      estAnnualCostUsd,
    });
  }

  // Stable, deterministic ordering: score desc, then program id asc.
  matches.sort((a, b) => b.score - a.score || a.program.id - b.program.id);
  return matches.slice(0, limit);
}
