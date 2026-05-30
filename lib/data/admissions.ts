import "server-only";

import { MOCK_PROGRAMS, MOCK_UNIVERSITIES } from "@/lib/data/mock";
import type { AdmissionRecord, Program, University } from "@/lib/data/types";
import { MOCK_DATA } from "@/lib/env";
import { captureException } from "@/lib/observability/sentry";
import { createPublicClient } from "@/lib/supabase/server";

/** Synthetic admission_records for a program (public-read). [] in mock mode / on error. */
export async function getAdmissionRecords(
  programId: number,
): Promise<AdmissionRecord[]> {
  if (MOCK_DATA) return [];
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("admission_records")
      .select("*")
      .eq("program_id", programId);
    if (error) throw error;
    return data ?? [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`[data] getAdmissionRecords(${programId}) failed.`, error);
    captureException(error, { where: "getAdmissionRecords" });
    return [];
  }
}

/** A program + its university by program id. null if not found. */
export async function getProgramWithUniversity(
  programId: number,
): Promise<{ program: Program; university: University } | null> {
  if (MOCK_DATA) {
    const program = MOCK_PROGRAMS.find((p) => p.id === programId);
    if (!program) return null;
    const university = MOCK_UNIVERSITIES.find(
      (u) => u.id === program.university_id,
    );
    return university ? { program, university } : null;
  }
  try {
    const supabase = createPublicClient();
    const { data: program, error } = await supabase
      .from("programs")
      .select("*")
      .eq("id", programId)
      .maybeSingle();
    if (error) throw error;
    if (!program) return null;
    const { data: university, error: uniError } = await supabase
      .from("universities")
      .select("*")
      .eq("id", program.university_id)
      .maybeSingle();
    if (uniError) {
      // eslint-disable-next-line no-console
      console.error(
        `[data] getProgramWithUniversity(${programId}) university query failed.`,
        uniError,
      );
      captureException(uniError, {
        where: "getProgramWithUniversity.university",
      });
    }
    return university ? { program, university } : null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      `[data] getProgramWithUniversity(${programId}) failed.`,
      error,
    );
    captureException(error, { where: "getProgramWithUniversity" });
    return null;
  }
}
