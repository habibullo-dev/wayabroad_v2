"use client";

import { useEffect, useState } from "react";

const STAGES = [
  "Reading your profile…",
  "Drafting…",
  "Polishing…",
] as const;

/**
 * Skeleton + cycling stage labels shown while a draft generates. Replaces the bare spinner
 * so the ~15s wait feels intentional. The shimmer uses `animate-pulse`, which Tailwind drops
 * under `prefers-reduced-motion: reduce`; the stage label still advances either way and is
 * announced via aria-live.
 *
 * When `streamedText` is provided (live streaming), it renders as the preview grows instead
 * of the skeleton bars — so tokens appear as they arrive.
 */
export function GeneratingState({
  streamedText,
}: {
  streamedText?: string;
}) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Advance through the labels; hold on the final one until generation completes.
    const id = setInterval(() => {
      setStage((s) => Math.min(s + 1, STAGES.length - 1));
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const hasText = (streamedText ?? "").length > 0;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
      <p
        aria-live="polite"
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
      >
        <span
          aria-hidden
          className="inline-block size-2 animate-pulse rounded-full bg-primary"
        />
        {STAGES[stage]}
      </p>

      {hasText ? (
        <p className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-foreground">
          {streamedText}
          <span
            aria-hidden
            className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary align-middle"
          />
        </p>
      ) : (
        <div aria-hidden className="flex flex-col gap-2.5">
          <div className="h-4 w-2/5 animate-pulse rounded bg-muted" />
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-11/12 animate-pulse rounded bg-muted" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
        </div>
      )}
    </div>
  );
}
