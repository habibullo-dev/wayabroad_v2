"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export type FanCard = { slug: string; name: string; img: string };

// Resting fan + how each card responds to scroll: `spread` pushes it outward,
// `par` drifts it down (back cards move more → depth). Middle card sits on top.
const FAN = [
  { rotate: -13, y: "translate-y-8", z: 10, mobile: false, spread: -68, par: 56 },
  { rotate: 7, y: "translate-y-2", z: 20, mobile: true, spread: -32, par: 30 },
  { rotate: -3, y: "translate-y-0", z: 30, mobile: true, spread: 0, par: 12 },
  { rotate: 9, y: "translate-y-3", z: 20, mobile: true, spread: 32, par: 30 },
  { rotate: -8, y: "translate-y-10", z: 10, mobile: false, spread: 68, par: 56 },
];

export function FanDeck({ cards }: { cards: FanCard[] }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const fan = cards.slice(0, 5);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 while the deck sits near the top → 1 as it scrolls up out of view.
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh * 1.1) - 0.15));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="mx-auto flex max-w-5xl items-end justify-center px-4 pb-6 pt-4"
      style={{ ["--p" as string]: "0" }}
    >
      {fan.map((c, i) => {
        const f = FAN[i];
        if (!f) return null;
        return (
          <div
            key={c.slug}
            className={cn(
              "relative shrink-0 transition-transform duration-100 ease-out",
              i > 0 && "-ml-8 sm:-ml-10",
              f.y,
              !f.mobile && "hidden sm:block",
            )}
            style={{
              transform: `rotate(${f.rotate}deg) translate3d(calc(var(--p, 0) * ${f.spread}px), calc(var(--p, 0) * ${f.par}px), 0)`,
              zIndex: f.z,
            }}
          >
            <div
              className="fan-card"
              style={{ animationDelay: `${0.15 + i * 0.1}s` }}
            >
              <Link
                href={`/universities/${c.slug}`}
                className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="relative h-52 w-36 overflow-hidden rounded-2xl border-4 border-card bg-secondary shadow-xl shadow-ink/10 transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:scale-[1.03] sm:h-72 sm:w-52">
                  <Image
                    src={c.img}
                    alt={c.name}
                    fill
                    sizes="(min-width:640px) 208px, 144px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent p-3 pt-10">
                    <p className="truncate text-xs font-semibold text-white sm:text-sm">
                      {c.name}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
