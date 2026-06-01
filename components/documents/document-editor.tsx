"use client";

import { useRef, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { Eye, History, Loader2, Pencil, Sparkles } from "lucide-react";

import { ExportButtons } from "@/components/documents/export-buttons";
import { GeneratingState } from "@/components/documents/generating-state";
import { MarkdownPreview } from "@/components/documents/markdown-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DRAFT_DOC_NOTE } from "@/lib/config";
import type { DocumentRow } from "@/lib/data/types";
import {
  saveDocumentAction,
  type DocActionState,
} from "@/lib/documents/actions";
import { STREAM_ERROR_SENTINEL, type DocType } from "@/lib/documents/prompts";

const EMPTY: DocActionState = {};

type Tab = "preview" | "edit";

export function DocumentEditor({
  applicationId,
  type,
  label,
  versions,
}: {
  applicationId: string;
  type: DocType;
  label: string;
  versions: DocumentRow[];
}) {
  const latest = versions[0];
  const [content, setContent] = useState(latest?.content ?? "");
  // Re-sync when a new saved version arrives (React's "derive state from props", guarded so it
  // runs once per new version id — no loop). Keeps the editor current after save/regenerate.
  const [syncedId, setSyncedId] = useState(latest?.id);
  if (latest?.id !== syncedId) {
    setSyncedId(latest?.id);
    setContent(latest?.content ?? "");
  }

  // Default to Preview when a saved draft exists, Edit when empty.
  const [tab, setTab] = useState<Tab>(versions.length > 0 ? "preview" : "edit");
  const [genError, setGenError] = useState<string | null>(null);
  const [streamText, setStreamText] = useState("");
  const [generating, setGenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const [saveState, saveAction] = useFormState(saveDocumentAction, EMPTY);
  const [isSaving, startSave] = useTransition();
  const filename = `${label.replace(/\s+/g, "-").toLowerCase()}-draft`;
  const hasContent = versions.length > 0;

  async function generate() {
    setGenError(null);
    setStreamText("");
    setGenerating(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch("/api/documents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, type }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        setGenError("Couldn't generate the draft. Please try again.");
        setGenerating(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      // Read tokens as they arrive and show them live.
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const sentinel = acc.indexOf(STREAM_ERROR_SENTINEL);
        if (sentinel !== -1) {
          // Server signalled an error; everything after the sentinel is the message.
          setGenError(
            acc.slice(sentinel + STREAM_ERROR_SENTINEL.length).trim() ||
              "Couldn't generate the draft. Please try again.",
          );
          setStreamText("");
          setGenerating(false);
          return;
        }
        setStreamText(acc);
      }

      const finalText = acc.trim();
      if (!finalText) {
        setGenError("The model returned an empty draft. Please try again.");
        setGenerating(false);
        return;
      }

      // Persist through the EXISTING save/version action (unchanged flow). On success the page
      // revalidates and the new version flows back in via props, re-syncing the editor.
      setContent(finalText);
      const fd = new FormData();
      fd.set("applicationId", applicationId);
      fd.set("type", type);
      fd.set("content", finalText);
      startSave(() => saveAction(fd));
      setTab("preview");
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        setGenError("Couldn't generate the draft. Please try again.");
      }
    } finally {
      setGenerating(false);
      setStreamText("");
      abortRef.current = null;
    }
  }

  function save() {
    if (content.trim().length === 0) return;
    const fd = new FormData();
    fd.set("applicationId", applicationId);
    fd.set("type", type);
    fd.set("content", content);
    startSave(() => saveAction(fd));
  }

  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-lg font-semibold">{label}</h2>
          {latest && <Badge variant="muted">v{latest.version}</Badge>}
        </div>
        <Button
          type="button"
          variant={hasContent ? "outline" : "default"}
          size="sm"
          onClick={generate}
          disabled={generating}
        >
          {generating ? (
            <Loader2 className="animate-spin" aria-hidden />
          ) : (
            <Sparkles aria-hidden />
          )}
          {hasContent ? "Regenerate" : "Generate draft"}
        </Button>
      </div>

      {genError && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {genError}
        </p>
      )}

      {generating ? (
        <GeneratingState streamedText={streamText} />
      ) : !hasContent && content.trim().length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No draft yet. Generate a first draft from your profile — then edit it
          freely.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div
            role="tablist"
            aria-label={`${label} view`}
            className="inline-flex w-fit rounded-lg border border-border bg-muted/40 p-0.5"
          >
            {(
              [
                ["preview", "Preview", Eye],
                ["edit", "Edit", Pencil],
              ] as const
            ).map(([value, text, Icon]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={tab === value}
                onClick={() => setTab(value)}
                className={cn(
                  "inline-flex min-h-[36px] items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  tab === value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {text}
              </button>
            ))}
          </div>

          {tab === "preview" ? (
            <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
              {content.trim().length > 0 ? (
                <MarkdownPreview content={content} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nothing to preview yet — switch to Edit to write a draft.
                </p>
              )}
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              maxLength={20000}
              aria-label={`${label} draft (markdown)`}
              className="w-full resize-y rounded-lg border border-input bg-background p-3 font-mono text-sm leading-relaxed ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          )}

          {saveState.error && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {saveState.error}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              size="sm"
              onClick={save}
              disabled={isSaving || content.trim().length === 0}
            >
              {isSaving && <Loader2 className="animate-spin" aria-hidden />}
              Save version
            </Button>
            <ExportButtons content={content} filename={filename} />
          </div>
          <p className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning-foreground">
            {DRAFT_DOC_NOTE}
          </p>
        </div>
      )}

      {versions.length > 1 && (
        <details className="text-sm">
          <summary className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground">
            <History className="mr-1 inline size-4" aria-hidden />
            Version history ({versions.length})
          </summary>
          <ul className="mt-2 flex flex-col gap-1">
            {versions.map((v) => (
              <li
                key={v.id}
                className="flex items-center justify-between gap-3 rounded-md px-2 py-1 hover:bg-accent"
              >
                <span className="text-muted-foreground">
                  v{v.version}
                  {v.created_at ? ` · ${v.created_at.slice(0, 10)}` : ""}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setContent(v.content);
                    setTab("edit");
                  }}
                >
                  Load into editor
                </Button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </Card>
  );
}
