type ErrorContext = Record<string, unknown>;

/**
 * Error-monitoring stub (M0). No real SDK yet: logs in non-production and no-ops in
 * production until `@sentry/nextjs` is wired. Safe to import from client or server.
 */
export function captureException(error: unknown, context?: ErrorContext): void {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error("[sentry:stub] captureException", error, context ?? {});
  }
  // TODO: Sentry.captureException(error, { extra: context })
}

export function captureMessage(message: string, context?: ErrorContext): void {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn("[sentry:stub] captureMessage", message, context ?? {});
  }
  // TODO: Sentry.captureMessage(message, { extra: context })
}
