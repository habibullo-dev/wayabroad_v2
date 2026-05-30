import { Badge } from "@/components/ui/badge";
import type { MatchLevel } from "@/lib/matching/shortlist";

const LABEL: Record<MatchLevel, string> = {
  high: "Strong match",
  medium: "Possible match",
  low: "Reach",
};

const VARIANT: Record<MatchLevel, "success" | "warning" | "muted"> = {
  high: "success",
  medium: "warning",
  low: "muted",
};

export function MatchBadge({
  level,
  score,
}: {
  level: MatchLevel;
  score: number;
}) {
  return (
    <Badge variant={VARIANT[level]}>
      {LABEL[level]} · {score}%
    </Badge>
  );
}
