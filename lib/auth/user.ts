import "server-only";

import { IS_SUPABASE_CONFIGURED } from "@/lib/env";
import { createServerSupabase } from "@/lib/supabase/server";

/** The signed-in user, or null (also null in mock mode / on any auth error). */
export async function getCurrentUser() {
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
}
