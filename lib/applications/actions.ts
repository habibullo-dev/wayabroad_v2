"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/user";
import { createServerSupabase } from "@/lib/supabase/server";

/** Form action: start (or reopen) an application for a program, then go to its workspace. */
export async function startApplication(formData: FormData): Promise<void> {
  const programId = Number(formData.get("programId"));
  if (!Number.isInteger(programId) || programId <= 0) redirect("/shortlist");

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = createServerSupabase();

  // Reuse an existing application for this program to avoid duplicates.
  const { data: existing } = await supabase
    .from("applications")
    .select("id")
    .eq("student_id", user.id)
    .eq("program_id", programId)
    .limit(1);

  let id = existing?.[0]?.id;
  if (!id) {
    const { data, error } = await supabase
      .from("applications")
      .insert({ student_id: user.id, program_id: programId, status: "draft" })
      .select("id")
      .single();
    if (data) {
      id = data.id;
    } else if (error?.code === "23505") {
      // A concurrent submit already created it (uniq_applications_student_program) — reuse it.
      const { data: again } = await supabase
        .from("applications")
        .select("id")
        .eq("student_id", user.id)
        .eq("program_id", programId)
        .limit(1);
      id = again?.[0]?.id;
    }
    if (!id) redirect("/shortlist?error=apply");
  }

  redirect(`/applications/${id}`);
}
