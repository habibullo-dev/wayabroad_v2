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

/** Normalize a GPA recorded on any supported scale to a 0–4.0 scale. */
export function normalizeGpaTo4(
  gpa: number | null | undefined,
  scale: number | null | undefined,
): number | null {
  if (gpa == null || scale == null || scale <= 0) return null;
  return Math.max(0, Math.min(4, (gpa / scale) * 4));
}
