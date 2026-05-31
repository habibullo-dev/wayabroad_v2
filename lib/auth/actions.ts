"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { APP_URL } from "@/lib/env";
import { createServerSupabase } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string };

const CALLBACK = `${APP_URL}/auth/callback`;

const emailSchema = z.string().trim().email().max(254);
// Supabase/bcrypt caps passwords at 72 bytes.
const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(72),
});
const signupSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72),
});

export async function signInWithEmail(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Enter a valid email and password." };

  const supabase = createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  // Generic message — don't disclose whether the account exists.
  if (error) return { error: "Invalid email or password. Please try again." };
  redirect("/dashboard");
}

export async function signUpWithEmail(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "Enter a valid email and password.",
    };
  }

  const supabase = createServerSupabase();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { emailRedirectTo: `${CALLBACK}?next=/onboarding` },
  });
  if (error) return { error: error.message };
  // If email confirmation is enabled, there's no session yet.
  if (!data.session) {
    return {
      message: "Check your email to confirm your account, then sign in.",
    };
  }
  redirect("/onboarding");
}

/** Form action: kicks off the Google OAuth flow. */
export async function signInWithGoogle(): Promise<void> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    // Land on the dashboard (the single home); it nudges new users to complete onboarding.
    options: { redirectTo: `${CALLBACK}?next=/dashboard` },
  });
  if (error || !data.url) redirect("/login?error=oauth");
  redirect(data.url);
}

export async function signOut(): Promise<void> {
  const supabase = createServerSupabase();
  await supabase.auth.signOut();
  redirect("/");
}
