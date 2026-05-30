"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { History, Loader2, Sparkles } from "lucide-react";

import { ExportButtons } from "@/components/documents/export-buttons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DRAFT_DOC_NOTE } from "@/lib/config";
import type { DocumentRow } from "@/lib/data/types";
import {
  generateDocumentAction,
  saveDocumentAction,
  type DocActionState,
} from "@/lib/documents/actions";
import type { DocType } from "@/lib/documents/prompts";

const EMPTY: DocActionState = {};

function GenerateButton({ hasContent }: { hasContent: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={hasContent ? "outline" : "default"}
      size="sm"
      disabled={pending}
    >
      {pending ? (
        <Loader2 className="animate-spin" aria-hidden />
      ) : (
        <Sparkles aria-hidden />
      )}
      {hasContent ? "Regenerate" : "Generate draft"}
    </Button>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending && <Loader2 className="animate-spin" aria-hidden />}
      Save version
    </Button>
  );
}

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
  // Adjust state when the latest-version prop changes (React's documented "derive state from
  // props" pattern, guarded so it runs once per new version id — no loop). Keeps the editor in
  // sync after a generate/save without an extra paint.
  const [syncedId, setSyncedId] = useState(latest?.id);
  if (latest?.id !== syncedId) {
    setSyncedId(latest?.id);
    setContent(latest?.content ?? "");
  }

  const [genState, genAction] = useFormState(generateDocumentAction, EMPTY);
  const [saveState, saveAction] = useFormState(saveDocumentAction, EMPTY);
  const filename = `${label.replace(/\s+/g, "-").toLowerCase()}-draft`;

  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-lg font-semibold">{label}</h2>
          {latest && <Badge variant="muted">v{latest.version}</Badge>}
        </div>
        <form action={genAction}>
          <input type="hidden" name="applicationId" value={applicationId} />
          <input type="hidden" name="type" value={type} />
          <GenerateButton hasContent={versions.length > 0} />
        </form>
      </div>

      {genState.error && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {genState.error}
        </p>
      )}

      {versions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No draft yet. Generate a first draft from your profile — then edit it
          freely.
        </div>
      ) : (
        <form action={saveAction} className="flex flex-col gap-3">
          <input type="hidden" name="applicationId" value={applicationId} />
          <input type="hidden" name="type" value={type} />
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            maxLength={20000}
            aria-label={`${label} draft`}
            className="w-full resize-y rounded-lg border border-input bg-background p-3 font-sans text-sm leading-relaxed ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {saveState.error && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {saveState.error}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SaveButton />
            <ExportButtons content={content} filename={filename} />
          </div>
          <p className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning-foreground">
            {DRAFT_DOC_NOTE}
          </p>
        </form>
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
                  onClick={() => setContent(v.content)}
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
