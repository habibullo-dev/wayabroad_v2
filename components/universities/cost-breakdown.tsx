import { BadgeCheck, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Note } from "@/components/ui/note";
import { COST_ESTIMATE_NOTE, KRW_PER_USD } from "@/lib/config";
import type { University } from "@/lib/data/types";
import { fieldTrust, getVerified, type TrustLevel } from "@/lib/data/verified";
import { formatKrw, formatUsd } from "@/lib/format";

function midpoint(a: number | null, b: number | null): number | null {
  if (a != null && b != null) return (a + b) / 2;
  return a ?? b ?? null;
}

function sum(values: (number | null)[]): number | null {
  const present = values.filter((v): v is number => v != null);
  if (present.length === 0) return null;
  return present.reduce((acc, v) => acc + v, 0);
}

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
  const verified = getVerified(university);
  const vt = verified?.tuition_ug ?? null;
  const tuitionTrust: TrustLevel = vt ? fieldTrust(vt.status) : "none";

  // Prefer the verified tuition figure (already per-year USD) when present; else the
  // seed estimate (per-semester USD × 2). Living is monthly → ×12; dorm per-semester → ×2.
  const estTuitionYear = (() => {
    const semester = midpoint(
      university.tuition_ug_usd_min,
      university.tuition_ug_usd_max,
    );
    return semester != null ? semester * 2 : null;
  })();
  // Only let the overlay drive the row when it's actually displayable (verified/estimate).
  // A `pending` (or figure-less) overlay falls back to the existing estimate columns —
  // the methodology's hard rule: never show an unverified number as fact.
  const useVerifiedTuition =
    tuitionTrust !== "none" && vt?.usd_per_year != null;
  const shownTrust: TrustLevel = useVerifiedTuition ? tuitionTrust : "none";
  const tuitionYear = useVerifiedTuition ? vt!.usd_per_year : estTuitionYear;
  const tuitionIsWaiver = useVerifiedTuition && tuitionYear === 0;

  // Dorm + living prefer a validated overlay figure (with its source); else the seed columns.
  const vd = verified?.dorm ?? null;
  const useVd =
    !!vd && fieldTrust(vd.status) !== "none" && vd.krw_per_semester != null;
  const dormYear = useVd
    ? Math.round((vd!.krw_per_semester! * 2) / KRW_PER_USD)
    : university.dorm_usd_per_semester != null
      ? university.dorm_usd_per_semester * 2
      : null;

  const vl = verified?.living ?? null;
  const useVl =
    !!vl && fieldTrust(vl.status) !== "none" && vl.usd_per_month != null;
  const livingYear = useVl
    ? vl!.usd_per_month! * 12
    : university.living_usd_per_month != null
      ? university.living_usd_per_month * 12
      : null;

  const krwRange =
    useVerifiedTuition &&
    vt!.krw_min != null &&
    vt!.krw_max != null &&
    vt!.krw_max > 0
      ? vt!.krw_min === vt!.krw_max
        ? `${formatKrw(vt!.krw_min)} / semester`
        : `${formatKrw(vt!.krw_min)}–${formatKrw(vt!.krw_max)} / semester`
      : null;
  const sourceUrl = useVerifiedTuition ? vt!.source_url : null;
  const verifiedOn = useVerifiedTuition ? vt!.verified_on : null;

  const tuitionDisplay = tuitionIsWaiver ? "Free" : formatUsd(tuitionYear);

  const yearlyTotal = sum([tuitionYear, dormYear, livingYear]);

  const otherRows = [
    {
      label: "Dorm",
      note: "on-campus, per year",
      value: dormYear,
      source: useVd ? vd!.source_url : null,
    },
    {
      label: "Living",
      note: "food, transport, etc.",
      value: livingYear,
      source: useVl ? vl!.source_url : null,
    },
    {
      label: "Visa",
      note: "D-2, one-time",
      value: university.visa_cost_usd,
      source: null,
    },
  ];

  // Any AI-validated overlay figures on this card? (drives the footnote)
  const aiValidated = verified?.validated_via != null;

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
          {verified?.validated_on ? ` on ${verified.validated_on}` : ""} — shown
          as estimates with their sources; always confirm with the university.
        </p>
      )}
    </Card>
  );
}
