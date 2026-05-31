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
  ANTHROPIC_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  // Model used for the web-search data validator (Responses API). Override-able.
  OPENAI_MODEL: z.string().optional(),
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

export const IS_SERVICE_ROLE_CONFIGURED = isPresent(
  serverEnv.SUPABASE_SERVICE_ROLE_KEY,
);
export const IS_ANTHROPIC_CONFIGURED = isPresent(serverEnv.ANTHROPIC_API_KEY);
export const IS_OPENAI_CONFIGURED = isPresent(serverEnv.OPENAI_API_KEY);
/** Model for the OpenAI web-search validator. gpt-5 searched + cited far better than gpt-4.1 in testing. */
export const OPENAI_MODEL = serverEnv.OPENAI_MODEL?.trim() || "gpt-5";
export const IS_SENTRY_CONFIGURED = isPresent(serverEnv.SENTRY_DSN);
export const IS_RESEND_CONFIGURED = isPresent(serverEnv.RESEND_API_KEY);
