import type { Metadata } from "next";
import Link from "next/link";

import { ProgramCard } from "@/components/shortlist/program-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/user";
import { getPrograms, getUniversities } from "@/lib/data/universities";
import { rankPrograms, type MatchProfile } from "@/lib/matching/shortlist";
import { normalizeGpaTo4 } from "@/lib/profile/constants";
import { getAdmissionRecordsByProgram } from "@/lib/data/admissions";
import {
  toAdmissionRecords,
  toProgramInfo,
  toStudentProfile,
} from "@/lib/probability/adapter";
import { scoreAdmission } from "@/lib/probability/score";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Your shortlist" };

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
            Let&rsquo;s build your shortlist
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

  const [unis, progs] = await Promise.all([getUniversities(), getPrograms()]);
  const byId = new Map(unis.data.map((u) => [u.id, u]));
  const profile: MatchProfile = {
    gpa4: normalizeGpaTo4(student.gpa, student.gpa_scale),
    languageTest: student.language_test,
    languageScore: student.language_score,
    budgetUsd: student.budget_usd,
    field: student.intended_field,
    degree: student.intended_degree,
  };
  const matches = rankPrograms(profile, progs.data, byId);
  const isLive = unis.source === "live" && progs.source === "live";

  // Admission-probability per shortlisted program (blends synthetic admission_records).
  const recordsByProgram = await getAdmissionRecordsByProgram(
    matches.map((m) => m.program.id),
  );
  const studentProfile = toStudentProfile({
    gpa: student.gpa,
    gpaScale: student.gpa_scale ?? 4,
    languageTest: student.language_test,
    languageScore: student.language_score,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Your shortlist
          </h1>
          <p className="mt-1 text-muted-foreground">
            {matches.length} {student.intended_degree} programs ranked for your
            profile ·{" "}
            <Link href="/onboarding" className="text-primary hover:underline">
              edit profile
            </Link>
          </p>
        </div>
        <Badge variant={isLive ? "success" : "warning"}>
          {isLive ? "Live data" : "Sample data"}
        </Badge>
      </header>
      <p className="mb-6 text-sm text-muted-foreground">
        Match scores estimate fit from your profile. Costs are estimates —
        verify with each university. Full admission-probability scores arrive in
        M3.
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((m) => (
            <ProgramCard
              key={m.program.id}
              match={m}
              probability={scoreAdmission(
                studentProfile,
                toProgramInfo(m.program, m.university),
                toAdmissionRecords(recordsByProgram.get(m.program.id) ?? []),
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
