import { z } from "zod";

/** True only when a string env var is present and non-blank (whitespace is not "set"). */
export function isPresent(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Public (client-safe) environment. Only NEXT_PUBLIC_* values belong here — anything
 * referenced from a client component is inlined into the browser bundle at build time.
 *
 * Every var is OPTIONAL and uses `.catch(undefined)`, so one malformed value (e.g. a bad
 * NEXT_PUBLIC_POSTHOG_HOST) falls back to undefined for *that field only* instead of
 * nuking the whole object and silently flipping MOCK_DATA on. Server-only secrets live in
 * `lib/env.server.ts`.
 *
 * Each value is referenced explicitly (not via a `process.env` spread) so Next can
 * statically inline NEXT_PUBLIC_* vars on the client.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().catch(undefined),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().catch(undefined),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional().catch(undefined),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional().catch(undefined),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional().catch(undefined),
  NEXT_PUBLIC_APP_URL: z.string().url().optional().catch(undefined),
});

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

/** True only when BOTH Supabase public values are present. Drives mock-data fallback. */
export const IS_SUPABASE_CONFIGURED =
  isPresent(publicEnv.NEXT_PUBLIC_SUPABASE_URL) &&
  isPresent(publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** When true, the app renders with mocked data instead of querying Supabase. */
export const MOCK_DATA = !IS_SUPABASE_CONFIGURED;

export const IS_POSTHOG_CONFIGURED = isPresent(
  publicEnv.NEXT_PUBLIC_POSTHOG_KEY,
);

export const APP_URL = isPresent(publicEnv.NEXT_PUBLIC_APP_URL)
  ? publicEnv.NEXT_PUBLIC_APP_URL
  : "http://localhost:3000";
