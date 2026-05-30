import "server-only";

import { cache } from "react";

import { IS_SUPABASE_CONFIGURED } from "@/lib/env";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * The signed-in user, or null (also null in mock mode / on any auth error).
 * Wrapped in React `cache` so multiple callers in one request (layout + header) share a
 * single validated `getUser()` round-trip.
 */
export const getCurrentUser = cache(async () => {
  if (!IS_SUPABASE_CONFIGURED) return null;
  try {
    const supabase = createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
});
