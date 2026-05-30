"use client";

import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import type { Student } from "@/lib/data/types";
import {
  DEGREES,
  FIELDS,
  GPA_SCALES,
  LANGUAGE_TESTS,
} from "@/lib/profile/constants";
import { saveProfile, type ProfileState } from "@/lib/profile/actions";

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
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const control =
    hintId && isValidElement(children)
      ? cloneElement(
          children as ReactElement<{ "aria-describedby"?: string }>,
          { "aria-describedby": hintId },
        )
      : children;
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {control}
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4 rounded-xl border bg-card p-6">
      <legend className="px-1 font-display text-sm font-semibold">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending && <Loader2 className="animate-spin" aria-hidden />}
      Save &amp; see my shortlist
    </Button>
  );
}

const initialState: ProfileState = {};

export function OnboardingForm({ initial }: { initial: Student | null }) {
  const [state, formAction] = useFormState(saveProfile, initialState);
  const scaleDefault =
    GPA_SCALES.find((s) => Number(s) === Number(initial?.gpa_scale)) ?? "4.0";

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      )}

      <Section title="About you">
        <Field label="Full name" htmlFor="full_name">
          <Input
            id="full_name"
            name="full_name"
            defaultValue={initial?.full_name ?? ""}
            placeholder="Your name"
            autoComplete="name"
          />
        </Field>
        <Field label="Country of citizenship" htmlFor="country">
          <Input
            id="country"
            name="country"
            defaultValue={initial?.country ?? ""}
            placeholder="e.g. Vietnam"
            autoComplete="country-name"
          />
        </Field>
      </Section>

      <Section title="Study goal">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Intended degree" htmlFor="intended_degree">
            <NativeSelect
              id="intended_degree"
              name="intended_degree"
              defaultValue={initial?.intended_degree ?? "Bachelor"}
            >
              {DEGREES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Intended field" htmlFor="intended_field">
            <NativeSelect
              id="intended_field"
              name="intended_field"
              defaultValue={initial?.intended_field ?? FIELDS[0]}
            >
              {FIELDS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </NativeSelect>
          </Field>
        </div>
      </Section>

      <Section title="Academics">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="GPA" htmlFor="gpa" hint="Your cumulative GPA.">
            <Input
              id="gpa"
              name="gpa"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              max="5"
              defaultValue={initial?.gpa ?? ""}
              placeholder="3.6"
              required
            />
          </Field>
          <Field label="GPA scale" htmlFor="gpa_scale">
            <NativeSelect
              id="gpa_scale"
              name="gpa_scale"
              defaultValue={scaleDefault}
            >
              {GPA_SCALES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </NativeSelect>
          </Field>
        </div>
      </Section>

      <Section title="Language">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Test" htmlFor="language_test">
            <NativeSelect
              id="language_test"
              name="language_test"
              defaultValue={initial?.language_test ?? "None"}
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
            hint="TOPIK 1–6 · IELTS 0–9 · TOEFL 0–120"
          >
            <Input
              id="language_score"
              name="language_score"
              type="number"
              inputMode="decimal"
              step="0.5"
              min="0"
              defaultValue={initial?.language_score ?? ""}
              placeholder="e.g. 6.5"
            />
          </Field>
        </div>
      </Section>

      <Section title="Budget">
        <Field
          label="Yearly budget (USD)"
          htmlFor="budget_usd"
          hint="Tuition + living, roughly. Used for cost-fit in your shortlist."
        >
          <Input
            id="budget_usd"
            name="budget_usd"
            type="number"
            inputMode="numeric"
            step="100"
            min="0"
            defaultValue={initial?.budget_usd ?? ""}
            placeholder="e.g. 15000"
          />
        </Field>
      </Section>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
