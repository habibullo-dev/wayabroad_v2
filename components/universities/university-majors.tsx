import { ChevronDown } from "lucide-react";

import {
  getUniversityMajors,
  type MajorGroup,
} from "@/lib/data/university-majors";

function total(groups: MajorGroup[]): number {
  return groups.reduce((n, g) => n + g.majors.length, 0);
}

function Track({ label, groups }: { label: string; groups: MajorGroup[] }) {
  if (groups.length === 0) return null;
  return (
    <details className="group rounded-lg border border-border bg-card">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <span>
          {label}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            {total(groups)} majors · {groups.length} colleges
          </span>
        </span>
        <ChevronDown
          className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="flex flex-col gap-3 border-t border-border/60 p-4 pt-3">
        {groups.map((g) => (
          <div key={g.college}>
            <p className="text-sm font-semibold">{g.college}</p>
            <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
              {g.majors.join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </details>
  );
}

/**
 * Full majors catalog (by college, English/Korean tracks) for a university — a curated
 * reference list, distinct from the ranked DB programs. Collapsed by default; renders
 * null when no catalog exists for the slug.
 */
export function UniversityMajors({ slug }: { slug: string }) {
  const majors = getUniversityMajors(slug);
  if (!majors) return null;

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-semibold">
        All programs &amp; majors
      </h2>
      <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
        The university&rsquo;s full catalog by college and track. The ones
        WayAbroad tracks — with admission odds and cost — are in “Apply to”
        above. Confirm current offerings with the university.
      </p>
      <div className="mt-3 flex flex-col gap-3">
        <Track label="English-taught" groups={majors.english} />
        <Track label="Korean-taught" groups={majors.korean} />
      </div>
    </section>
  );
}
