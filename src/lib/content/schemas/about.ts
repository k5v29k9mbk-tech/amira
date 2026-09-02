// GENERATED FILE — do not edit by hand.
// Written by scripts/generate-content-schemas.ts from messages/en.json.
// Re-run `npm run content:schemas` after changing the catalogue.
//
// Chi è Amira: 74 strings across 2 section(s).
import { z } from "zod";

export const aboutSchema = z.object({
  about: z.object({
    meta: z.object({
      title: z.string(),
      description: z.string(),
    }),
    eyebrow: z.string(),
    titleA: z.string(),
    titleB: z.string(),
    lede: z.string(),
    portrait: z.string(),
    demoAlt: z.string(),
    certificateAlt: z.string(),
    readStory: z.string(),
    facts: z.object({
      years: z.object({
        value: z.string(),
        label: z.string(),
      }),
      students: z.object({
        value: z.string(),
        label: z.string(),
      }),
      reach: z.object({
        value: z.string(),
        label: z.string(),
      }),
    }),
    story: z.object({
      eyebrow: z.string(),
      title: z.string(),
      role: z.string(),
      imageAlt: z.string(),
      p1: z.string(),
      p2: z.string(),
      p3: z.string(),
      p4: z.string(),
      signature: z.string(),
    }),
    different: z.object({
      eyebrow: z.string(),
      title: z.string(),
      sub: z.string(),
      items: z.object({
        experience: z.object({
          title: z.string(),
          body: z.string(),
        }),
        small: z.object({
          title: z.string(),
          body: z.string(),
        }),
        support: z.object({
          title: z.string(),
          body: z.string(),
        }),
      }),
    }),
    beyond: z.object({
      eyebrow: z.string(),
      title: z.string(),
      sub: z.string(),
      items: z.object({
        mindset: z.string(),
        marketing: z.string(),
        clients: z.string(),
        consultation: z.string(),
        photography: z.string(),
        communication: z.string(),
        branding: z.string(),
        growth: z.string(),
      }),
    }),
    mission: z.object({
      eyebrow: z.string(),
      quote: z.string(),
      body: z.string(),
    }),
    vision: z.object({
      eyebrow: z.string(),
      title: z.string(),
      body: z.string(),
      closing: z.string(),
      points: z.object({
        quality: z.string(),
        professionalism: z.string(),
        innovation: z.string(),
        growth: z.string(),
      }),
    }),
    cta: z.object({
      title: z.string(),
      body: z.string(),
    }),
  }),
  instructor: z.object({
    title: z.string(),
    role: z.string(),
    mission: z.string(),
    body: z.string(),
    valuesLabel: z.string(),
    values: z.object({
      professionalism: z.string(),
      quality: z.string(),
      innovation: z.string(),
      ethics: z.string(),
      growth: z.string(),
    }),
    portrait: z.string(),
    headline: z.string(),
    statementA: z.string(),
    statementB: z.string(),
    bio: z.string(),
    credit: z.string(),
  }),
});

export type AboutContent = z.infer<typeof aboutSchema>;
