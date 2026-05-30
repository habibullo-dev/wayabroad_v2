"use client";

import { type ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Sparkles } from "lucide-react";

import { ProbabilityCard } from "@/components/probability/probability-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { AnalyticsEvent, track } from "@/lib/analytics/posthog";
import {
  runProbabilityCheck,
  type CheckState,
} from "@/lib/probability/actions";
import { GPA_SCALES, LANGUAGE_TESTS } from "@/lib/profile/constants";

type UniOpt = { id: number; name: string };
type ProgOpt = {
  id: number;
  name: string;
  university_id: number;
  degree_level: string | null;
};

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && (
        <p id={`${htmlFor}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <Loader2 className="animate-spin" aria-hidden />
      ) : (
        <Sparkles aria-hidden />
      )}
      See my chance
    </Button>
  );
}

const initialState: CheckState = {};

export function FreeCheckForm({
  universities,
  programs,
}: {
  universities: UniOpt[];
  programs: ProgOpt[];
}) {
  const [state, formAction] = useFormState(runProbabilityCheck, initialState);
  const [uniId, setUniId] = useState<number>(universities[0]?.id ?? 0);
  const programsForUni = programs.filter((p) => p.university_id === uniId);

  useEffect(() => {
    track(AnalyticsEvent.FreeCheckStarted);
  }, []);
  useEffect(() => {
    if (state.result) {
      track(AnalyticsEvent.FreeCheckCompleted, {
        percent: state.result.percent,
      });
    }
  }, [state.result]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form action={formAction} className="flex flex-col gap-4">
        {state.error && (
          <p
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {state.error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="GPA" htmlFor="gpa">
            <Input
              id="gpa"
              name="gpa"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              max="5"
              placeholder="3.6"
              required
            />
          </Field>
          <Field label="GPA scale" htmlFor="gpa_scale">
            <NativeSelect id="gpa_scale" name="gpa_scale" defaultValue="4.0">
              {GPA_SCALES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </NativeSelect>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Language test" htmlFor="language_test">
            <NativeSelect
              id="language_test"
              name="language_test"
              defaultValue="None"
            >
              {LANGUAGE_TESTS.map((t) => (
                <option key={t} value={t}>
                  {t === "None" ? "None / not yet" : t}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field
            label="Score"
            htmlFor="language_score"
            hint="IELTS 0–9 · TOEFL 0–120 · TOPIK 1–6"
          >
            <Input
              id="language_score"
              name="language_score"
              type="number"
              inputMode="decimal"
              step="0.5"
              min="0"
              placeholder="6.5"
              aria-describedby="language_score-hint"
            />
          </Field>
        </div>

        <Field label="Target university" htmlFor="university">
          <NativeSelect
            id="university"
            value={String(uniId)}
            onChange={(e) => setUniId(Number(e.target.value))}
          >
            {universities.map((u) => (
              <option key={u.id} value={String(u.id)}>
                {u.name}
              </option>
            ))}
          </NativeSelect>
        </Field>

        <Field label="Target program" htmlFor="programId">
          <NativeSelect id="programId" name="programId" key={uniId}>
            {programsForUni.map((p) => (
              <option key={p.id} value={String(p.id)}>
                {p.name}
                {p.degree_level ? ` (${p.degree_level})` : ""}
              </option>
            ))}
          </NativeSelect>
        </Field>

        <SubmitButton />
        <p className="text-xs text-muted-foreground">
          No sign-up needed — we don&rsquo;t store anything you enter here.
        </p>
      </form>

      <div role="status" aria-live="polite">
        {state.result ? (
          <div className="flex flex-col gap-4">
            <ProbabilityCard
              result={state.result}
              programName={state.programName}
            />
            <Card className="flex flex-col items-start gap-2 bg-secondary/50 p-5">
              <p className="text-sm font-medium">
                Want this for every matching program, ranked?
              </p>
              <Button asChild>
                <Link href="/signup">Create a free account</Link>
              </Button>
            </Card>
          </div>
        ) : (
          <Card className="flex h-full flex-col items-center justify-center gap-2 p-10 text-center text-muted-foreground">
            <Sparkles className="size-6 text-primary" aria-hidden />
            <p className="text-sm">
              Fill in your profile and pick a target program to see an
              explainable admission chance — with the factors and a confidence
              band behind it.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
