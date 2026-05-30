"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/user";
import { nextStatus, type ApplicationStatus } from "@/lib/applications/status";
import { sendStatusNotification } from "@/lib/email/notifications";
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

/**
 * Move an application from `from` to `to`, then notify and revalidate. The update is a
 * compare-and-set: it only writes when the row is still at `from` (and, via RLS + the
 * explicit `student_id` predicate, owned by the caller). This blocks direct POSTs that
 * would regress status and makes concurrent transitions safe — a stale request whose
 * precondition no longer holds is a no-op. Shared by submit and the simulated advance.
 */
async function transition(
  applicationId: string,
  from: ApplicationStatus,
  to: ApplicationStatus,
): Promise<void> {
  if (!applicationId) return;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = createServerSupabase();
  const { data: updated } = await supabase
    .from("applications")
    .update({ status: to })
    .eq("id", applicationId)
    .eq("student_id", user.id)
    .eq("status", from)
    .select("program_id")
    .maybeSingle();
  if (!updated) return; // not owned, or no longer at `from` — nothing changed

  const { data: program } = await supabase
    .from("programs")
    .select("name")
    .eq("id", updated.program_id)
    .maybeSingle();
  await sendStatusNotification({
    to: user.email ?? null,
    programName: program?.name ?? "your program",
    status: to,
  });

  revalidatePath(`/applications/${applicationId}`);
  revalidatePath("/dashboard");
}

/** Student action: submit a draft application for review (only from `draft`). */
export async function submitApplication(formData: FormData): Promise<void> {
  await transition(
    String(formData.get("applicationId") ?? ""),
    "draft",
    "submitted",
  );
}

/**
 * Simulated admin/status progression to the next stage — the demo's status flow.
 * Reads the current (RLS-checked) status, computes the next stage server-side, and
 * advances via a compare-and-set so it can neither overshoot `decision` nor regress.
 */
export async function advanceApplicationStatus(
  formData: FormData,
): Promise<void> {
  const applicationId = String(formData.get("applicationId") ?? "");
  if (!applicationId) return;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = createServerSupabase();
  const { data: application } = await supabase
    .from("applications")
    .select("status")
    .eq("id", applicationId)
    .maybeSingle();
  if (!application) return;

  const from = application.status;
  const to = nextStatus(from);
  if (!to) return; // already at the final stage
  await transition(applicationId, from, to);
}
