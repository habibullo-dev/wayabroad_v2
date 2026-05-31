import Image from "next/image";

import { getUniversityMedia } from "@/lib/data/university-media";

/**
 * Campus photo gallery for a university detail page: a wide hero banner plus a grid of
 * supporting photos. Renders null for universities without curated media.
 */
export function UniversityGallery({ slug }: { slug: string }) {
  const media = getUniversityMedia(slug);
  if (!media || (!media.hero && media.gallery.length === 0)) return null;

  return (
    <section className="mt-6" aria-label="Campus photos">
      {media.hero && (
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl border border-border">
          <Image
            src={media.hero.src}
            alt={media.hero.alt}
            fill
            priority
            sizes="(min-width: 1024px) 64rem, 100vw"
            className="object-cover"
          />
        </div>
      )}
      {media.gallery.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {media.gallery.map((photo) => (
            <div
              key={photo.src}
              className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 32rem, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
