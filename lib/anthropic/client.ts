import "server-only";

import Anthropic from "@anthropic-ai/sdk";

import { serverEnv } from "@/lib/env.server";

let cached: Anthropic | null = null;

/** Lazily-constructed Anthropic client (server-only). Throws if no key is configured. */
export function getAnthropic(): Anthropic {
  const apiKey = serverEnv.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }
  cached ??= new Anthropic({ apiKey });
  return cached;
}
