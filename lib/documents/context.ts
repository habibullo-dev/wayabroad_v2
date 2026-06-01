import "server-only";

import { getCurrentUser } from "@/lib/auth/user";
import type { Program, Student, University } from "@/lib/data/types";
import type { DocVariables, DocType } from "@/lib/documents/prompts";
import { createServerSupabase } from "@/lib/supabase/server";

export interface DocContext {
  supabase: ReturnType<typeof createServerSupabase>;
  student: Student | null;
  program: Program;
  university: University;
}

/**
 * Load one application's student/program/university context, RLS-scoped to the signed-in
 * user. Shared by the server action and the streaming route handler so both build the same
 * variables and enforce the same ownership check (RLS on `applications` guarantees the user
 * owns the row). Returns null if unauthenticated or the application isn't visible.
 */
export async function loadDocContext(
  applicationId: string,
): Promise<DocContext | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = createServerSupabase();

  const { data: application } = await supabase
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .maybeSingle();
  if (!application) return null; // RLS guarantees ownership

  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  const { data: program } = await supabase
    .from("programs")
    .select("*")
    .eq("id", application.program_id)
    .maybeSingle();
  if (!program) return null;
  const { data: university } = await supabase
    .from("universities")
    .select("*")
    .eq("id", program.university_id)
    .maybeSingle();
  if (!university) return null;

  return { supabase, student, program, university };
}

/** Map a loaded context into the variables the prompt builder expects. */
export function variablesFromContext(
  ctx: DocContext,
  type: DocType,
): DocVariables {
  const { student, program, university } = ctx;
  return {
    type,
    studentName: student?.full_name,
    country: student?.country,
    gpa: student?.gpa,
    gpaScale: student?.gpa_scale,
    languageTest: student?.language_test,
    languageScore: student?.language_score,
    field: student?.intended_field ?? program.field,
    degree: program.degree_level,
    universityName: university.name,
    programName: program.name,
    programLanguage: program.language_of_instruction,
  };
}
