import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { MatchesExplorer } from "@/components/shortlist/matches-explorer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataBadge } from "@/components/ui/data-badge";
import { getCurrentUser } from "@/lib/auth/user";
import { getRankedMatches } from "@/lib/matching/ranked";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Your matches" };

export default async function ShortlistPage() {
  const user = await getCurrentUser();
  const supabase = createServerSupabase();
  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("id", user!.id)
    .maybeSingle();

  if (!student || student.gpa == null || !student.intended_field) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Card className="flex flex-col items-center gap-4 p-10 text-center">
          <h1 className="font-display text-2xl font-semibold">
            Let&rsquo;s find your matches
          </h1>
          <p className="text-muted-foreground">
            Complete your profile and we&rsquo;ll rank matching Korean programs
            for you.
          </p>
          <Button asChild size="lg">
            <Link href="/onboarding">Complete your profile</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const { matches, isLive } = await getRankedMatches(student);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Your matches
          </h1>
          <p className="mt-1 text-muted-foreground">
            {matches.length} {student.intended_degree} programs ranked for your
            profile ·{" "}
            <Link href="/onboarding" className="text-primary hover:underline">
              edit profile
            </Link>
          </p>
        </div>
        <DataBadge live={isLive} />
      </header>
      <p className="mb-6 text-sm text-muted-foreground">
        Match scores estimate fit from your profile; the chance estimate uses
        program selectivity and your academic/language fit. Costs are estimates
        — verify with each university.
      </p>

      {matches.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground">
          No matching programs found. Try broadening your field or degree on
          your{" "}
          <Link href="/onboarding" className="text-primary hover:underline">
            profile
          </Link>
          .
        </Card>
      ) : (
        <Suspense fallback={null}>
          <MatchesExplorer matches={matches} />
        </Suspense>
      )}
    </div>
  );
}
