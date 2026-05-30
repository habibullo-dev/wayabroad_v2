import type { Metadata } from "next";
import Link from "next/link";
import { Check, Circle, FileText, GraduationCap } from "lucide-react";

import { StatusTimeline } from "@/components/applications/status-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDashboard } from "@/lib/dashboard/data";
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
        <p className="text-sm text-muted-foreground">Mission control</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
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
            <Badge variant="muted">{doneCount}/5 done</Badge>
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
            {applications.map(({ application, program, university }) => (
              <li key={application.id}>
                <Link
                  href={`/applications/${application.id}`}
                  className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Card className="flex flex-col gap-4 p-5 transition-colors group-hover:border-primary/40">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-lg font-semibold leading-tight">
                          {program.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {university.name} · {program.degree_level}
                        </p>
                      </div>
                      <FileText
                        className="size-5 shrink-0 text-muted-foreground"
                        aria-hidden
                      />
                    </div>
                    <StatusTimeline status={application.status} />
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
