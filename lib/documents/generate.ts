import "server-only";

import Anthropic from "@anthropic-ai/sdk";

import { getAnthropic } from "@/lib/anthropic/client";
import {
  buildUserMessage,
  DOC_TYPE_LABELS,
  SYSTEM_PROMPT,
  type DocVariables,
} from "@/lib/documents/prompts";
import { IS_ANTHROPIC_CONFIGURED } from "@/lib/env.server";
import { captureException } from "@/lib/observability/sentry";

// Sonnet 4.6 — strong writing at a fraction of Opus cost (dev-plan §10). Swap to
// "claude-opus-4-8" for maximum quality.
const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 3000;

export type GenerateResult =
  | { ok: true; content: string; model: string; mock: boolean }
  | { ok: false; error: string };

export async function generateDocument(
  variables: DocVariables,
): Promise<GenerateResult> {
  if (!IS_ANTHROPIC_CONFIGURED) {
    return {
      ok: true,
      mock: true,
      model: "mock",
      content: mockDraft(variables),
    };
  }

  try {
    const client = getAnthropic();
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      // Cached system block: stable prefix, not re-billed on every generation.
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: buildUserMessage(variables) }],
    });

    const content = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    if (!content) {
      return {
        ok: false,
        error: "The model returned an empty draft. Please try again.",
      };
    }
    return { ok: true, content, model: MODEL, mock: false };
  } catch (error) {
    captureException(error, { where: "generateDocument" });
    if (error instanceof Anthropic.RateLimitError) {
      return {
        ok: false,
        error:
          "We're generating a lot of drafts right now — please try again in a moment.",
      };
    }
    if (error instanceof Anthropic.APIError) {
      return {
        ok: false,
        error: "The document service had a problem. Please try again.",
      };
    }
    return {
      ok: false,
      error: "Couldn't generate the draft. Please try again.",
    };
  }
}

/** Clearly-labeled placeholder used when no Anthropic key is configured (dev/CI). */
function mockDraft(v: DocVariables): string {
  const title = `${DOC_TYPE_LABELS[v.type]} — ${v.programName}, ${v.universityName}`;
  return [
    `# ${title}`,
    ``,
    `_(Sample draft — set ANTHROPIC_API_KEY to generate a real one.)_`,
    ``,
    `My name is [your name], from [country]. I am applying to the ${v.programName} program at ${v.universityName} because [your specific reason].`,
    ``,
    `My background in ${v.field || "[field]"} — including [a concrete example] — prepared me for this program. With a GPA of ${v.gpa ?? "[GPA]"}, I am ready to [your goal].`,
    ``,
    `During the program I will focus on [areas], and afterward I plan to [career goal].`,
    ``,
    `_Draft — personalize the [bracketed] parts and verify every detail before using._`,
  ].join("\n");
}
