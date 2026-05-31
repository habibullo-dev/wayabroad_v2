import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, MapPin } from "lucide-react";

import { CostBreakdown } from "@/components/universities/cost-breakdown";
import { UniversityGallery } from "@/components/universities/university-gallery";
import { UniversityLogo } from "@/components/universities/university-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getUniversityDetail } from "@/lib/data/universities";
import { fieldTrust, getVerified } from "@/lib/data/verified";

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
  const verified = getVerified(university);
  // Gate by status: only an official scholarships note overrides the seed as fact; a
  // non-official one is shown as an estimate; pending/absent falls back to the seed note.
  const vs = verified?.scholarships ?? null;
  const vsTrust = vs?.text ? fieldTrust(vs.status) : "none";
  const useVerifiedScholarships = vsTrust !== "none";
  const scholarships = useVerifiedScholarships
    ? vs!.text
    : university.scholarship_note;
  const scholarshipSource = useVerifiedScholarships ? vs!.source_url : null;
  const scholarshipsOfficial = vsTrust === "verified";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        href="/universities"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← All universities
      </Link>

      <header className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <UniversityLogo
            slug={university.slug}
            name={university.name}
            className="size-14"
          />
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

      <UniversityGallery slug={university.slug} />

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

          {scholarships && (
            <Card className="mt-4 p-5">
              <h3 className="font-display text-base font-semibold">
                Scholarships
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {scholarships}
              </p>
              {useVerifiedScholarships && !scholarshipsOfficial && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Estimate — confirm current programs with the university.
                </p>
              )}
              {scholarshipSource && (
                <a
                  href={scholarshipSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-0.5 text-xs text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {scholarshipsOfficial
                    ? "Official scholarships page"
                    : "Source"}
                  <ExternalLink className="size-3" aria-hidden />
                </a>
              )}
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
