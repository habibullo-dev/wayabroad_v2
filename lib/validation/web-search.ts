import OpenAI from "openai";
import { z } from "zod";

/**
 * Provider-swappable web-search extractor. Given a prompt that asks for a specific, citable
 * figure and demands strict JSON, it runs a web-search-grounded model call and returns the
 * parsed+validated object, or null when the model can't answer (or the output doesn't validate).
 *
 * The prompt — not this module — is responsible for instructing the model to return null rather
 * than guess, and to include a real source URL. See lib/validation/fields.ts.
 *
 * No `server-only` and no env import on purpose: this is batch tooling invoked from a Node
 * script (tsx), and the caller passes the API key/model. It holds no secret of its own.
 */
export interface WebSearchValidator {
  /** Run one grounded extraction; returns validated data or null. */
  extract<T>(
    prompt: string,
    schema: z.ZodType<T>,
    label?: string,
  ): Promise<T | null>;
  /** Total output/input tokens used so far (for cost logging). */
  usage(): { input: number; output: number; calls: number };
}

/**
 * Pull the first *parseable* balanced JSON object out of a model's text answer. Tries each
 * `{` in turn, so leading prose that contains braces doesn't cause a miss.
 */
function extractJsonObject(text: string): unknown | null {
  for (
    let start = text.indexOf("{");
    start >= 0;
    start = text.indexOf("{", start + 1)
  ) {
    let depth = 0;
    let inStr = false;
    let esc = false;
    for (let i = start; i < text.length; i++) {
      const c = text[i];
      if (inStr) {
        if (esc) esc = false;
        else if (c === "\\") esc = true;
        else if (c === '"') inStr = false;
      } else if (c === '"') inStr = true;
      else if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) {
          try {
            return JSON.parse(text.slice(start, i + 1));
          } catch {
            break; // not valid JSON from this start — try the next "{"
          }
        }
      }
    }
  }
  return null;
}

/** OpenAI Responses API implementation, using the built-in `web_search` tool. */
export function createOpenAiValidator(opts: {
  apiKey: string;
  model: string;
}): WebSearchValidator {
  if (!opts.apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set — cannot run the web-search validator.",
    );
  }
  const client = new OpenAI({ apiKey: opts.apiKey });
  const model = opts.model;
  let inputTokens = 0;
  let outputTokens = 0;
  let calls = 0;

  return {
    async extract(prompt, schema, label) {
      calls += 1;
      let text: string;
      try {
        const res = await client.responses.create({
          model,
          tools: [{ type: "web_search" }],
          input: prompt,
        });
        inputTokens += res.usage?.input_tokens ?? 0;
        outputTokens += res.usage?.output_tokens ?? 0;
        text = res.output_text ?? "";
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(
          `[validate] extract failed${label ? ` (${label})` : ""}: ${(err as Error).message}`,
        );
        return null;
      }

      const json = extractJsonObject(text);
      if (json == null) return null;
      const parsed = schema.safeParse(json);
      if (!parsed.success) {
        // eslint-disable-next-line no-console
        console.warn(
          `[validate] output did not match schema${label ? ` (${label})` : ""}.`,
        );
        return null;
      }
      return parsed.data;
    },
    usage() {
      return { input: inputTokens, output: outputTokens, calls };
    },
  };
}
