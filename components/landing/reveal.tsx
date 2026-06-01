"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Variant = "up" | "left" | "right" | "scale";

/**
 * Reveals its children with a transition the first time it scrolls into view.
 * Motion happens AS YOU SCROLL — not once on page load — which is what makes the
 * page feel alive rather than pre-animated. Honors prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  variant = "up",
  delay = 0,
  amount = 0.18,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  delay?: number;
  amount?: number;
  as?: React.ElementType;
}) {
  const ref = React.useRef<HTMLElement>(null);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShow(true);
            io.disconnect();
          }
        }
      },
      { threshold: amount, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      data-show={show}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}
