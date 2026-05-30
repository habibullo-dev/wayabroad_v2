import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/db/database.types";
import { publicEnv } from "@/lib/env";
import { serverEnv } from "@/lib/env.server";

/**
 * Anon-key Supabase client for server-side reads of public, RLS-protected reference data
 * (universities/programs/admission_records). It does NOT carry a user session — the
 * cookie-based per-request auth client (which enforces own-data RLS) lands in M2.
 */
export function createPublicClient() {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const anon = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("Supabase public env (URL + anon key) is not configured.");
  }
  return createClient<Database>(url, anon, {
    auth: { persistSession: false },
  });
}

/**
 * Service-role client — BYPASSES RLS. Server-only (the `server-only` import guarantees it
 * can never reach the browser). Use only for trusted admin tasks and the seed script.
 */
export function createServiceClient() {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const key = serverEnv.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase service-role env (URL + service key) is not configured.",
    );
  }
  return createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
}
