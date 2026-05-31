import Link from "next/link";
import {
  ArrowRight,
  FileText,
  GraduationCap,
  Sparkles,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppHeader } from "@/components/layout/app-header";
import { SiteFooter } from "@/components/layout/site-footer";
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
    body: "A transparent % chance per program — with its drivers and a confidence band.",
  },
  {
    icon: FileText,
    title: "SOP & Study Plan drafts",
    body: "Instant, editable drafts tailored to your target program.",
  },
  {
    icon: Wallet,
    title: "Cost transparency",
    body: "Tuition, dorm, visa and living costs in one honest breakdown.",
  },
] as const;

export default async function HomePage() {
  const { data: counts, source } = await getReferenceCounts();
  const dataLabel =
    source === "live"
      ? `${counts.universities} universities · ${counts.programs} programs`
      : "Sample data";

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="flex-1">
        <section className="orb-glow mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-32">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <Badge variant={source === "live" ? "success" : "warning"}>
              <span
                aria-hidden
                className={cn(
                  "size-1.5 rounded-full",
                  source === "live" ? "bg-success" : "bg-warning",
                )}
              />
              {source === "live" ? `Live data · ${dataLabel}` : dataLabel}
            </Badge>
            <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">
              Get into a Korean university with{" "}
              <span className="italic text-primary">confidence</span>.
            </h1>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              WayAbroad turns your profile into a ranked shortlist, a
              transparent admission-probability score, and ready-to-edit
              application drafts — built on real Korean university data.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
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
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <Card
                key={title}
                className="flex flex-col gap-3 p-6 transition-colors hover:border-primary/40"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h2 className="text-base font-semibold">{title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="orb-glow overflow-hidden rounded-3xl bg-ink px-6 py-16 text-center text-ink-foreground sm:py-20">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              Your Korean university,{" "}
              <span className="italic text-sky-400">within reach</span>.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-pretty text-ink-foreground/70">
              Start with a free probability check — no sign-up — or create an
              account for your full ranked shortlist.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/signup">
                  Create a free account
                  <ArrowRight />
                </Link>
              </Button>
              <Link
                href="/check"
                className="rounded-full px-4 py-2 text-sm font-medium text-ink-foreground/80 underline-offset-4 transition-colors hover:text-ink-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--ink))]"
              >
                or try the free check →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
