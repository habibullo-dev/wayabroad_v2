import "server-only";
import { z } from "zod";

import { isPresent } from "@/lib/env";

/**
 * Server-only environment. The `server-only` import makes the bundler throw if any of
 * this is imported into a client component, so secrets can never leak to the browser.
 *
 * All optional: the app must build and run in mock mode with nothing configured.
 */
const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
});

const parsed = serverEnvSchema.safeParse(process.env);

if (!parsed.success && process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line no-console
  console.warn(
    "[env.server] Server env failed validation.",
    parsed.error.flatten().fieldErrors,
  );
}

export const serverEnv = parsed.success ? parsed.data : {};

export const IS_DATABASE_CONFIGURED = isPresent(serverEnv.DATABASE_URL);
export const IS_SERVICE_ROLE_CONFIGURED = isPresent(
  serverEnv.SUPABASE_SERVICE_ROLE_KEY,
);
export const IS_ANTHROPIC_CONFIGURED = isPresent(serverEnv.ANTHROPIC_API_KEY);
export const IS_SENTRY_CONFIGURED = isPresent(serverEnv.SENTRY_DSN);
export const IS_RESEND_CONFIGURED = isPresent(serverEnv.RESEND_API_KEY);
