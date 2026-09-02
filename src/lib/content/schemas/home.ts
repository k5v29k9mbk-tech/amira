// GENERATED FILE — do not edit by hand.
// Written by scripts/generate-content-schemas.ts from messages/en.json.
// Re-run `npm run content:schemas` after changing the catalogue.
//
// Home: 139 strings across 17 section(s).
import { z } from "zod";

export const homeSchema = z.object({
  hero: z.object({
    eyebrow: z.string(),
    titleA: z.string(),
    titleB: z.string(),
    sub: z.string(),
    discoverAura: z.string(),
    founder: z.string(),
    founderRole: z.string(),
    facts: z.object({
      years: z.object({
        value: z.string(),
        label: z.string(),
      }),
      students: z.object({
        value: z.string(),
        label: z.string(),
      }),
      classes: z.object({
        value: z.string(),
        label: z.string(),
      }),
    }),
    meetAmira: z.string(),
    classesNote: z.string(),
  }),
  authority: z.object({
    eyebrow: z.string(),
    title: z.string(),
    sub: z.string(),
    items: z.object({
      years: z.object({
        value: z.string(),
        label: z.string(),
      }),
      students: z.object({
        value: z.string(),
        label: z.string(),
      }),
      classes: z.object({
        value: z.string(),
        label: z.string(),
      }),
      reach: z.object({
        value: z.string(),
        label: z.string(),
      }),
    }),
    note: z.string(),
    portraitAlt: z.string(),
  }),
  positioning: z.object({
    artist: z.string(),
    academy: z.string(),
  }),
  manifesto: z.object({
    one: z.string(),
    two: z.string(),
    note: z.string(),
  }),
  method: z.object({
    title: z.string(),
    sub: z.string(),
    steps: z.object({
      theory: z.object({
        title: z.string(),
        body: z.string(),
        alt: z.string(),
      }),
      practice: z.object({
        title: z.string(),
        body: z.string(),
        alt: z.string(),
      }),
      model: z.object({
        title: z.string(),
        body: z.string(),
      }),
      support: z.object({
        title: z.string(),
        body: z.string(),
      }),
    }),
    eyebrow: z.string(),
    name: z.string(),
    lede: z.string(),
  }),
  pathway: z.object({
    eyebrow: z.string(),
    title: z.string(),
    sub: z.string(),
    levelLabel: z.string(),
    tiers: z.object({
      foundations: z.object({
        name: z.string(),
        level: z.string(),
        for: z.string(),
        body: z.string(),
      }),
      advanced: z.object({
        name: z.string(),
        level: z.string(),
        for: z.string(),
        body: z.string(),
      }),
      masterclass: z.object({
        name: z.string(),
        level: z.string(),
        for: z.string(),
        body: z.string(),
      }),
      private: z.object({
        name: z.string(),
        level: z.string(),
        for: z.string(),
        body: z.string(),
      }),
    }),
  }),
  journey: z.object({
    eyebrow: z.string(),
    title: z.string(),
    sub: z.string(),
    steps: z.object({
      contact: z.object({
        title: z.string(),
        body: z.string(),
      }),
      deposit: z.object({
        title: z.string(),
        body: z.string(),
      }),
      training: z.object({
        title: z.string(),
        body: z.string(),
      }),
      certificate: z.object({
        title: z.string(),
        body: z.string(),
      }),
      support: z.object({
        title: z.string(),
        body: z.string(),
      }),
    }),
  }),
  experience: z.object({
    eyebrow: z.string(),
    title: z.string(),
    sub: z.string(),
    items: z.object({
      groups: z.object({
        title: z.string(),
        body: z.string(),
      }),
      demo: z.object({
        title: z.string(),
        body: z.string(),
      }),
      practice: z.object({
        title: z.string(),
        body: z.string(),
      }),
      correction: z.object({
        title: z.string(),
        body: z.string(),
      }),
    }),
    guidanceAlt: z.string(),
  }),
  receive: z.object({
    eyebrow: z.string(),
    title: z.string(),
    sub: z.string(),
    items: z.object({
      small: z.string(),
      model: z.string(),
      feedback: z.string(),
      certificate: z.string(),
      support: z.string(),
      guidance: z.string(),
      kit: z.string(),
      business: z.string(),
    }),
  }),
  work: z.object({
    title: z.string(),
    sub: z.string(),
    open: z.string(),
    close: z.string(),
    alt: z.object({
      healedBrows: z.string(),
      strokes: z.string(),
      brows: z.string(),
      browsPair: z.string(),
      microbladingPortrait: z.string(),
      browsPortrait: z.string(),
      browsDefinedPortrait: z.string(),
    }),
  }),
  students: z.object({
    title: z.string(),
    sub: z.string(),
    captions: z.object({
      lesson: z.string(),
    }),
  }),
  voices: z.object({
    title: z.string(),
    items: z.object({

    }),
    prev: z.string(),
    next: z.string(),
  }),
  success: z.object({
    title: z.string(),
    before: z.string(),
    after: z.string(),
  }),
  powder: z.object({
    eyebrow: z.string(),
    title: z.string(),
    intro: z.string(),
    points: z.object({
      technique: z.string(),
      finish: z.string(),
      levels: z.string(),
    }),
  }),
  stroke: z.object({
    eyebrow: z.string(),
    title: z.string(),
    body: z.string(),
    alt: z.string(),
    caption: z.string(),
  }),
  closing: z.object({
    title: z.string(),
    sub: z.string(),
  }),
  mentor: z.object({
    play: z.string(),
    videoAlt: z.string(),
  }),
});

export type HomeContent = z.infer<typeof homeSchema>;
