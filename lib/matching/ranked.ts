import "server-only";

import type { Student } from "@/lib/data/types";
import { getPrograms, getUniversities } from "@/lib/data/universities";
import {
  rankPrograms,
  type MatchProfile,
  type ProgramMatch,
} from "@/lib/matching/shortlist";
import { normalizeGpaTo4 } from "@/lib/profile/constants";
import {
  toBaseRate,
  toProgramInfo,
  toStudentProfile,
} from "@/lib/probability/adapter";
import {
  scoreAdmission,
  type ProbabilityResult,
} from "@/lib/probability/score";

export interface RankedMatch {
  match: ProgramMatch;
  probability: ProbabilityResult;
}

/**
 * Rank programs for a student and attach an admission estimate to each — the shared engine
 * behind both the Matches page and the dashboard preview. Returns [] when the profile lacks
 * the fields the matcher needs. `limit` trims to the top N (for the dashboard preview).
 */
export async function getRankedMatches(
  student: Student,
  opts: { limit?: number } = {},
): Promise<{ matches: RankedMatch[]; isLive: boolean }> {
  if (student.gpa == null || !student.intended_field) {
    return { matches: [], isLive: false };
  }

  const [unis, progs] = await Promise.all([getUniversities(), getPrograms()]);
  const byId = new Map(unis.data.map((u) => [u.id, u]));
  const profile: MatchProfile = {
    gpa4: normalizeGpaTo4(student.gpa, student.gpa_scale),
    languageTest: student.language_test,
    languageScore: student.language_score,
    budgetUsd: student.budget_usd,
    field: student.intended_field,
    degree: student.intended_degree,
  };

  const ranked = rankPrograms(profile, progs.data, byId);
  const trimmed = opts.limit ? ranked.slice(0, opts.limit) : ranked;

  const studentProfile = toStudentProfile({
    gpa: student.gpa,
    gpaScale: student.gpa_scale ?? 4,
    languageTest: student.language_test,
    languageScore: student.language_score,
  });

  const matches: RankedMatch[] = trimmed.map((m) => ({
    match: m,
    probability: scoreAdmission(
      studentProfile,
      toProgramInfo(m.program, m.university),
      toBaseRate(m.university),
    ),
  }));

  return { matches, isLive: unis.source === "live" && progs.source === "live" };
}
