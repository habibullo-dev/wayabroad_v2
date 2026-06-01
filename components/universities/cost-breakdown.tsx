import { BadgeCheck, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Note } from "@/components/ui/note";
import { COST_ESTIMATE_NOTE } from "@/lib/config";
import { yearlyCostUsd } from "@/lib/data/cost";
import type { University } from "@/lib/data/types";
import { type TrustLevel } from "@/lib/data/verified";
import { formatUsd } from "@/lib/format";

function TrustChip({ level }: { level: TrustLevel }) {
  if (level === "verified") {
    return (
      <Badge variant="success">
        <BadgeCheck aria-hidden />
        Verified
      </Badge>
    );
  }
  if (level === "estimate") {
    return <Badge variant="warning">Estimate</Badge>;
  }
  return null;
}

export function CostBreakdown({ university }: { university: University }) {
  // Single source of truth — the shortlist/dashboard cards render the same total (lib/data/cost.ts).
  const c = yearlyCostUsd(university);
  const shownTrust: TrustLevel = c.tuitionTrust;
  const krwRange = c.krwRange;
  const sourceUrl = c.tuitionSourceUrl;
  const verifiedOn = c.verifiedOn;
  const tuitionIsWaiver = c.tuitionIsWaiver;
  const useVerifiedTuition = c.tuitionTrust !== "none";

  const tuitionDisplay = tuitionIsWaiver ? "Free" : formatUsd(c.tuitionYear);
  const yearlyTotal = c.total;

  const otherRows = [
    {
      label: "Dorm",
      note: "on-campus, per year",
      value: c.dormYear,
      source: c.dormSourceUrl,
    },
    {
      label: "Living",
      note: "food, transport, etc.",
      value: c.livingYear,
      source: c.livingSourceUrl,
    },
    {
      label: "Visa",
      note: "D-2, one-time",
      value: c.visa,
      source: null,
    },
  ];

  // Any AI-validated overlay figures on this card? (drives the footnote)
  const aiValidated = c.aiValidated;

  return (
    <Card className="p-6">
      <h2 className="font-display text-lg font-semibold">Estimated costs</h2>
      <dl className="mt-4 divide-y">
        {/* Tuition — provenance-aware */}
        <div className="flex flex-col gap-1 py-2.5">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="flex items-center gap-2 text-sm">
              <span className="font-medium">Tuition</span>
              <span className="text-xs text-muted-foreground">
                {useVerifiedTuition ? "international UG" : "per year"}
              </span>
              <TrustChip level={shownTrust} />
            </dt>
            <dd className="font-display text-base font-semibold tabular-nums">
              {tuitionDisplay}
            </dd>
          </div>
          {(krwRange || sourceUrl) && (
            <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
              {tuitionIsWaiver ? (
                <span>Full waiver for admitted international students</span>
              ) : (
                krwRange && <span className="tabular-nums">{krwRange}</span>
              )}
              {sourceUrl && (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  source
                  <ExternalLink className="size-3" aria-hidden />
                </a>
              )}
              {verifiedOn && shownTrust === "verified" && (
                <span>· verified {verifiedOn}</span>
              )}
            </p>
          )}
        </div>

        {otherRows.map((row) => (
          <div key={row.label} className="flex flex-col gap-1 py-2.5">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-sm">
                <span className="font-medium">{row.label}</span>{" "}
                <span className="text-xs text-muted-foreground">
                  {row.note}
                </span>
              </dt>
              <dd className="font-display text-base font-semibold tabular-nums">
                {formatUsd(row.value)}
              </dd>
            </div>
            {row.source && (
              <a
                href={row.source}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-0.5 text-xs text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                source
                <ExternalLink className="size-3" aria-hidden />
              </a>
            )}
          </div>
        ))}

        <div className="flex items-baseline justify-between gap-4 pt-3">
          <dt className="text-sm font-semibold">Yearly total (excl. visa)</dt>
          <dd className="font-display text-lg font-semibold tabular-nums text-primary">
            {formatUsd(yearlyTotal)}
          </dd>
        </div>
      </dl>

      {shownTrust === "verified" ? (
        <Note variant="verified" className="mt-4">
          Tuition is verified from the university&rsquo;s official source. Dorm,
          living and visa are estimates — verify with the university.
        </Note>
      ) : (
        <Note variant="estimate" className="mt-4">
          {shownTrust === "estimate"
            ? "Tuition is a multi-source estimate — confirm the current figure with the university. Dorm, living and visa are estimates too."
            : COST_ESTIMATE_NOTE}
        </Note>
      )}

      {aiValidated && (
        <p className="mt-2 text-xs text-muted-foreground">
          Some figures were validated via web search
          {c.validatedOn ? ` on ${c.validatedOn}` : ""} — shown
          as estimates with their sources; always confirm with the university.
        </p>
      )}
    </Card>
  );
}
