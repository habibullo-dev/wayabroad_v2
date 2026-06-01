import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Parallax } from "@/components/landing/parallax";
import { Reveal } from "@/components/landing/reveal";
import { Button } from "@/components/ui/button";

export function CampusHero({
  img,
  name,
  count,
}: {
  img: string;
  name: string;
  count: number;
}) {
  return (
    <section className="relative w-full overflow-hidden">
      <Parallax className="relative h-[58vh] min-h-[420px] w-full">
        <Image
          src={img}
          alt={`${name} campus`}
          fill
          sizes="100vw"
          style={{ ["--parallax" as string]: "-90" }}
          className="parallax scale-[1.18] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/10" />
        <div className="absolute inset-0 flex items-end">
          <Reveal className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16">
            <p className="text-xs font-medium uppercase tracking-widest text-white/70">
              Your campus is waiting
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
              Picture yourself in <span className="italic">Korea</span>.
            </h2>
            <p className="mt-3 max-w-md text-pretty leading-relaxed text-white/80">
              Real campuses, verified costs, honest odds — explore {count}{" "}
              universities and find where you belong.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/universities">
                  Explore universities
                  <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <Link href="/check">Check my chances</Link>
              </Button>
            </div>
            <p className="mt-5 text-xs text-white/50">Pictured: {name}</p>
          </Reveal>
        </div>
      </Parallax>
    </section>
  );
}
