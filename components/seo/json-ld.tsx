import { APP_NAME } from "@/lib/config";
import { APP_URL } from "@/lib/env";

/**
 * Renders Organization + WebSite JSON-LD so search engines and social previews
 * resolve a branded entity for WayAbroad. Included once in the root layout.
 */
export function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: APP_NAME,
        url: APP_URL,
        logo: `${APP_URL}/icon.svg`,
        sameAs: [],
      },
      {
        "@type": "WebSite",
        name: APP_NAME,
        url: APP_URL,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
