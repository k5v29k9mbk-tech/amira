import {
  academy,
  brand,
  instagramLink,
  legal,
  studio,
  tiktokLink,
  whatsappLink,
} from "@/lib/studio";
import { siteUrl } from "@/i18n/routing";

/**
 * schema.org payloads. Search engines read these to build rich results: the
 * course cards, the FAQ dropdowns under the listing, and the knowledge panel.
 *
 * Every field is drawn from the academy's own official information. There is
 * deliberately no aggregateRating and no review markup — inventing either is
 * both dishonest and a manual-action risk — and no `offers` block, because the
 * academy quotes per course rather than publishing a price.
 */

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: academy.street,
  postalCode: academy.postcode,
  addressLocality: academy.city,
  addressRegion: academy.province,
  addressCountry: academy.country,
} as const;

export function organizationSchema(locale: string, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${siteUrl}/#organization`,
    name,
    legalName: legal.company,
    description,
    url: `${siteUrl}/${locale}`,
    // The real plate rather than the tab tile: search engines render this one.
    logo: `${siteUrl}/brand/aura-logo-dark.png`,
    image: `${siteUrl}/brand/amira-hero.jpg`,
    email: studio.pec,
    vatID: legal.vat,
    address: postalAddress,
    // Only the channels the academy actually supplied a handle or number for.
    sameAs: [instagramLink, tiktokLink, whatsappLink].filter(Boolean),
    founder: {
      "@type": "Person",
      name: brand.founder,
      jobTitle: "International PMU Master",
    },
  };
}

/**
 * The six courses as one ItemList. The academy publishes names and a shared set
 * of conditions rather than per-course syllabuses or prices, so each entry
 * carries what is actually known: name, provider, language and an on-site
 * instance at the academy's address.
 */
export function courseListSchema(locale: string, names: string[], description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: names.map((name, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Course",
        name,
        description,
        url: `${siteUrl}/${locale}/courses`,
        provider: { "@id": `${siteUrl}/#organization` },
        // The courses are taught in Italian, whatever language the page is in.
        inLanguage: "it",
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "onsite",
          location: {
            "@type": "Place",
            name: brand.full,
            address: postalAddress,
          },
        },
      },
    })),
  };
}

/**
 * The founder as an entity of her own, emitted on the about page. Search
 * engines link it to the organisation payload through `worksFor`, so the
 * academy and the person it is built on resolve as one knowledge graph.
 */
export function personSchema(locale: string, jobTitle: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#founder`,
    name: brand.founder,
    jobTitle,
    description,
    url: `${siteUrl}/${locale}/about`,
    image: `${siteUrl}/brand/amira-studio.jpg`,
    worksFor: { "@id": `${siteUrl}/#organization` },
    sameAs: [instagramLink, tiktokLink],
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/** Renders one payload. Server component, so it costs no client JavaScript. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
