// GENERATED FILE — do not edit by hand.
// Written by scripts/generate-content-schemas.ts from messages/en.json.
// Re-run `npm run content:schemas` after changing the catalogue.
//
// Informativa privacy: 24 strings across 1 section(s).
import { z } from "zod";

export const privacySchema = z.object({
  privacy: z.object({
    meta: z.object({
      title: z.string(),
      description: z.string(),
    }),
    eyebrow: z.string(),
    title: z.string(),
    updated: z.string(),
    lede: z.string(),
    sections: z.object({
      controller: z.object({
        title: z.string(),
        body: z.string(),
      }),
      data: z.object({
        title: z.string(),
        body: z.string(),
      }),
      purpose: z.object({
        title: z.string(),
        body: z.string(),
      }),
      basis: z.object({
        title: z.string(),
        body: z.string(),
      }),
      recipients: z.object({
        title: z.string(),
        body: z.string(),
      }),
      retention: z.object({
        title: z.string(),
        body: z.string(),
      }),
      cookies: z.object({
        title: z.string(),
        body: z.string(),
      }),
      rights: z.object({
        title: z.string(),
        body: z.string(),
      }),
      contact: z.object({
        title: z.string(),
        body: z.string(),
      }),
    }),
  }),
});

export type PrivacyContent = z.infer<typeof privacySchema>;
