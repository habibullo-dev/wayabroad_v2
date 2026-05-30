import { NextResponse } from "next/server";

import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Only allow same-origin relative redirects (must start with a single "/"), so a crafted
 * `next` can't turn the callback into an open redirect.
 */
function safeNext(next: string | null): string {
  if (
    !next ||
    !next.startsWith("/") ||
    next.startsWith("//") ||
    next.startsWith("/\\")
  ) {
    return "/onboarding";
  }
  return next;
}

/**
 * OAuth + email-confirmation callback. Exchanges the `code` for a session (cookies are set
 * here because route handlers have a mutable cookie context), then redirects to `next`.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (code) {
    const supabase = createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
