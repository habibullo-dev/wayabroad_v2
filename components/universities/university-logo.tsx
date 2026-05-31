import Image from "next/image";

import { getUniversityMedia } from "@/lib/data/university-media";
import { cn } from "@/lib/utils";

/**
 * University logo on a neutral chip. Renders null for universities without curated media,
 * so callers can drop it in unconditionally. Size comes from `className` (e.g. `size-12`).
 */
export function UniversityLogo({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const media = getUniversityMedia(slug);
  if (!media) return null;

  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-white",
        className,
      )}
    >
      <Image
        src={media.logo}
        alt={`${name} logo`}
        fill
        sizes="64px"
        className="object-contain p-1.5"
      />
    </span>
  );
}
