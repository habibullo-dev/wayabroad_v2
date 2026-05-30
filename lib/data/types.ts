import type { Tables } from "@/lib/db/database.types";

// Domain row types, sourced from the generated Supabase types so they never drift.
export type University = Tables<"universities">;
export type Program = Tables<"programs">;
export type AdmissionRecord = Tables<"admission_records">;
export type Student = Tables<"students">;
export type Application = Tables<"applications">;
export type DocumentRow = Tables<"documents">;

export type UniversityWithPrograms = University & { programs: Program[] };

/** Where a piece of data came from — drives the "sample data" UI indicator. */
export type DataSource = "live" | "mock";

export interface DataResult<T> {
  data: T;
  source: DataSource;
}
