import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/db/database.types";
import { publicEnv } from "@/lib/env";

/**
 * Browser Supabase client (anon key). Carries the user's session via cookies, so RLS
 * applies. Use inside client components for auth actions / realtime.
 */
export function createBrowserSupabase() {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const anon = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("Supabase public env (URL + anon key) is not configured.");
  }
  return createBrowserClient<Database>(url, anon);
}
