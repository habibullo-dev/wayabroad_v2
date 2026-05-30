import "server-only";

import { getCurrentUser } from "@/lib/auth/user";
import type { Student } from "@/lib/data/types";
import {
  getMyApplications,
  type ApplicationSummary,
} from "@/lib/documents/data";
import { createServerSupabase } from "@/lib/supabase/server";

export interface DashboardData {
  email: string | null;
  student: Student | null;
  applications: ApplicationSummary[];
  /** True once the profile has the fields the shortlist/matching needs. */
  profileComplete: boolean;
  /** True if any application has at least one generated document version. */
  hasDocuments: boolean;
  /** True if any application has moved beyond draft. */
  hasSubmitted: boolean;
}

/** Everything the mission-tracker dashboard renders, in one RLS-scoped pass. */
export async function getDashboard(): Promise<DashboardData> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      email: null,
      student: null,
      applications: [],
      profileComplete: false,
      hasDocuments: false,
      hasSubmitted: false,
    };
  }

  const supabase = createServerSupabase();
  const [{ data: student }, applications] = await Promise.all([
    supabase.from("students").select("*").eq("id", user.id).maybeSingle(),
    getMyApplications(),
  ]);

  let hasDocuments = false;
  const applicationIds = applications.map((a) => a.application.id);
  if (applicationIds.length > 0) {
    const { count } = await supabase
      .from("documents")
      .select("id", { count: "exact", head: true })
      .in("application_id", applicationIds);
    hasDocuments = (count ?? 0) > 0;
  }

  const profileComplete = Boolean(
    student?.gpa != null && student?.intended_field,
  );
  const hasSubmitted = applications.some(
    (a) => a.application.status !== "draft",
  );

  return {
    email: user.email ?? null,
    student: student ?? null,
    applications,
    profileComplete,
    hasDocuments,
    hasSubmitted,
  };
}
