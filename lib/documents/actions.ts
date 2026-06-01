"use server";

import { revalidatePath } from "next/cache";

import {
  loadDocContext,
  variablesFromContext,
} from "@/lib/documents/context";
import { generateDocument } from "@/lib/documents/generate";
import { DOC_TYPE_LABELS, type DocType } from "@/lib/documents/prompts";
import { createServerSupabase } from "@/lib/supabase/server";

export type DocActionState = { error?: string };

function asDocType(value: FormDataEntryValue | null): DocType | null {
  return value === "sop" || value === "study_plan" ? value : null;
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

  const ctx = await loadDocContext(applicationId);
  if (!ctx) return { error: "Application not found." };

  const result = await generateDocument(variablesFromContext(ctx, type));
  if (!result.ok) return { error: result.error };

  const { supabase } = ctx;

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

  const ctx = await loadDocContext(applicationId);
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
