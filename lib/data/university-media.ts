/**
 * Per-university imagery (logo + campus photos), keyed by slug. Files live under
 * `public/universities/<slug>/`. Only universities listed here show a logo on the
 * listing and a photo gallery on their detail page; everyone else degrades cleanly.
 *
 * Curated by hand for now (SNU only) — not in the database.
 */
export interface UniversityPhoto {
  src: string;
  alt: string;
}

export interface UniversityMedia {
  /** Square-ish logo, shown on the listing card and the detail header. */
  logo: string;
  /** Wide banner image for the top of the detail page. */
  hero?: UniversityPhoto;
  /** Supporting campus photos for the detail gallery. */
  gallery: UniversityPhoto[];
}

const UNIVERSITY_MEDIA: Record<string, UniversityMedia> = {
  "seoul-national-university": {
    logo: "/universities/snu/logo.png",
    hero: {
      src: "/universities/snu/main.jpg",
      alt: "Seoul National University main campus",
    },
    gallery: [
      {
        src: "/universities/snu/additional.jpg",
        alt: "Seoul National University campus grounds",
      },
      {
        src: "/universities/snu/people.png",
        alt: "Students at Seoul National University",
      },
    ],
  },
};

export function getUniversityMedia(slug: string): UniversityMedia | null {
  return UNIVERSITY_MEDIA[slug] ?? null;
}
