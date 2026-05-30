import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StatusActions } from "@/components/applications/status-actions";
import { StatusTimeline } from "@/components/applications/status-timeline";
import { DocumentEditor } from "@/components/documents/document-editor";
import { Card } from "@/components/ui/card";
import { getApplicationWorkspace } from "@/lib/documents/data";
import { DOC_TYPE_LABELS, DOC_TYPES } from "@/lib/documents/prompts";

type Params = { params: { id: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const ws = await getApplicationWorkspace(params.id);
  return { title: ws ? `${ws.program.name} — application` : "Application" };
}

export default async function ApplicationPage({ params }: Params) {
  const ws = await getApplicationWorkspace(params.id);
  if (!ws) notFound();

  const { application, program, university, documents } = ws;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/applications"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Your applications
      </Link>

      <header className="mt-3">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {program.name}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {university.name} · {program.degree_level}
        </p>
      </header>

      <Card className="mt-6 flex flex-col gap-5 p-6">
        <StatusTimeline status={application.status} />
        <div className="border-t border-border/60 pt-4">
          <StatusActions
            applicationId={application.id}
            status={application.status}
          />
        </div>
      </Card>

      <p className="mt-8 text-sm text-muted-foreground">
        Generate first drafts from your profile, edit them freely, and download.
        These are editable aids — not finished or submittable documents.
      </p>

      <div className="mt-6 flex flex-col gap-6">
        {DOC_TYPES.map((type) => (
          <DocumentEditor
            key={type}
            applicationId={application.id}
            type={type}
            label={DOC_TYPE_LABELS[type]}
            versions={documents[type]}
          />
        ))}
      </div>
    </div>
  );
}
