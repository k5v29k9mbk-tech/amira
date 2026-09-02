// GENERATED FILE — do not edit by hand.
// Written by scripts/generate-content-schemas.ts from messages/en.json.
// Re-run `npm run content:schemas` after changing the catalogue.
//
// Corsi: 110 strings across 2 section(s).
import { z } from "zod";

export const catalogSchema = z.object({
  catalog: z.object({
    eyebrow: z.string(),
    title: z.string(),
    sub: z.string(),
    courses: z.object({
      microblading: z.string(),
      "powder-brows": z.string(),
      "lip-blush": z.string(),
      "eyeliner-pmu": z.string(),
      "lash-lamination": z.string(),
      "brow-lamination": z.string(),
    }),
    detailsTitle: z.string(),
    details: z.object({
      duration: z.object({
        label: z.string(),
        value: z.string(),
      }),
      level: z.object({
        label: z.string(),
        value: z.string(),
      }),
      language: z.object({
        label: z.string(),
        value: z.string(),
      }),
      students: z.object({
        label: z.string(),
        value: z.string(),
      }),
      kit: z.object({
        label: z.string(),
        value: z.string(),
      }),
      certificate: z.object({
        label: z.string(),
        value: z.string(),
      }),
      location: z.object({
        label: z.string(),
        value: z.string(),
      }),
    }),
    includes: z.string(),
    included: z.object({
      theory: z.string(),
      practice: z.string(),
      model: z.string(),
      support: z.string(),
    }),
    privateNote: z.string(),
    paymentsLabel: z.string(),
    payments: z.string(),
    selectorTitle: z.string(),
    viewCourse: z.string(),
    blurbs: z.object({
      microblading: z.string(),
      "powder-brows": z.string(),
      "lip-blush": z.string(),
      "eyeliner-pmu": z.string(),
      "lash-lamination": z.string(),
      "brow-lamination": z.string(),
    }),
    families: z.object({
      brows: z.object({
        title: z.string(),
        sub: z.string(),
      }),
      lips: z.object({
        title: z.string(),
        sub: z.string(),
      }),
      eyes: z.object({
        title: z.string(),
        sub: z.string(),
      }),
      lashes: z.object({
        title: z.string(),
        sub: z.string(),
      }),
    }),
  }),
  programs: z.object({
    eyebrow: z.string(),
    title: z.string(),
    sub: z.string(),
    backToAll: z.string(),
    keyInfoTitle: z.string(),
    labels: z.object({
      level: z.string(),
      duration: z.string(),
      seats: z.string(),
      location: z.string(),
      certificate: z.string(),
      model: z.string(),
      language: z.string(),
    }),
    values: z.object({
      seats: z.string(),
      certificate: z.string(),
      model: z.string(),
    }),
    promise: z.object({
      eyebrow: z.string(),
      title: z.string(),
      body: z.string(),
    }),
    forWho: z.object({
      eyebrow: z.string(),
      title: z.string(),
      baseLabel: z.string(),
      advancedLabel: z.string(),
    }),
    levels: z.object({
      labels: z.object({
        for: z.string(),
        experience: z.string(),
        goal: z.string(),
        practice: z.string(),
        outcome: z.string(),
      }),
      base: z.object({
        for: z.string(),
        experience: z.string(),
        goal: z.string(),
        practice: z.string(),
        outcome: z.string(),
      }),
      advanced: z.object({
        for: z.string(),
        experience: z.string(),
        goal: z.string(),
        practice: z.string(),
        outcome: z.string(),
      }),
    }),
    notFor: z.object({
      title: z.string(),
      items: z.object({
        quick: z.string(),
        broad: z.string(),
        passive: z.string(),
      }),
    }),
    mastery: z.object({
      eyebrow: z.string(),
      title: z.string(),
    }),
    curriculum: z.object({
      eyebrow: z.string(),
      title: z.string(),
      day: z.string(),
    }),
    included: z.object({
      eyebrow: z.string(),
      title: z.string(),
    }),
    scarcity: z.object({
      eyebrow: z.string(),
      title: z.string(),
      body: z.string(),
    }),
    instructor: z.object({
      eyebrow: z.string(),
      title: z.string(),
    }),
    work: z.object({
      eyebrow: z.string(),
      title: z.string(),
      sub: z.string(),
    }),
    faq: z.object({
      eyebrow: z.string(),
      title: z.string(),
    }),
    apply: z.object({
      eyebrow: z.string(),
      title: z.string(),
      body: z.string(),
    }),
    meta: z.object({
      description: z.string(),
    }),
  }),
});

export type CatalogContent = z.infer<typeof catalogSchema>;
