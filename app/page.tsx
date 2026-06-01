import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  FileText,
  GraduationCap,
  Sparkles,
  Wallet,
} from "lucide-react";

import { AppHeader } from "@/components/layout/app-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UniversityLogo } from "@/components/universities/university-logo";
import { getReferenceCounts } from "@/lib/data/universities";
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

// A believable peek at the product — the "magic moment" rendered as a live card.
const PREVIEW = [
  {
    slug: "yonsei-university",
    uni: "Yonsei University",
    program: "MS Computer Science",
    band: "70–88%",
    pct: 79,
    cat: "Safety",
    variant: "success" as const,
  },
  {
    slug: "korea-university",
    uni: "Korea University",
    program: "MS Computer Science",
    band: "62–80%",
    pct: 71,
    cat: "Match",
    variant: "accent" as const,
  },
  {
    slug: "seoul-national-university",
    uni: "Seoul National",
    program: "MS Computer Science",
    band: "44–62%",
    pct: 53,
    cat: "Reach",
    variant: "warning" as const,
  },
];

const TRUST_SLUGS = [
  "seoul-national-university",
  "korea-university",
  "yonsei-university",
  "sungkyunkwan-university-skku",
  "hanyang-university",
  "ewha-womans-university",
];

export default async function HomePage() {
  const { data: counts, source } = await getReferenceCounts();
  const isLive = source === "live";
  const dataLabel = isLive
    ? `${counts.universities} universities · ${counts.programs} programs`
    : "Sample data";

  const stats = [
    { value: isLive ? `${counts.universities}` : "50", label: "universities" },
    { value: isLive ? `${counts.programs}` : "267", label: "programs tracked" },
    { value: "Free", label: "to check your odds" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="flex-1">
        {/* Hero: copy + a live product preview */}
        <section className="orb-glow">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
            <div className="flex flex-col items-start gap-6">
              <Badge variant={isLive ? "success" : "warning"}>
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 rounded-full",
                    isLive ? "bg-success" : "bg-warning",
                  )}
                />
                {isLive ? `Live data · ${dataLabel}` : dataLabel}
              </Badge>
              <h1 className="font-display text-5xl font-semibold leading-[1.03] tracking-tight sm:text-6xl">
                Get into a Korean university with{" "}
                <span className="italic text-primary">confidence</span>.
              </h1>
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                Enter your profile and see a ranked shortlist, a transparent
                admission-probability band for each program, and ready-to-edit
                application drafts — all built on real, sourced Korean
                university data.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link href="/check">
                    Check my chances — free
                    <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/signup">Create account</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                No sign-up needed for the free probability check.
              </p>
              <dl className="mt-2 flex flex-wrap gap-x-10 gap-y-4 border-t border-border/70 pt-6">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-display text-2xl font-semibold tabular-nums">
                      {s.value}
                    </dd>
                    <dd className="text-xs text-muted-foreground">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Product preview — the wow */}
            <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
              <div
                aria-hidden
                className="absolute -right-4 -top-4 hidden h-full w-full rounded-3xl border border-border bg-card/50 sm:block"
              />
              <Card className="hp-card relative overflow-hidden p-5 shadow-xl shadow-primary/10">
                <div className="flex items-center justify-between gap-3">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="size-4 text-primary" aria-hidden />
                    Your top matches
                  </p>
                  <Badge variant="success">12 matched</Badge>
                </div>
                <ul className="mt-4 flex flex-col gap-3">
                  {PREVIEW.map((p, i) => (
                    <li
                      key={p.slug}
                      className="hp-row flex items-center gap-3 rounded-xl border border-border bg-background/70 p-3"
                      style={{ animationDelay: `${0.2 + i * 0.13}s` }}
                    >
                      <UniversityLogo
                        slug={p.slug}
                        name={p.uni}
                        className="size-9"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium">
                            {p.program}
                          </p>
                          <Badge variant={p.variant}>{p.cat}</Badge>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {p.uni} · {p.band}
                        </p>
                        <div
                          className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary"
                          aria-hidden
                        >
                          <div
                            className="hp-bar h-full rounded-full bg-primary"
                            style={
                              {
                                "--w": `${p.pct}%`,
                                animationDelay: `${0.35 + i * 0.13}s`,
                              } as React.CSSProperties
                            }
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary/60 p-3">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <BadgeCheck className="size-3.5 text-success" aria-hidden />
                    Verified yearly cost
                  </p>
                  <p className="font-display text-sm font-semibold tabular-nums">
                    $12,422
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Social proof: a wall of real crests */}
        <section className="border-y border-border/60 bg-secondary/30">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Tracking {isLive ? counts.universities : 50} Korean universities —
              with verified, sourced data
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
              {TRUST_SLUGS.map((slug) => (
                <UniversityLogo
                  key={slug}
                  slug={slug}
                  name={slug.replace(/-/g, " ")}
                  className="size-12 shadow-sm"
                />
              ))}
            </div>
          </div>
        </section>

        {/* What you get */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need to apply with clarity
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              Four tools, one honest source of truth — from first shortlist to a
              submitted application.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <Card
                key={title}
                className="flex flex-col gap-3 p-6 transition-colors hover:border-primary/40"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Close — light, on-brand */}
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="orb-glow relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-b from-secondary/70 to-background px-6 py-16 text-center sm:py-20">
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
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
