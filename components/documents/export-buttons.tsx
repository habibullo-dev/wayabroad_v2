"use client";

import { useState } from "react";
import { Check, Copy, Download, Loader2, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportButtons({
  content,
  filename,
}: {
  content: string;
  filename: string;
}) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [docxError, setDocxError] = useState<string | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be unavailable; ignore */
    }
  }

  function downloadMarkdown() {
    triggerDownload(
      new Blob([content], { type: "text/markdown" }),
      `${filename}.md`,
    );
  }

  async function downloadDocx() {
    setDocxError(null);
    setExporting(true);
    try {
      // Dynamic import so `docx` is only loaded when the user actually exports.
      const { Document, Packer, Paragraph, TextRun } = await import("docx");
      const doc = new Document({
        sections: [
          {
            children: content
              .split("\n")
              .map((line) => new Paragraph({ children: [new TextRun(line)] })),
          },
        ],
      });
      triggerDownload(await Packer.toBlob(doc), `${filename}.docx`);
    } catch {
      setDocxError("Couldn't build the .docx — try another format.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={copy}>
          {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={downloadDocx}
          disabled={exporting}
        >
          {exporting ? (
            <Loader2 className="animate-spin" aria-hidden />
          ) : (
            <Download aria-hidden />
          )}
          .docx
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={downloadMarkdown}
        >
          <Download aria-hidden />
          .md
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => window.print()}
        >
          <Printer aria-hidden />
          Print / PDF
        </Button>
      </div>
      {docxError && (
        <span role="alert" className="text-xs text-destructive">
          {docxError}
        </span>
      )}
    </div>
  );
}
