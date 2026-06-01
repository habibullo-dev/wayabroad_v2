import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { Reveal } from "@/components/landing/reveal";
import { cn } from "@/lib/utils";

export type GalleryUni = {
  slug: string;
  name: string;
  city: string | null;
  img: string;
};

export function UniversityGallery({
  universities,
  total,
}: {
  universities: GalleryUni[];
  total: number;
}) {
  const moreCount = Math.max(0, total - universities.length);
  return (
    <section className="py-16 sm:py-20">
      <Reveal className="mx-auto flex max-w-6xl items-end justify-between gap-4 px-4 sm:px-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            Explore
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Korea&rsquo;s universities, up close
          </h2>
        </div>
        <Link
          href="/universities"
          className="hidden shrink-0 rounded text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:inline-flex sm:items-center sm:gap-1"
        >
          View all <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Reveal>

      <div className="no-scrollbar mt-8 flex snap-x gap-5 overflow-x-auto px-4 pb-8 pt-2 sm:px-6 lg:px-[max(1.5rem,calc((100vw-72rem)/2))]">
        {universities.map((u, i) => (
          <Reveal
            key={u.slug}
            variant="up"
            delay={i * 70}
            className="shrink-0 snap-start"
          >
            <Link
              href={`/universities/${u.slug}`}
              className={cn(
                "group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                i % 2 === 1 && "sm:translate-y-7",
              )}
            >
              <div className="relative h-64 w-48 overflow-hidden rounded-2xl border border-border bg-secondary shadow-md sm:h-80 sm:w-64">
                <Image
                  src={u.img}
                  alt={u.name}
                  fill
                  sizes="(min-width:640px) 256px, 192px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-display text-lg font-semibold leading-tight text-white">
                    {u.name}
                  </h3>
                  {u.city && (
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-white/80">
                      <MapPin className="size-3" aria-hidden />
                      {u.city}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
        <Link
          href="/universities"
          className="group flex shrink-0 snap-start items-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="flex h-64 w-44 flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-border bg-card text-center transition-colors group-hover:border-primary/50 sm:h-80">
            <span className="font-display text-3xl font-semibold text-primary">
              +{moreCount}
            </span>
            <span className="px-4 text-sm text-muted-foreground">
              more universities
            </span>
            <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary">
              View all <ArrowRight className="size-4" aria-hidden />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
