import { Info } from "lucide-react";

import { Card } from "@/components/ui/card";
import { COST_ESTIMATE_NOTE } from "@/lib/config";
import type { University } from "@/lib/data/types";
import { formatUsd } from "@/lib/format";

function midpoint(a: number | null, b: number | null): number | null {
  if (a != null && b != null) return (a + b) / 2;
  return a ?? b ?? null;
}

function sum(values: (number | null)[]): number | null {
  const present = values.filter((v): v is number => v != null);
  if (present.length === 0) return null;
  return present.reduce((acc, v) => acc + v, 0);
}

export function CostBreakdown({ university }: { university: University }) {
  // Seed USD figures are per-semester; annualize by ×2. Living is monthly → ×12.
  const tuitionYear = (() => {
    const semester = midpoint(
      university.tuition_ug_usd_min,
      university.tuition_ug_usd_max,
    );
    return semester != null ? semester * 2 : null;
  })();
  const dormYear =
    university.dorm_usd_per_semester != null
      ? university.dorm_usd_per_semester * 2
      : null;
  const livingYear =
    university.living_usd_per_month != null
      ? university.living_usd_per_month * 12
      : null;

  const rows = [
    { label: "Tuition", note: "per year (≈2 semesters)", value: tuitionYear },
    { label: "Dorm", note: "on-campus, per year", value: dormYear },
    { label: "Living", note: "food, transport, etc.", value: livingYear },
    { label: "Visa", note: "D-2, one-time", value: university.visa_cost_usd },
  ];
  const yearlyTotal = sum([tuitionYear, dormYear, livingYear]);

  return (
    <Card className="p-6">
      <h2 className="font-display text-lg font-semibold">Estimated costs</h2>
      <dl className="mt-4 divide-y">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-4 py-2.5"
          >
            <dt className="text-sm">
              <span className="font-medium">{row.label}</span>{" "}
              <span className="text-xs text-muted-foreground">{row.note}</span>
            </dt>
            <dd className="font-display text-base font-semibold tabular-nums">
              {formatUsd(row.value)}
            </dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-4 pt-3">
          <dt className="text-sm font-semibold">Yearly total (excl. visa)</dt>
          <dd className="font-display text-lg font-semibold tabular-nums text-primary">
            {formatUsd(yearlyTotal)}
          </dd>
        </div>
      </dl>
      <p className="mt-4 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning-foreground">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        {COST_ESTIMATE_NOTE}
      </p>
    </Card>
  );
}
