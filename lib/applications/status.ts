export const APPLICATION_STAGES = [
  "draft",
  "submitted",
  "under_review",
  "interview",
  "decision",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STAGES)[number];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
  interview: "Interview",
  decision: "Decision",
};

export function statusIndex(status: string): number {
  const i = (APPLICATION_STAGES as readonly string[]).indexOf(status);
  return i < 0 ? 0 : i;
}

/** The next stage after `status`, or null if already at the final stage. */
export function nextStatus(status: string): ApplicationStatus | null {
  const i = statusIndex(status);
  return i < APPLICATION_STAGES.length - 1 ? APPLICATION_STAGES[i + 1]! : null;
}
