// GENERATED FILE — do not edit by hand.
// Written by scripts/generate-content-schemas.ts from messages/en.json.
// Re-run `npm run content:schemas` after changing the catalogue.
//
// Contatti: 25 strings across 1 section(s).
import { z } from "zod";

export const contactSchema = z.object({
  contact: z.object({
    title: z.string(),
    sub: z.string(),
    venue: z.string(),
    map: z.string(),
    channels: z.string(),
    whatsapp: z.string(),
    whatsappMessage: z.string(),
    instagram: z.string(),
    tiktok: z.string(),
    facebook: z.string(),
    pec: z.string(),
    name: z.string(),
    email: z.string(),
    subject: z.string(),
    message: z.string(),
    send: z.string(),
    sending: z.string(),
    sent: z.string(),
    error: z.string(),
    required: z.string(),
    meta: z.object({
      title: z.string(),
      description: z.string(),
    }),
    privacyNote: z.string(),
    privacyLink: z.string(),
    pecLabel: z.string(),
  }),
});

export type ContactContent = z.infer<typeof contactSchema>;
