import { BadgeCheck, Info } from "lucide-react";

import { cn } from "@/lib/utils";

type NoteVariant = "info" | "estimate" | "verified";

const STYLES: Record<NoteVariant, string> = {
  info: "border-warning/30 bg-warning/10 text-warning-foreground",
  estimate: "border-warning/30 bg-warning/10 text-warning-foreground",
  verified: "border-success/25 bg-success/10 text-success",
};

const ICONS: Record<NoteVariant, typeof Info> = {
  info: Info,
  estimate: Info,
  verified: BadgeCheck,
};

/**
 * Small inline provenance/disclaimer note — one styled box for the repeated
 * "estimate — verify" / "verified from source" callouts across the app.
 */
export function Note({
  variant = "info",
  className,
  children,
}: {
  variant?: NoteVariant;
  className?: string;
  children: React.ReactNode;
}) {
  const Icon = ICONS[variant];
  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-lg border px-3 py-2 text-xs",
        STYLES[variant],
        className,
      )}
    >
      <Icon className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}
