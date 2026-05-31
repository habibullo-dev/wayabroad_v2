import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { UniversityLogo } from "@/components/universities/university-logo";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getUniversities } from "@/lib/data/universities";
import { formatUsd } from "@/lib/format";

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
        <Badge variant={source === "live" ? "success" : "warning"}>
          {source === "live" ? "Live data" : "Sample data"}
        </Badge>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {universities.map((u) => (
          <Link
            key={u.id}
            href={`/universities/${u.slug}`}
            className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Card className="flex h-full flex-col gap-2 p-5 transition-colors group-hover:border-primary/40">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <UniversityLogo
                    slug={u.slug}
                    name={u.name}
                    className="size-10"
                  />
                  <h2 className="font-display text-lg font-semibold leading-tight">
                    {u.name}
                  </h2>
                </div>
                {u.tier_band && (
                  <Badge variant="secondary">{u.tier_band}</Badge>
                )}
              </div>
              {u.city && (
                <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" aria-hidden />
                  {u.city}
                  {u.region ? `, ${u.region}` : ""}
                </p>
              )}
              <p className="mt-auto pt-2 text-sm text-muted-foreground">
                Tuition from{" "}
                <span className="font-medium tabular-nums text-foreground">
                  {formatUsd(
                    u.tuition_ug_usd_min != null
                      ? u.tuition_ug_usd_min * 2
                      : null,
                  )}
                </span>
                /yr
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
