"use client";

import { useFormStatus } from "react-dom";
import { CheckCircle2, Loader2, Send, Sparkles } from "lucide-react";

import {
  advanceApplicationStatus,
  submitApplication,
} from "@/lib/applications/actions";
import {
  nextStatus,
  STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/applications/status";
import { Button } from "@/components/ui/button";

function PendingButton({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" aria-hidden /> : icon}
      {label}
    </Button>
  );
}

/**
 * Status controls for one application. The student submits a draft; after that the
 * progression is a clearly-labeled *simulated* admin step for the demo (no real
 * admissions office is wired up).
 */
export function StatusActions({
  applicationId,
  status,
}: {
  applicationId: string;
  status: string;
}) {
  if (status === "draft") {
    return (
      <form action={submitApplication} className="flex flex-col gap-2">
        <input type="hidden" name="applicationId" value={applicationId} />
        <PendingButton label="Submit application" icon={<Send aria-hidden />} />
        <p className="text-xs text-muted-foreground">
          Submitting moves this application into review.
        </p>
      </form>
    );
  }

  if (status === "decision") {
    return (
      <p className="inline-flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
        <CheckCircle2 className="size-4" aria-hidden />
        Decision received — this is the final stage.
      </p>
    );
  }

  const next = nextStatus(status) as ApplicationStatus | null;
  if (!next) return null;

  return (
    <form action={advanceApplicationStatus} className="flex flex-col gap-2">
      <input type="hidden" name="applicationId" value={applicationId} />
      <PendingButton
        label={`Advance to ${STATUS_LABELS[next]}`}
        icon={<Sparkles aria-hidden />}
      />
      <p className="text-xs text-muted-foreground">
        Simulated admin step — for the demo, advances the status as a real
        review would.
      </p>
    </form>
  );
}
