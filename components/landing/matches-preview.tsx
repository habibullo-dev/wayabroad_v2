import { BadgeCheck, Sparkles } from "lucide-react";

import { Reveal } from "@/components/landing/reveal";
import { UniversityLogo } from "@/components/universities/university-logo";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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

export function MatchesPreview() {
  return (
    <Reveal
      variant="scale"
      className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none"
    >
      <div
        aria-hidden
        className="absolute -right-4 -top-4 hidden h-full w-full rounded-3xl border border-border bg-card/50 sm:block"
      />
      <Card className="relative overflow-hidden p-5 shadow-xl shadow-primary/10">
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
              className="flex items-center gap-3 rounded-xl border border-border bg-background/70 p-3"
            >
              <UniversityLogo slug={p.slug} name={p.uni} className="size-9" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{p.program}</p>
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
    </Reveal>
  );
}
