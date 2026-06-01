"use client";

import { useEffect, useState } from "react";

const WORD = "WayAbroad";
const DURATION = 2700; // keep in sync with the wa-fade keyframe in globals.css

/**
 * First-load intro: a paper plane flies across, revealing each letter of "WayAbroad"
 * in its wake; once the plane has gone, the whole wordmark stands complete, then the
 * overlay fades. Shows once per session and respects prefers-reduced-motion.
 */
export function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || sessionStorage.getItem("wa-preloaded")) {
      setShow(false);
      return;
    }
    sessionStorage.setItem("wa-preloaded", "1");
    const timer = setTimeout(() => setShow(false), DURATION);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="wa-preloader" role="status" aria-label="Loading WayAbroad">
      <div className="wa-stage orb-glow">
        <div className="wa-flightzone" aria-hidden>
          <span className="wa-trail" />
          <span className="wa-plane">
            <span className="wa-airplane">
              <span className="wa-body" />
              <span className="wa-wing-l" />
              <span className="wa-wing-r" />
            </span>
          </span>
        </div>
        <div className="wa-word font-display" aria-hidden>
          {WORD.split("").map((ch, i) => (
            <span
              key={i}
              className="wa-letter"
              style={{ animationDelay: `${0.2 + i * 0.15}s` }}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
