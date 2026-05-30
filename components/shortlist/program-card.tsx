import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { MatchBadge } from "@/components/shortlist/match-badge";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatUsd } from "@/lib/format";
import type { ProgramMatch } from "@/lib/matching/shortlist";

export function ProgramCard({ match }: { match: ProgramMatch }) {
  const { program, university, estAnnualCostUsd, reasons } = match;

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold leading-tight">
            {program.name}
          </h3>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {university.name} · {program.degree_level}
          </p>
        </div>
        <MatchBadge level={match.level} score={match.score} />
      </div>

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

      {reasons.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {reasons.map((r) => (
            <li key={r}>
              <Badge variant="outline">{r}</Badge>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex items-end justify-between gap-3 border-t pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Est. yearly cost</p>
          <p className="font-display text-lg font-semibold tabular-nums">
            {formatUsd(estAnnualCostUsd)}
          </p>
        </div>
        <Link
          href={`/universities/${university.slug}`}
          className="inline-flex items-center gap-1 rounded-md text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Details
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </Card>
  );
}
