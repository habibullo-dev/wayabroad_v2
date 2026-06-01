import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  ChevronDown,
  MapPin,
  Minus,
} from "lucide-react";

import { MatchBadge } from "@/components/shortlist/match-badge";
import { UniversityLogo } from "@/components/universities/university-logo";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { Card } from "@/components/ui/card";
import { startApplication } from "@/lib/applications/actions";
import { yearlyCostUsd } from "@/lib/data/cost";
import { formatUsd } from "@/lib/format";
import type { ProgramMatch } from "@/lib/matching/shortlist";
import type { Driver, ProbabilityResult } from "@/lib/probability/score";
import { cn } from "@/lib/utils";

// One clear read: a Safe / Match / Reach category, colored.
const CATEGORY: Record<
  ProbabilityResult["category"],
  { label: string; variant: "success" | "accent" | "warning" }
> = {
  safety: { label: "Safety", variant: "success" },
  match: { label: "Match", variant: "accent" },
  reach: { label: "Reach", variant: "warning" },
};

const IMPACT_ICON: Record<Driver["impact"], typeof Minus> = {
  positive: ArrowUpRight,
  negative: ArrowDownRight,
  neutral: Minus,
};
const IMPACT_COLOR: Record<Driver["impact"], string> = {
  positive: "text-success",
  negative: "text-destructive",
  neutral: "text-muted-foreground",
};

export function ProgramCard({
  match,
  probability,
}: {
  match: ProgramMatch;
  probability?: ProbabilityResult;
}) {
  const { program, university } = match;
  // Same verified-preferring figure the university detail page shows — never a contradictory number.
  const cost = yearlyCostUsd(university);
  const cat = probability ? CATEGORY[probability.category] : null;

  return (
    <Card className="group flex h-full flex-col gap-4 p-5 transition-colors hover:border-primary/40">
      <div className="flex items-start gap-3">
        <UniversityLogo
          slug={university.slug}
          name={university.name}
          className="size-11"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold leading-tight">
            {program.name}
          </h3>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {university.name} · {program.degree_level}
          </p>
        </div>
      </div>

      {probability && cat ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p
                className={cn(
                  "font-display text-2xl font-semibold leading-none tabular-nums",
                  probability.eligible
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                {probability.band[0]}–{probability.band[1]}
                <span className="text-lg">%</span>
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                likely admission range
              </p>
            </div>
            <Badge variant={cat.variant}>{cat.label}</Badge>
          </div>

          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-secondary"
            aria-hidden
          >
            <div
              className="h-full rounded-full bg-primary/80"
              style={{ width: `${Math.max(4, Math.min(100, probability.percent))}%` }}
            />
          </div>

          <details className="group/why">
            <summary className="flex w-fit cursor-pointer list-none items-center gap-1 rounded text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              Why this score?
              <ChevronDown
                className="size-3.5 transition-transform duration-200 group-open/why:rotate-180"
                aria-hidden
              />
            </summary>
            <ul className="mt-2 flex flex-col gap-1.5">
              {probability.drivers.map((d, i) => {
                const Icon = IMPACT_ICON[d.impact];
                return (
                  <li key={i} className="flex gap-1.5 text-xs">
                    <Icon
                      aria-hidden
                      className={cn(
                        "mt-0.5 size-3.5 shrink-0",
                        IMPACT_COLOR[d.impact],
                      )}
                    />
                    <span>
                      <span className="font-medium">{d.factor}:</span>{" "}
                      <span className="text-muted-foreground">{d.detail}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              {probability.disclaimer}
            </p>
          </details>
        </div>
      ) : (
        <MatchBadge level={match.level} score={match.score} />
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {university.city && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" aria-hidden />
            {university.city}
          </span>
        )}
        {program.min_gpa_4_0_scale != null && (
          <span>Min GPA {program.min_gpa_4_0_scale}</span>
        )}
        {program.language_of_instruction && (
          <span>{program.language_of_instruction}-taught</span>
        )}
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 border-t pt-4">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            Est. yearly cost
            {cost.basis === "verified" && (
              <Badge variant="success">
                <BadgeCheck aria-hidden />
                Verified
              </Badge>
            )}
          </p>
          <p className="font-display text-lg font-semibold tabular-nums">
            {formatUsd(cost.total)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={`/universities/${university.slug}`}
            className="rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Details
          </Link>
          <form action={startApplication}>
            <input type="hidden" name="programId" value={program.id} />
            <SubmitButton size="sm" pendingText="Starting…">
              Apply
            </SubmitButton>
          </form>
        </div>
      </div>
    </Card>
  );
}
