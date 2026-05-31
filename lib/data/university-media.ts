/**
 * Per-university imagery (logo + campus photos), keyed by slug. Files live under
 * `public/universities/<slug>/`. Only universities listed here show a logo on the
 * listing and a photo gallery on their detail page; everyone else degrades cleanly.
 *
 * Generated from public/universities/ (scripts/gen-media). Logos + campus photos for the
 * bulk of universities were imported + optimized from the hand-collected v1 dataset; SNU
 * additionally has curated supporting photos.
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
  "ajou-university": {
    logo: "/universities/ajou-university/logo.png",
    hero: {
      src: "/universities/ajou-university/main.jpg",
      alt: "Ajou University main campus",
    },
    gallery: [],
  },
  "chonnam-national-university": {
    logo: "/universities/chonnam-national-university/logo.png",
    hero: {
      src: "/universities/chonnam-national-university/main.jpg",
      alt: "Chonnam National University main campus",
    },
    gallery: [],
  },
  "chung-ang-university": {
    logo: "/universities/chung-ang-university/logo.png",
    hero: {
      src: "/universities/chung-ang-university/main.jpg",
      alt: "Chung-Ang University main campus",
    },
    gallery: [],
  },
  "chungnam-national-university": {
    logo: "/universities/chungnam-national-university/logo.png",
    hero: {
      src: "/universities/chungnam-national-university/main.jpg",
      alt: "Chungnam National University main campus",
    },
    gallery: [],
  },
  "dongguk-university": {
    logo: "/universities/dongguk-university/logo.png",
    hero: {
      src: "/universities/dongguk-university/main.jpg",
      alt: "Dongguk University main campus",
    },
    gallery: [],
  },
  "ewha-womans-university": {
    logo: "/universities/ewha-womans-university/logo.png",
    hero: {
      src: "/universities/ewha-womans-university/main.jpg",
      alt: "Ewha Womans University main campus",
    },
    gallery: [],
  },
  "hankuk-university-of-foreign-studies-hufs": {
    logo: "/universities/hankuk-university-of-foreign-studies-hufs/logo.png",
    hero: {
      src: "/universities/hankuk-university-of-foreign-studies-hufs/main.jpg",
      alt: "Hankuk University of Foreign Studies (HUFS) main campus",
    },
    gallery: [],
  },
  "hanyang-university": {
    logo: "/universities/hanyang-university/logo.png",
    hero: {
      src: "/universities/hanyang-university/main.jpg",
      alt: "Hanyang University main campus",
    },
    gallery: [],
  },
  "inha-university": {
    logo: "/universities/inha-university/logo.png",
    hero: {
      src: "/universities/inha-university/main.jpg",
      alt: "Inha University main campus",
    },
    gallery: [],
  },
  "jeonbuk-national-university": {
    logo: "/universities/jeonbuk-national-university/logo.png",
    hero: {
      src: "/universities/jeonbuk-national-university/main.jpg",
      alt: "Jeonbuk National University main campus",
    },
    gallery: [],
  },
  kaist: {
    logo: "/universities/kaist/logo.png",
    hero: {
      src: "/universities/kaist/main.jpg",
      alt: "KAIST main campus",
    },
    gallery: [],
  },
  "konkuk-university": {
    logo: "/universities/konkuk-university/logo.png",
    hero: {
      src: "/universities/konkuk-university/main.jpg",
      alt: "Konkuk University main campus",
    },
    gallery: [],
  },
  "korea-university": {
    logo: "/universities/korea-university/logo.png",
    hero: {
      src: "/universities/korea-university/main.jpg",
      alt: "Korea University main campus",
    },
    gallery: [],
  },
  "kyung-hee-university": {
    logo: "/universities/kyung-hee-university/logo.png",
    hero: {
      src: "/universities/kyung-hee-university/main.jpg",
      alt: "Kyung Hee University main campus",
    },
    gallery: [],
  },
  "kyungpook-national-university": {
    logo: "/universities/kyungpook-national-university/logo.png",
    hero: {
      src: "/universities/kyungpook-national-university/main.jpg",
      alt: "Kyungpook National University main campus",
    },
    gallery: [],
  },
  "pusan-national-university": {
    logo: "/universities/pusan-national-university/logo.png",
    hero: {
      src: "/universities/pusan-national-university/main.jpg",
      alt: "Pusan National University main campus",
    },
    gallery: [],
  },
  "sejong-university": {
    logo: "/universities/sejong-university/logo.png",
    hero: {
      src: "/universities/sejong-university/main.jpg",
      alt: "Sejong University main campus",
    },
    gallery: [],
  },
  "seoul-national-university": {
    logo: "/universities/seoul-national-university/logo.png",
    hero: {
      src: "/universities/seoul-national-university/main.jpg",
      alt: "Seoul National University main campus",
    },
    gallery: [
      {
        src: "/universities/seoul-national-university/additional.jpg",
        alt: "Seoul National University campus grounds",
      },
      {
        src: "/universities/seoul-national-university/people.png",
        alt: "Students at Seoul National University",
      },
    ],
  },
  "sungkyunkwan-university-skku": {
    logo: "/universities/sungkyunkwan-university-skku/logo.png",
    hero: {
      src: "/universities/sungkyunkwan-university-skku/main.jpg",
      alt: "Sungkyunkwan University (SKKU) main campus",
    },
    gallery: [],
  },
  "ulsan-national-institute-of-science-and-technology-unist": {
    logo: "/universities/ulsan-national-institute-of-science-and-technology-unist/logo.png",
    hero: {
      src: "/universities/ulsan-national-institute-of-science-and-technology-unist/main.jpg",
      alt: "Ulsan National Institute of Science and Technology (UNIST) main campus",
    },
    gallery: [],
  },
  "university-of-seoul": {
    logo: "/universities/university-of-seoul/logo.png",
    hero: {
      src: "/universities/university-of-seoul/main.jpg",
      alt: "University of Seoul main campus",
    },
    gallery: [],
  },
  "yonsei-university": {
    logo: "/universities/yonsei-university/logo.png",
    hero: {
      src: "/universities/yonsei-university/main.jpg",
      alt: "Yonsei University main campus",
    },
    gallery: [],
  },
};

export function getUniversityMedia(slug: string): UniversityMedia | null {
  return UNIVERSITY_MEDIA[slug] ?? null;
}
