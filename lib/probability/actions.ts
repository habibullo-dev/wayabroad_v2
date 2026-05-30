"use server";

import { z } from "zod";

import {
  getAdmissionRecords,
  getProgramWithUniversity,
} from "@/lib/data/admissions";
import {
  GPA_SCALES,
  LANGUAGE_TESTS,
  languageScoreError,
} from "@/lib/profile/constants";
import {
  toAdmissionRecords,
  toProgramInfo,
  toStudentProfile,
} from "@/lib/probability/adapter";
import {
  scoreAdmission,
  type ProbabilityResult,
} from "@/lib/probability/score";

export type CheckState = {
  result?: ProbabilityResult;
  programName?: string;
  error?: string;
};

const emptyToUndef = (v: unknown) =>
  v === "" || v === null || v === undefined ? undefined : v;

const SCALE_VALUES = GPA_SCALES.map(Number);

const checkSchema = z
  .object({
    programId: z.coerce.number().int().positive(),
    gpa: z.coerce.number().min(0.01).max(5),
    gpa_scale: z.coerce
      .number()
      .refine((v) => SCALE_VALUES.includes(v), "Pick a GPA scale."),
    language_test: z.enum(LANGUAGE_TESTS),
    language_score: z.preprocess(
      emptyToUndef,
      z.coerce.number().min(0).max(300).optional(),
    ),
  })
  .refine((d) => d.gpa <= d.gpa_scale, {
    message: "Your GPA can't be higher than its scale.",
    path: ["gpa"],
  })
  .superRefine((d, ctx) => {
    const msg = languageScoreError(d.language_test, d.language_score);
    if (msg) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["language_score"],
        message: msg,
      });
    }
  });

/** No-login free probability check (the top-of-funnel hook). Stores nothing. */
export async function runProbabilityCheck(
  _prev: CheckState,
  formData: FormData,
): Promise<CheckState> {
  const parsed = checkSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Please complete the form with valid values." };
  }
  const d = parsed.data;

  const pair = await getProgramWithUniversity(d.programId);
  if (!pair) return { error: "That program couldn't be found. Pick another." };

  const records = await getAdmissionRecords(d.programId);
  const student = toStudentProfile({
    gpa: d.gpa,
    gpaScale: d.gpa_scale,
    languageTest: d.language_test === "None" ? null : d.language_test,
    languageScore: d.language_score ?? null,
  });

  const result = scoreAdmission(
    student,
    toProgramInfo(pair.program, pair.university),
    toAdmissionRecords(records),
  );
  return {
    result,
    programName: `${pair.university.name} — ${pair.program.name}`,
  };
}
