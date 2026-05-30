import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
          {apps.map(({ application, program, university }) => (
            <li key={application.id}>
              <Link
                href={`/applications/${application.id}`}
                className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Card className="flex h-full flex-col gap-2 p-5 transition-colors group-hover:border-primary/40">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-display text-lg font-semibold leading-tight">
                      {program.name}
                    </h2>
                    <Badge variant="secondary">
                      {application.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {university.name} · {program.degree_level}
                  </p>
                  <p className="mt-auto pt-2 text-sm font-medium text-primary">
                    Open documents →
                  </p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
