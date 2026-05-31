import type { Metadata } from "next";
import Link from "next/link";
import { Check, Circle, GraduationCap } from "lucide-react";

import { ApplicationCard } from "@/components/applications/application-card";
import { ProgramCard } from "@/components/shortlist/program-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDashboard } from "@/lib/dashboard/data";
import { getRankedMatches } from "@/lib/matching/ranked";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Your dashboard" };

export default async function DashboardPage() {
  const {
    email,
    student,
    applications,
    profileComplete,
    hasDocuments,
    hasSubmitted,
  } = await getDashboard();

  const { matches: topMatches } =
    profileComplete && student
      ? await getRankedMatches(student, { limit: 3 })
      : { matches: [] };

  const firstName = student?.full_name?.trim().split(/\s+/)[0];

  const steps = [
    { label: "Create your account", href: undefined, done: true },
    {
      label: "Complete your profile",
      href: "/onboarding",
      done: profileComplete,
    },
    {
      label: "Start an application",
      href: "/shortlist",
      done: applications.length > 0,
    },
    {
      label: "Draft your documents",
      href: "/applications",
      done: hasDocuments,
    },
    {
      label: "Submit for review",
      href: "/applications",
      done: hasSubmitted,
    },
  ];
  const doneCount = steps.filter((s) => s.done).length;
  const nextStep = steps.find((s) => !s.done);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Mission control
        </p>
        <h1 className="mt-1.5 font-display text-3xl font-semibold tracking-tight">
          {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {hasSubmitted
            ? "Track your applications as they move through review."
            : "Here's the path from profile to a submitted application."}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Journey checklist */}
        <Card className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">Your journey</h2>
            <Badge variant={doneCount === steps.length ? "success" : "muted"}>
              {doneCount}/{steps.length} done
            </Badge>
          </div>
          <ol className="flex flex-col gap-1">
            {steps.map((step) => {
              const isNext = step === nextStep;
              const content = (
                <>
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full border transition-colors",
                      step.done
                        ? "border-success/30 bg-success/15 text-success"
                        : isNext
                          ? "border-primary text-primary"
                          : "border-border text-muted-foreground",
                    )}
                  >
                    {step.done ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Circle className="size-2 fill-current" />
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      step.done
                        ? "text-muted-foreground line-through decoration-success/40"
                        : isNext
                          ? "font-medium text-foreground"
                          : "text-foreground",
                    )}
                  >
                    {step.label}
                  </span>
                  {isNext && (
                    <Badge variant="default" className="ml-auto">
                      Next
                    </Badge>
                  )}
                </>
              );
              return (
                <li key={step.label}>
                  {step.href && !step.done ? (
                    <Link
                      href={step.href}
                      className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {content}
                    </Link>
                  ) : (
                    <span className="flex items-center gap-3 px-2 py-2">
                      {content}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          {nextStep?.href && (
            <Button asChild size="sm" className="self-start">
              <Link href={nextStep.href}>{`Continue: ${nextStep.label}`}</Link>
            </Button>
          )}
        </Card>

        {/* Profile snapshot */}
        <Card className="flex flex-col gap-3 p-6">
          <h2 className="font-display text-lg font-semibold">Your profile</h2>
          {profileComplete ? (
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Field</dt>
                <dd className="text-right font-medium">
                  {student?.intended_field}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Degree</dt>
                <dd className="text-right font-medium">
                  {student?.intended_degree ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">GPA</dt>
                <dd className="text-right font-medium">
                  {student?.gpa}
                  {student?.gpa_scale ? ` / ${student.gpa_scale}` : ""}
                </dd>
              </div>
              {student?.country && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Country</dt>
                  <dd className="text-right font-medium">{student.country}</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              Complete your profile to unlock your ranked shortlist.
            </p>
          )}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="mt-1 self-start"
          >
            <Link href="/onboarding">
              {profileComplete ? "Edit profile" : "Complete profile"}
            </Link>
          </Button>
          {email && (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {email}
            </p>
          )}
        </Card>
      </div>

      {/* Top matches preview */}
      {topMatches.length > 0 && (
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold">Top matches</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/shortlist">See all matches</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topMatches.map((m) => (
              <ProgramCard
                key={m.match.program.id}
                match={m.match}
                probability={m.probability}
              />
            ))}
          </div>
        </section>
      )}

      {/* Applications */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold">
            Your applications
          </h2>
          {applications.length > 0 && (
            <Button asChild variant="ghost" size="sm">
              <Link href="/applications">View all</Link>
            </Button>
          )}
        </div>

        {applications.length === 0 ? (
          <Card className="flex flex-col items-center gap-3 p-10 text-center">
            <GraduationCap className="size-6 text-primary" aria-hidden />
            <p className="text-muted-foreground">
              No applications yet. Pick a program from your shortlist to begin.
            </p>
            <Button asChild>
              <Link href="/shortlist">Go to shortlist</Link>
            </Button>
          </Card>
        ) : (
          <ul className="grid gap-4">
            {applications.map((summary) => (
              <li key={summary.application.id}>
                <ApplicationCard summary={summary} showTimeline />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
