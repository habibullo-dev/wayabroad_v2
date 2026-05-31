"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/user";
import { DEGREES, GPA_SCALES, LANGUAGE_TESTS } from "@/lib/profile/constants";
import { createServerSupabase } from "@/lib/supabase/server";

export type ProfileState = { error?: string };

const emptyToUndef = (v: unknown) =>
  v === "" || v === null || v === undefined ? undefined : v;

const SCALE_VALUES = GPA_SCALES.map(Number);

const profileSchema = z
  .object({
    full_name: z.preprocess(
      emptyToUndef,
      z.string().trim().max(120).optional(),
    ),
    country: z.preprocess(emptyToUndef, z.string().trim().max(80).optional()),
    intended_degree: z.enum(DEGREES),
    intended_field: z
      .string()
      .trim()
      .min(1, "Choose an intended field.")
      .max(80),
    gpa: z.coerce
      .number({ invalid_type_error: "Enter your GPA." })
      .min(0.01, "Enter your GPA.")
      .max(5),
    gpa_scale: z.coerce
      .number()
      .refine((v) => SCALE_VALUES.includes(v), "Pick a GPA scale."),
    language_test: z.enum(LANGUAGE_TESTS),
    language_score: z.preprocess(
      emptyToUndef,
      z.coerce.number().min(0).max(300).optional(),
    ),
    budget_usd: z.preprocess(
      emptyToUndef,
      z.coerce.number().int().min(0).max(1_000_000).optional(),
    ),
  })
  .refine((d) => d.gpa <= d.gpa_scale, {
    message: "Your GPA can't be higher than its scale.",
    path: ["gpa"],
  })
  .superRefine((d, ctx) => {
    if (d.language_test === "None") return;
    const bounds: Record<string, [number, number]> = {
      TOPIK: [1, 6],
      IELTS: [0, 9],
      TOEFL: [0, 120],
    };
    const range = bounds[d.language_test];
    if (!range) return;
    if (d.language_score == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["language_score"],
        message: `Enter your ${d.language_test} score.`,
      });
    } else if (d.language_score < range[0] || d.language_score > range[1]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["language_score"],
        message: `${d.language_test} score must be between ${range[0]} and ${range[1]}.`,
      });
    }
  });

export async function saveProfile(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Please check the form.",
    };
  }

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const d = parsed.data;
  const hasTest = d.language_test !== "None";
  const supabase = createServerSupabase();
  // RLS ("students insert/update own") permits this because id === auth.uid().
  const { error } = await supabase.from("students").upsert({
    id: user.id,
    email: user.email ?? null,
    full_name: d.full_name ?? null,
    country: d.country ?? null,
    gpa: d.gpa,
    gpa_scale: d.gpa_scale,
    language_test: hasTest ? d.language_test : null,
    language_score: hasTest ? (d.language_score ?? null) : null,
    budget_usd: d.budget_usd ?? null,
    intended_degree: d.intended_degree,
    intended_field: d.intended_field,
  });
  if (error) {
    return { error: "Couldn't save your profile. Please try again." };
  }

  redirect("/dashboard");
}
