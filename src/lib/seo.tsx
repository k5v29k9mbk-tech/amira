import { courses } from "@/lib/courses";
import { instagramLink, studio, whatsappLink } from "@/lib/studio";
import { siteUrl } from "@/i18n/routing";

/**
 * schema.org payloads. Search engines read these to build rich results: the
 * course cards, the FAQ dropdowns under the listing, and the knowledge panel.
 *
 * Every field is drawn from something the studio actually publishes. No
 * aggregateRating and no review markup: inventing either is both dishonest and
 * a manual-action risk.
 */

export function organizationSchema(locale: string, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${siteUrl}/#organization`,
    name,
    description,
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/icon`,
    image: `${siteUrl}/brand/amira-hero.jpg`,
    email: studio.email,
    telephone: studio.phone,
    sameAs: [instagramLink, whatsappLink],
    areaServed: ["Tortoreto", "Roma", "Milano"].map((n) => ({
      "@type": "City",
      name: n,
    })),
    founder: {
      "@type": "Person",
      name: "Amira Bechini",
      jobTitle: "Master PMU artist and trainer",
    },
  };
}

export function courseSchema(
  locale: string,
  slug: string,
  name: string,
  description: string,
) {
  const course = courses.find((c) => c.slug === slug)!;

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url: `${siteUrl}/${locale}/courses/${slug}`,
    image: `${siteUrl}${course.image}`,
    inLanguage: locale,
    provider: { "@id": `${siteUrl}/#organization` },
    offers: {
      "@type": "Offer",
      price: course.priceEur,
      priceCurrency: "EUR",
      category: "Paid",
      url: `${siteUrl}/${locale}/courses/${slug}`,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `PT${course.hours}H`,
    },
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
