import Link from "next/link";
import {
  ArrowRight,
  FileText,
  GraduationCap,
  Sparkles,
  Wallet,
} from "lucide-react";

import { CampusHero } from "@/components/landing/campus-hero";
import { CrestMarquee } from "@/components/landing/crest-marquee";
import { HeroFan } from "@/components/landing/hero-fan";
import { MatchesPreview } from "@/components/landing/matches-preview";
import { Reveal } from "@/components/landing/reveal";
import { UniversityGallery } from "@/components/landing/university-gallery";
import { AppHeader } from "@/components/layout/app-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getUniversityMedia } from "@/lib/data/university-media";
import { getReferenceCounts, getUniversities } from "@/lib/data/universities";
import { cn } from "@/lib/utils";

const PILLARS = [
  {
    icon: GraduationCap,
    title: "Ranked shortlist",
    body: "Your profile in, a ranked list of matching Korean programs out.",
  },
  {
    icon: Sparkles,
    title: "Admission probability",
    body: "A transparent likelihood per program — with its drivers and a confidence band.",
  },
  {
    icon: FileText,
    title: "SOP & Study Plan drafts",
    body: "Instant, editable drafts tailored to your target program.",
  },
  {
    icon: Wallet,
    title: "Cost transparency",
    body: "Tuition, dorm, visa and living costs in one honest, sourced breakdown.",
  },
] as const;

const HERO_FAN_SLUGS = [
  "yonsei-university",
  "korea-university",
  "seoul-national-university",
  "hanyang-university",
  "ewha-womans-university",
];

const MARQUEE_SLUGS = [
  "seoul-national-university",
  "korea-university",
  "yonsei-university",
  "sungkyunkwan-university-skku",
  "hanyang-university",
  "kyung-hee-university",
  "ewha-womans-university",
  "pusan-national-university",
  "chung-ang-university",
  "hankuk-university-of-foreign-studies-hufs",
  "inha-university",
  "konkuk-university",
  "sejong-university",
  "ulsan-national-institute-of-science-and-technology-unist",
];

export default async function HomePage() {
  const [{ data: counts, source }, { data: universities }] = await Promise.all([
    getReferenceCounts(),
    getUniversities(),
  ]);
  const isLive = source === "live";
  const uniCount = isLive ? counts.universities : 50;
  const programCount = isLive ? counts.programs : 267;

  const withMedia = universities
    .map((u) => {
      const m = getUniversityMedia(u.slug);
      if (!m) return null;
      return {
        slug: u.slug,
        name: u.name,
        city: u.city,
        img: m.hero?.src ?? m.logo,
        rank: u.kr_rank_unirank_2026 ?? 999,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x != null)
    .sort((a, b) => a.rank - b.rank);

  const pick = (slug: string) => withMedia.find((w) => w.slug === slug);
  const heroCards = HERO_FAN_SLUGS.map(pick).filter(
    (x): x is NonNullable<typeof x> => x != null,
  );
  const campus = pick("seoul-national-university") ?? withMedia[0];
  const gallery = withMedia.slice(0, 12);

  const stats = [
    { value: `${uniCount}`, label: "universities" },
    { value: `${programCount}`, label: "programs tracked" },
    { value: "Free", label: "to check your odds" },
  ];

  const badge = (
    <Badge variant={isLive ? "success" : "warning"}>
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          isLive ? "bg-success" : "bg-warning",
        )}
      />
      {isLive
        ? `Live data · ${uniCount} universities · ${programCount} programs`
        : "Sample data"}
    </Badge>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="flex-1">
        <HeroFan cards={heroCards} badge={badge} stats={stats} />

        {/* Social proof: flowing crests */}
        <section className="border-y border-border/60 bg-secondary/30">
          <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
            <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Tracking {uniCount} Korean universities — verified, sourced data
            </p>
            <CrestMarquee slugs={MARQUEE_SLUGS} />
          </div>
        </section>

        {/* The product, shown */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal variant="left">
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                The product
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
                Real odds. Not vibes.
              </h2>
              <p className="mt-4 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
                Enter your profile and every program gets a transparent
                admission band, the drivers behind it, and a verified yearly
                cost — so you apply where you actually have a shot.
              </p>
              <div className="mt-6">
                <Button asChild size="lg">
                  <Link href="/check">
                    Try the free check
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </Reveal>
            <MatchesPreview />
          </div>
        </section>

        {campus && (
          <CampusHero img={campus.img} name={campus.name} count={uniCount} />
        )}

        <UniversityGallery universities={gallery} total={uniCount} />

        {/* What you get */}
        <section
          id="features"
          className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
        >
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need to apply with clarity
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              Four tools, one honest source of truth — from first shortlist to a
              submitted application.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} variant="up" delay={i * 90}>
                <Card className="flex h-full flex-col gap-3 p-6 transition-colors hover:border-primary/40">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="text-base font-semibold">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Close */}
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <Reveal
            variant="scale"
            className="orb-glow relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-b from-secondary/70 to-background px-6 py-16 text-center sm:py-20"
          >
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              Your Korean university,{" "}
              <span className="italic text-primary">within reach</span>.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-pretty text-muted-foreground">
              Start with a free probability check — no sign-up — or create an
              account for your full ranked shortlist.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/check">
                  Check my chances — free
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/signup">Create a free account</Link>
              </Button>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
