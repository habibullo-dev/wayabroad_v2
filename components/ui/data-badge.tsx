import { Badge } from "@/components/ui/badge";

/** One source of truth for the live-vs-sample data indicator (label + color). */
export function DataBadge({ live }: { live: boolean }) {
  return (
    <Badge variant={live ? "success" : "warning"}>
      {live ? "Live data" : "Sample data"}
    </Badge>
  );
}
