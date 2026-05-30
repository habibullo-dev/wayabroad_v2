import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SAMPLE_DATA_NOTE } from "@/lib/config";
import type { Driver, ProbabilityResult } from "@/lib/probability/score";
import { cn } from "@/lib/utils";

const CONFIDENCE: Record<
  ProbabilityResult["confidence"],
  { label: string; variant: "success" | "warning" | "muted" }
> = {
  high: { label: "High confidence", variant: "success" },
  moderate: { label: "Moderate confidence", variant: "warning" },
  low: { label: "Low confidence", variant: "muted" },
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

export function ProbabilityCard({
  result,
  programName,
}: {
  result: ProbabilityResult;
  programName?: string;
}) {
  const conf = CONFIDENCE[result.confidence];

  return (
    <Card className="p-6">
      {programName && (
        <p className="text-sm font-medium text-muted-foreground">
          {programName}
        </p>
      )}
      <div className="mt-1 flex items-end gap-2">
        <span
          className={cn(
            "font-display text-5xl font-semibold tabular-nums",
            result.eligible ? "text-primary" : "text-muted-foreground",
          )}
        >
          {result.percent}%
        </span>
        <span className="pb-1.5 text-sm text-muted-foreground">
          estimated chance
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Badge variant={conf.variant}>{conf.label}</Badge>
        <span className="text-sm tabular-nums text-muted-foreground">
          likely range {result.band[0]}–{result.band[1]}%
        </span>
        {!result.eligible && (
          <Badge variant="warning">
            {result.languageConfirmed
              ? "Below a requirement"
              : "Add a language test"}
          </Badge>
        )}
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold">Why this score</h3>
        <ul className="mt-2 flex flex-col gap-2">
          {result.drivers.map((d, i) => {
            const Icon = IMPACT_ICON[d.impact];
            return (
              <li key={i} className="flex gap-2 text-sm">
                <Icon
                  aria-hidden
                  className={cn(
                    "mt-0.5 size-4 shrink-0",
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
      </div>

      {result.sampleSize > 0 && (
        <p className="mt-4 text-xs text-muted-foreground">{SAMPLE_DATA_NOTE}</p>
      )}
      <p className="mt-2 text-xs text-muted-foreground">{result.disclaimer}</p>
    </Card>
  );
}
