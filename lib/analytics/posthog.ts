import { IS_POSTHOG_CONFIGURED } from "@/lib/env";

type AnalyticsProps = Record<string, unknown>;

/**
 * Analytics stub (M0). No real SDK yet: no-ops without a PostHog key and logs in dev.
 * The funnel events for the free probability check land in M3 — call sites use `track()`
 * now so swapping in `posthog-js` later requires no changes here.
 */
export function track(event: string, properties?: AnalyticsProps): void {
  if (!IS_POSTHOG_CONFIGURED) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.debug(`[analytics:stub] ${event}`, properties ?? {});
    }
    return;
  }
  // A key is set but the real SDK isn't wired until M3 — warn so events aren't dropped
  // silently (which would look like analytics is working when it isn't).
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.warn(
      `[analytics:stub] PostHog key is set but the SDK isn't wired yet (M3); dropping "${event}".`,
      properties ?? {},
    );
  }
  // TODO(M3): wire posthog-js — posthog.capture(event, properties)
}

/** Named funnel events, centralized so the M3 funnel and dashboards stay consistent. */
export const AnalyticsEvent = {
  FreeCheckStarted: "free_check_started",
  FreeCheckCompleted: "free_check_completed",
  SignUpStarted: "sign_up_started",
  ShortlistViewed: "shortlist_viewed",
  DocumentGenerated: "document_generated",
} as const;
