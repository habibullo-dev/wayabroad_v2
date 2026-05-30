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
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
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
            <h1 className="font-display text-4xl font-semibold leading-[1.05] sm:text-6xl">
              Get into a Korean university with{" "}
              <span className="text-primary">confidence</span>.
            </h1>
            <p className="max-w-xl text-pretty text-lg text-muted-foreground">
              WayAbroad turns your profile into a ranked shortlist, a
              transparent admission-probability score, and ready-to-edit
              application drafts — built on real Korean university data.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/signup">
                  Start free
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#features">How it works</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card. The free probability check arrives in M3.
            </p>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <Card key={title} className="flex flex-col gap-3 p-6">
                <span className="grid size-10 place-items-center rounded-lg bg-secondary text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h2 className="text-base font-semibold">{title}</h2>
                <p className="text-sm text-muted-foreground">{body}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
