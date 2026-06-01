import Anthropic from "@anthropic-ai/sdk";

import {
  loadDocContext,
  variablesFromContext,
} from "@/lib/documents/context";
import { streamDocument } from "@/lib/documents/generate";
import {
  STREAM_ERROR_SENTINEL,
  type DocType,
} from "@/lib/documents/prompts";
import { captureException } from "@/lib/observability/sentry";

// Streamed generation needs the Node runtime (Anthropic SDK + cookie-bound Supabase).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function asDocType(value: unknown): DocType | null {
  return value === "sop" || value === "study_plan" ? value : null;
}

/**
 * Streams a freshly-generated draft as plain-text chunks so the client can render tokens
 * live. Auth + ownership are enforced by `loadDocContext` (RLS-scoped Supabase). This route
 * ONLY generates — the client persists the final text through the existing save action, so
 * the version/export flow is untouched.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid request.", { status: 400 });
  }

  const { applicationId, type: rawType } = (body ?? {}) as {
    applicationId?: unknown;
    type?: unknown;
  };
  const type = asDocType(rawType);
  if (typeof applicationId !== "string" || !applicationId || !type) {
    return new Response("Invalid request.", { status: 400 });
  }

  const ctx = await loadDocContext(applicationId);
  if (!ctx) {
    // Unauthenticated or the application isn't visible to this user (RLS).
    return new Response("Not found.", { status: 404 });
  }

  const variables = variablesFromContext(ctx, type);
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of streamDocument(variables)) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      } catch (error) {
        captureException(error, { where: "documents/generate/route" });
        const message =
          error instanceof Anthropic.RateLimitError
            ? "We're generating a lot of drafts right now — please try again in a moment."
            : "Couldn't generate the draft. Please try again.";
        // NUL can't appear in the markdown body, so it is a safe sentinel the client
        // splits on to surface the error (whether the failure is at start or mid-stream).
        controller.enqueue(encoder.encode(STREAM_ERROR_SENTINEL + message));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
