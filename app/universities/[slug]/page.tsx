import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, MapPin } from "lucide-react";

import { CostBreakdown } from "@/components/universities/cost-breakdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getUniversityDetail } from "@/lib/data/universities";

type Params = { params: { slug: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const detail = await getUniversityDetail(params.slug);
  return { title: detail?.data.university.name ?? "University" };
}

export default async function UniversityPage({ params }: Params) {
  const detail = await getUniversityDetail(params.slug);
  if (!detail) notFound();

  const { university, programs } = detail.data;
  const isLive = detail.source === "live";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        href="/universities"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← All universities
      </Link>

      <header className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              {university.name}
            </h1>
            {university.tier_band && (
              <Badge variant="secondary">{university.tier_band}</Badge>
            )}
            {!isLive && <Badge variant="warning">Sample data</Badge>}
          </div>
          {university.city && (
            <p className="mt-1 inline-flex items-center gap-1 text-muted-foreground">
              <MapPin className="size-4" aria-hidden />
              {university.city}
              {university.region ? `, ${university.region}` : ""}
            </p>
          )}
        </div>
        {university.website && (
          <Button asChild variant="outline">
            <a
              href={university.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              Official site
              <ExternalLink className="size-4" aria-hidden />
            </a>
          </Button>
        )}
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <section>
          <h2 className="font-display text-xl font-semibold">Programs</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {programs.length === 0 ? (
              <li className="text-sm text-muted-foreground">
                No programs listed yet.
              </li>
            ) : (
              programs.map((p) => (
                <li key={p.id}>
                  <Card className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="font-medium">{p.name}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {[
                          p.degree_level,
                          p.field,
                          p.language_of_instruction &&
                            `${p.language_of_instruction}-taught`,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    {p.min_gpa_4_0_scale != null && (
                      <span className="shrink-0 text-sm text-muted-foreground">
                        Min GPA{" "}
                        <span className="font-medium tabular-nums text-foreground">
                          {p.min_gpa_4_0_scale}
                        </span>
                      </span>
                    )}
                  </Card>
                </li>
              ))
            )}
          </ul>

          {university.scholarship_note && (
            <Card className="mt-4 p-5">
              <h3 className="font-display text-base font-semibold">
                Scholarships
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {university.scholarship_note}
              </p>
            </Card>
          )}
        </section>

        <aside>
          <CostBreakdown university={university} />
        </aside>
      </div>
    </div>
  );
}
