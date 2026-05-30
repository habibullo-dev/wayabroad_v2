/**
 * Idempotent seed: loads the flat JSON in database/ and upserts the reference tables.
 * Runs ONLY when Supabase service-role credentials are present (it bypasses RLS).
 *
 *   pnpm seed
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env (or .env.local).
 * Upserts on primary key: re-running is safe and refreshes existing rows, but it is additive
 * — it does NOT delete rows that were removed from the JSON.
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "../lib/db/database.types";

type Tables = Database["public"]["Tables"];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "[seed] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "       Set them in .env (or .env.local) before seeding. Nothing was written.",
  );
  process.exit(1);
}

const supabase = createClient<Database>(url, serviceKey, {
  auth: { persistSession: false },
});

// `url` is narrowed to string by the guard above; capture the host for the seed log.
const targetHost = new URL(url).host;

const dataDir = join(process.cwd(), "database");

function load<T>(file: string): T[] {
  return JSON.parse(readFileSync(join(dataDir, file), "utf8")) as T[];
}

async function chunkedUpsert<T>(
  label: string,
  rows: T[],
  upsert: (batch: T[]) => PromiseLike<{ error: { message: string } | null }>,
  chunkSize = 500,
): Promise<void> {
  for (let i = 0; i < rows.length; i += chunkSize) {
    const batch = rows.slice(i, i + chunkSize);
    const { error } = await upsert(batch);
    if (error) {
      throw new Error(`${label} upsert failed at row ${i}: ${error.message}`);
    }
  }
  console.log(`[seed] ${label}: ${rows.length} rows upserted`);
}

async function main(): Promise<void> {
  const universities = load<Tables["universities"]["Insert"]>(
    "universities_flat.json",
  );
  const programs = load<Tables["programs"]["Insert"]>("programs_flat.json");
  const admissionRecords = load<Tables["admission_records"]["Insert"]>(
    "admission_records_flat.json",
  );

  // Show the target host (not the key) so the operator can confirm the environment.
  console.log(`[seed] target: ${targetHost}`);
  console.log("[seed] seeding reference data (idempotent upserts)…");
  // Order matters: programs FK -> universities, admission_records FK -> programs.
  await chunkedUpsert("universities", universities, (batch) =>
    supabase.from("universities").upsert(batch, { onConflict: "id" }),
  );
  await chunkedUpsert("programs", programs, (batch) =>
    supabase.from("programs").upsert(batch, { onConflict: "id" }),
  );
  await chunkedUpsert("admission_records", admissionRecords, (batch) =>
    supabase.from("admission_records").upsert(batch, { onConflict: "id" }),
  );
  console.log("[seed] done.");
}

main().catch((error) => {
  console.error("[seed] failed:", error);
  process.exit(1);
});
