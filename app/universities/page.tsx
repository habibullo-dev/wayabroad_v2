import type { Metadata } from "next";
import { Suspense } from "react";

import { UniversitiesExplorer } from "@/components/universities/universities-explorer";
import { DataBadge } from "@/components/ui/data-badge";
import { getUniversities } from "@/lib/data/universities";

export const metadata: Metadata = { title: "Korean universities" };

export default async function UniversitiesPage() {
  const { data: universities, source } = await getUniversities();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Korean universities
          </h1>
          <p className="mt-1 text-muted-foreground">
            {universities.length} institutions with transparent cost estimates.
          </p>
        </div>
        <DataBadge live={source === "live"} />
      </header>

      <Suspense fallback={null}>
        <UniversitiesExplorer universities={universities} />
      </Suspense>
    </div>
  );
}
