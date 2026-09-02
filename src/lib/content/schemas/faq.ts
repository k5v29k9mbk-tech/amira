// GENERATED FILE — do not edit by hand.
// Written by scripts/generate-content-schemas.ts from messages/en.json.
// Re-run `npm run content:schemas` after changing the catalogue.
//
// Domande frequenti: 27 strings across 1 section(s).
import { z } from "zod";

export const faqSchema = z.object({
  faq: z.object({
    title: z.string(),
    more: z.string(),
    items: z.object({
      courses: z.object({
        q: z.string(),
        a: z.string(),
      }),
      duration: z.object({
        q: z.string(),
        a: z.string(),
      }),
      price: z.object({
        q: z.string(),
        a: z.string(),
      }),
      includes: z.object({
        q: z.string(),
        a: z.string(),
      }),
      kit: z.object({
        q: z.string(),
        a: z.string(),
      }),
      students: z.object({
        q: z.string(),
        a: z.string(),
      }),
      certificate: z.object({
        q: z.string(),
        a: z.string(),
      }),
      language: z.object({
        q: z.string(),
        a: z.string(),
      }),
      booking: z.object({
        q: z.string(),
        a: z.string(),
      }),
      location: z.object({
        q: z.string(),
        a: z.string(),
      }),
      beginners: z.object({
        q: z.string(),
        a: z.string(),
      }),
    }),
    viewAll: z.string(),
    meta: z.object({
      title: z.string(),
      description: z.string(),
    }),
  }),
});

export type FaqContent = z.infer<typeof faqSchema>;
