import type { Metadata } from "next";

import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { getCurrentUser } from "@/lib/auth/user";
import type { Student } from "@/lib/data/types";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Your profile" };

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  let initial: Student | null = null;
  if (user) {
    const supabase = createServerSupabase();
    const { data } = await supabase
      .from("students")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    initial = data;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Your profile
        </h1>
        <p className="mt-2 text-pretty text-muted-foreground">
          This drives your ranked shortlist and admission-probability scores.
          You can update it anytime.
        </p>
      </header>
      <OnboardingForm initial={initial} />
    </div>
  );
}
