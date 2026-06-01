"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Sets a CSS var `--p` (0 → 1 as the box travels through the viewport) on scroll.
 * Children with the `.parallax` utility translate by `--parallax` px for depth.
 * rAF-throttled, passive listeners, disabled under prefers-reduced-motion.
 */
export function Parallax({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.min(
        1,
        Math.max(0, (vh - rect.top) / (vh + rect.height)),
      );
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
    <div ref={ref} className={className} style={{ ["--p" as string]: "0.5" }}>
      {children}
    </div>
  );
}
