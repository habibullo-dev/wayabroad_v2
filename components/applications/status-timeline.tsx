import { Check } from "lucide-react";

import {
  APPLICATION_STAGES,
  STATUS_LABELS,
  statusIndex,
} from "@/lib/applications/status";
import { cn } from "@/lib/utils";

/**
 * Presentational 5-stage progress timeline (draft → decision). The current stage is
 * highlighted; completed stages get a check; future stages are muted. Purely visual —
 * status changes happen via the server actions in StatusActions.
 */
export function StatusTimeline({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const current = statusIndex(status);

  return (
    <ol
      className={cn("flex items-center", className)}
      aria-label={`Application status: ${STATUS_LABELS[APPLICATION_STAGES[current]!]}`}
    >
      {APPLICATION_STAGES.map((stage, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={stage} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                aria-hidden
                className={cn(
                  "grid size-8 place-items-center rounded-full border text-xs font-semibold transition-colors",
                  done && "border-success/30 bg-success/15 text-success",
                  active &&
                    "border-primary bg-primary text-primary-foreground ring-2 ring-primary/25",
                  !done &&
                    !active &&
                    "border-border bg-muted text-muted-foreground",
                )}
              >
                {done ? <Check className="size-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-center text-[11px] leading-tight",
                  active
                    ? "font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {STATUS_LABELS[stage]}
              </span>
            </div>
            {i < APPLICATION_STAGES.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "mx-1 h-0.5 flex-1 rounded-full transition-colors",
                  i < current ? "bg-success/40" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
