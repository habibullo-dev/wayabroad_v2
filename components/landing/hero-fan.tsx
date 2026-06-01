import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FanDeck, type FanCard } from "@/components/landing/fan-deck";
import { Button } from "@/components/ui/button";

export type { FanCard };

export function HeroFan({
  cards,
  badge,
  stats,
}: {
  cards: FanCard[];
  badge: React.ReactNode;
  stats: { value: string; label: string }[];
}) {
  return (
    <section className="orb-glow overflow-hidden">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 pb-4 pt-14 text-center sm:px-6 lg:pt-20">
        {badge}
        <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">
          Get into a Korean university with{" "}
          <span className="italic text-primary">confidence</span>.
        </h1>
        <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          See a ranked shortlist, a transparent admission-probability band for
          every program, and ready-to-edit application drafts — built on real,
          sourced data from Korea&rsquo;s top universities.
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

      {/* Fanned campus cards — spread apart as you scroll (components/landing/fan-deck). */}
      <FanDeck cards={cards} />

      <dl className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-4 pb-12 pt-2 sm:px-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <dt className="sr-only">{s.label}</dt>
            <dd className="font-display text-3xl font-semibold tabular-nums">
              {s.value}
            </dd>
            <dd className="text-xs text-muted-foreground">{s.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
