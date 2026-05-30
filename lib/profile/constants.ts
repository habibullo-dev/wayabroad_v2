// Shared profile vocabulary — used by the onboarding form, the save action, and matching.
export const DEGREES = ["Bachelor", "Master", "PhD"] as const;
export const LANGUAGE_TESTS = ["TOPIK", "IELTS", "TOEFL", "None"] as const;
export const GPA_SCALES = ["4.0", "4.3", "4.5", "5.0"] as const;
export const FIELDS = [
  "Business",
  "Engineering",
  "Computer Science",
  "Social Sciences",
  "Natural Sciences",
  "Humanities",
  "Arts & Design",
  "Medicine & Health",
  "Law",
  "Education",
] as const;

export type Degree = (typeof DEGREES)[number];
export type LanguageTest = (typeof LANGUAGE_TESTS)[number];

/**
 * Validate a language score against the test's real range (or null if fine).
 * TOPIK 1–6 · IELTS 0–9 · TOEFL iBT 0–120. A score is required once a test is chosen.
 */
export function languageScoreError(
  test: string,
  score: number | null | undefined,
): string | null {
  if (test === "None") return null;
  const bounds: Record<string, [number, number]> = {
    TOPIK: [1, 6],
    IELTS: [0, 9],
    TOEFL: [0, 120],
  };
  const range = bounds[test];
  if (!range) return null;
  if (score == null) return `Enter your ${test} score.`;
  if (score < range[0] || score > range[1]) {
    return `${test} score must be between ${range[0]} and ${range[1]}.`;
  }
  return null;
}

/** Normalize a GPA recorded on any supported scale to a 0–4.0 scale. */
export function normalizeGpaTo4(
  gpa: number | null | undefined,
  scale: number | null | undefined,
): number | null {
  if (gpa == null || scale == null || scale <= 0) return null;
  return Math.max(0, Math.min(4, (gpa / scale) * 4));
}
