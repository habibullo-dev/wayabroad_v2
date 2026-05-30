import "server-only";

import { getCurrentUser } from "@/lib/auth/user";
import type {
  Application,
  DocumentRow,
  Program,
  University,
} from "@/lib/data/types";
import type { DocType } from "@/lib/documents/prompts";
import { createServerSupabase } from "@/lib/supabase/server";

export interface Workspace {
  application: Application;
  program: Program;
  university: University;
  /** Versions per type, newest first. */
  documents: Record<DocType, DocumentRow[]>;
}

/** Load one application + its program/university + document versions (RLS-scoped to the user). */
export async function getApplicationWorkspace(
  applicationId: string,
): Promise<Workspace | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = createServerSupabase();
  const { data: application } = await supabase
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .maybeSingle();
  if (!application) return null; // RLS guarantees ownership

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

  const { data: docs } = await supabase
    .from("documents")
    .select("*")
    .eq("application_id", applicationId)
    .order("version", { ascending: false });

  const documents: Record<DocType, DocumentRow[]> = { sop: [], study_plan: [] };
  for (const doc of docs ?? []) {
    if (doc.type === "sop" || doc.type === "study_plan") {
      documents[doc.type].push(doc);
    }
  }

  return { application, program, university, documents };
}

export interface ApplicationSummary {
  application: Application;
  program: Program;
  university: University;
}

/** All of the current user's applications, newest first. */
export async function getMyApplications(): Promise<ApplicationSummary[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = createServerSupabase();
  const { data: apps } = await supabase
    .from("applications")
    .select("*")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });
  if (!apps || apps.length === 0) return [];

  const programIds = [...new Set(apps.map((a) => a.program_id))];
  const { data: programs } = await supabase
    .from("programs")
    .select("*")
    .in("id", programIds);
  const programById = new Map((programs ?? []).map((p) => [p.id, p]));

  const universityIds = [
    ...new Set((programs ?? []).map((p) => p.university_id)),
  ];
  const { data: universities } = await supabase
    .from("universities")
    .select("*")
    .in("id", universityIds);
  const universityById = new Map((universities ?? []).map((u) => [u.id, u]));

  return apps.flatMap((application) => {
    const program = programById.get(application.program_id);
    if (!program) return [];
    const university = universityById.get(program.university_id);
    if (!university) return [];
    return [{ application, program, university }];
  });
}
