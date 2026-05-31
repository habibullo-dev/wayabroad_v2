import Link from "next/link";
import { FileText } from "lucide-react";

import { StatusTimeline } from "@/components/applications/status-timeline";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/applications/status";
import type { ApplicationSummary } from "@/lib/documents/data";

/**
 * One application as a card, shared by the dashboard and the applications list.
 * `showTimeline` renders the 5-stage status timeline (dashboard); otherwise a compact
 * status badge + "open documents" affordance (list).
 */
export function ApplicationCard({
  summary,
  showTimeline = false,
  headingLevel = "h3",
}: {
  summary: ApplicationSummary;
  showTimeline?: boolean;
  /** Keep the heading hierarchy correct per context (h2 directly under a page h1). */
  headingLevel?: "h2" | "h3";
}) {
  const { application, program, university } = summary;
  const Heading = headingLevel;
  const statusLabel =
    STATUS_LABELS[application.status as ApplicationStatus] ??
    application.status.replace(/_/g, " ");

  return (
    <Link
      href={`/applications/${application.id}`}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="flex h-full flex-col gap-4 p-5 transition-colors group-hover:border-primary/40">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Heading className="font-display text-lg font-semibold leading-tight">
              {program.name}
            </Heading>
            <p className="text-sm text-muted-foreground">
              {university.name} · {program.degree_level}
            </p>
          </div>
          {showTimeline ? (
            <FileText
              className="size-5 shrink-0 text-muted-foreground"
              aria-hidden
            />
          ) : (
            <Badge variant="secondary">{statusLabel}</Badge>
          )}
        </div>

        {showTimeline ? (
          <StatusTimeline status={application.status} />
        ) : (
          <p className="mt-auto pt-1 text-sm font-medium text-primary">
            Open documents →
          </p>
        )}
      </Card>
    </Link>
  );
}
