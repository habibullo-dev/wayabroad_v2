import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";

import { ApplicationCard } from "@/components/applications/application-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getMyApplications } from "@/lib/documents/data";

export const metadata: Metadata = { title: "Your applications" };

export default async function ApplicationsPage() {
  const apps = await getMyApplications();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Your applications
        </h1>
        <p className="mt-1 text-muted-foreground">
          Start an application from your shortlist, then generate and edit your
          documents.
        </p>
      </header>

      {apps.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 p-10 text-center">
          <FileText className="size-6 text-primary" aria-hidden />
          <p className="text-muted-foreground">
            No applications yet. Pick a program from your shortlist and choose
            &ldquo;Start application.&rdquo;
          </p>
          <Button asChild>
            <Link href="/shortlist">Go to shortlist</Link>
          </Button>
        </Card>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {apps.map((summary) => (
            <li key={summary.application.id}>
              <ApplicationCard summary={summary} headingLevel="h2" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
