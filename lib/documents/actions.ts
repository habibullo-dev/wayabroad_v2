"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/user";
import { generateDocument } from "@/lib/documents/generate";
import { DOC_TYPE_LABELS, type DocType } from "@/lib/documents/prompts";
import { createServerSupabase } from "@/lib/supabase/server";

export type DocActionState = { error?: string };

function asDocType(value: FormDataEntryValue | null): DocType | null {
  return value === "sop" || value === "study_plan" ? value : null;
}

async function loadContext(applicationId: string) {
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

async function nextVersion(
  supabase: ReturnType<typeof createServerSupabase>,
  applicationId: string,
  type: DocType,
): Promise<number> {
  const { data } = await supabase
    .from("documents")
    .select("version")
    .eq("application_id", applicationId)
    .eq("type", type)
    .order("version", { ascending: false })
    .limit(1);
  return (data?.[0]?.version ?? 0) + 1;
}

/** Insert a new version, retrying if a concurrent submit grabbed the same version number. */
async function insertDocumentVersion(
  supabase: ReturnType<typeof createServerSupabase>,
  applicationId: string,
  type: DocType,
  content: string,
): Promise<DocActionState> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const version = await nextVersion(supabase, applicationId, type);
    const { error } = await supabase.from("documents").insert({
      application_id: applicationId,
      type,
      title: `${DOC_TYPE_LABELS[type]} v${version}`,
      content,
      version,
    });
    if (!error) return {};
    // 23505 = unique violation (uniq_documents_app_type_version) → retry with a fresh version.
    if (error.code !== "23505") {
      return { error: "Couldn't save the draft. Please try again." };
    }
  }
  return { error: "Couldn't save after several tries — please retry." };
}

/** Generate a draft via Claude and save it as a new version. */
export async function generateDocumentAction(
  _prev: DocActionState,
  formData: FormData,
): Promise<DocActionState> {
  const applicationId = String(formData.get("applicationId") ?? "");
  const type = asDocType(formData.get("type"));
  if (!applicationId || !type) return { error: "Invalid request." };

  const ctx = await loadContext(applicationId);
  if (!ctx) return { error: "Application not found." };
  const { supabase, student, program, university } = ctx;

  const result = await generateDocument({
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
  });
  if (!result.ok) return { error: result.error };

  const saved = await insertDocumentVersion(
    supabase,
    applicationId,
    type,
    result.content,
  );
  if (saved.error) return saved;

  revalidatePath(`/applications/${applicationId}`);
  return {};
}

/** Save the edited content as a new version (preserves history). */
export async function saveDocumentAction(
  _prev: DocActionState,
  formData: FormData,
): Promise<DocActionState> {
  const applicationId = String(formData.get("applicationId") ?? "");
  const type = asDocType(formData.get("type"));
  const content = String(formData.get("content") ?? "");
  if (!applicationId || !type) return { error: "Invalid request." };
  if (content.trim().length === 0)
    return { error: "There's nothing to save yet." };
  if (content.length > 20000)
    return { error: "That draft is too long to save." };

  const ctx = await loadContext(applicationId);
  if (!ctx) return { error: "Application not found." };

  const saved = await insertDocumentVersion(
    ctx.supabase,
    applicationId,
    type,
    content,
  );
  if (saved.error) return saved;

  revalidatePath(`/applications/${applicationId}`);
  return {};
}
