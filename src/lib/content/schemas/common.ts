// GENERATED FILE — do not edit by hand.
// Written by scripts/generate-content-schemas.ts from messages/en.json.
// Re-run `npm run content:schemas` after changing the catalogue.
//
// Elementi comuni: 44 strings across 7 section(s).
import { z } from "zod";

export const commonSchema = z.object({
  meta: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
  }),
  nav: z.object({
    home: z.string(),
    courses: z.string(),
    about: z.string(),
    method: z.string(),
    faq: z.string(),
    contact: z.string(),
    language: z.string(),
    menu: z.string(),
    close: z.string(),
    book: z.string(),
    skip: z.string(),
    loading: z.string(),
    work: z.string(),
    pathway: z.string(),
  }),
  cta: z.object({
    courses: z.string(),
    course: z.string(),
    info: z.string(),
    consultation: z.string(),
  }),
  footer: z.object({
    tagline: z.string(),
    explore: z.string(),
    nav: z.string(),
    studio: z.string(),
    legal: z.string(),
    activity: z.string(),
    vat: z.string(),
    rea: z.string(),
    rights: z.string(),
    faq: z.string(),
    privacy: z.string(),
  }),
  sections: z.object({
    courses: z.string(),
    method: z.string(),
    work: z.string(),
    amira: z.string(),
    inside: z.string(),
    authority: z.string(),
    pathway: z.string(),
    experience: z.string(),
    receive: z.string(),
  }),
  intro: z.object({
    skip: z.string(),
  }),
  notFound: z.object({
    title: z.string(),
    body: z.string(),
  }),
});

export type CommonContent = z.infer<typeof commonSchema>;
