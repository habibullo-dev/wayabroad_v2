import { UniversityLogo } from "@/components/universities/university-logo";

/**
 * A seamless right-to-left marquee of university crests (social proof). The slug list is
 * rendered twice so the track loops with no seam; pauses on hover and collapses to a static
 * centered wrap under prefers-reduced-motion. Pure CSS (see .marquee in globals.css).
 */
export function CrestMarquee({ slugs }: { slugs: string[] }) {
  const items = [...slugs, ...slugs];
  return (
    <div className="marquee" role="img" aria-label="Universities tracked by WayAbroad">
      <ul className="marquee-track">
        {items.map((slug, i) => (
          <li key={i} className="shrink-0 pr-8" aria-hidden={i >= slugs.length}>
            <UniversityLogo
              slug={slug}
              name={slug.replace(/-/g, " ")}
              className="size-12 shadow-sm"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
