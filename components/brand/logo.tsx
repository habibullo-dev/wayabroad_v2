import { cn } from "@/lib/utils";

/** WayAbroad wordmark: a royal-blue "W" tile with a sky-blue "destination" dot. */
export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-foreground",
        className,
      )}
    >
      <span
        aria-hidden
        className="relative grid size-7 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm"
      >
        <span className="font-display text-sm font-bold leading-none">W</span>
        <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-brand-accent ring-2 ring-background" />
      </span>
      {showWordmark && <span>WayAbroad</span>}
    </span>
  );
}
