import type { Locale } from "@/i18n/routing";

/**
 * THE ENTRY PAGE'S COPY, IN CODE RATHER THAN IN THE CMS, AND THE REASON WHY.
 *
 * Every other page on this site reads its text from the `content` table through
 * `lib/content/get.ts`. This one does not, and that is a deliberate constraint
 * rather than an oversight to be tidied up later.
 *
 * `getContent` THROWS when a row is missing, on purpose — the note in that file
 * argues it at length, and the argument is right: a database outage should fail
 * loudly rather than silently serve stale copy. The consequence for a NEW page
 * is the part that matters here. Putting this page's strings in the catalogue
 * means adding a namespace, which means every existing `published` row in the
 * database no longer matches its schema, which means `safeParse` fails and
 * EVERY page of the live site 500s until `npm run seed:content` has been run
 * against production. The new page would be the thing that took the old site
 * down, which is the one outcome the brief rules out.
 *
 * So the copy lives here, in the shape `lib/studio.ts`, `lib/courses.ts` and
 * `lib/programs.ts` already established for content that is owned by the code:
 * all four languages, typed, in one file, with nothing derived and nothing
 * guessed. The site's four locales are preserved in full, Arabic included.
 *
 * HOW TO MOVE IT INTO THE ADMIN LATER, when someone is in a position to run a
 * migration against the live database: add an `entry` page id to
 * `lib/content/pages.ts` with its own namespace, add that namespace to all four
 * `messages/*.json` from the values below, run `npm run content:schemas` and
 * then `npm run seed:content`, and swap the `entryCopy` lookup in the page for
 * a `pageText("entry")` call. Nothing else in this file's shape blocks that.
 *
 * WHAT IS NOT HERE. The academy's phone, email, Instagram and Facebook are read
 * from `lib/studio.ts` by the components, exactly like every other page, so
 * this file cannot state a contact detail that disagrees with the rest of the
 * site. Nothing in this file is invented.
 */

/**
 * The masterclass itself, stated once.
 *
 * WHAT IS LEFT HERE AND WHAT MOVED INTO THE COPY. The date and the place a
 * READER sees are `info.date.title` and `info.place.title` below: they are
 * written out per locale, so Arabic gets its own numerals and its own comma, and
 * the hero, the information bar and the page's structured data all print the
 * same two strings rather than each composing their own from parts. Composing
 * them here is what previously rendered "Italy, Roma" on the Arabic route, with
 * the two halves swapped by the bidi algorithm around a Latin city name.
 *
 * What remains is the pair a MACHINE reads. `city` is the `addressLocality` of
 * the schema.org `Place`, which is a data field rather than a sentence and is
 * correctly the endonym in every language. `dates` is kept beside it as the
 * canonical span; its dash is an EN DASH, the correct glyph for a range and the
 * one the reference sets, typed once so nothing has to remember it.
 */
export const masterclass = {
  dates: "20–21",
  city: "Roma",
} as const;

/**
 * The photographs, and the rule that governs every one of them.
 *
 * ALL FOUR ARE THE ACADEMY'S OWN FILES, already in `public/brand` and already
 * used elsewhere on the site. Not one of them is stock, generated, retouched or
 * substituted, which is the brief's hardest constraint and the easiest one to
 * break by accident. The only treatment applied anywhere on this page is a crop
 * and a focal point — `object-fit` and `object-position`, set below — which is
 * exactly the list of allowed treatments.
 *
 * `focus` is the CSS `object-position` for the crop, and it is per-image because
 * the four have different subjects: a face that must not lose its eyes, a pair
 * of brows that must not lose either brow, a certificate that must not lose the
 * word on it. Where a phone needs a tighter crop than a desktop, `focusMobile`
 * carries it and `media-fit` in globals.css reads both.
 */
export type EntryImage = {
  src: string;
  width: number;
  height: number;
  focus?: string;
  focusMobile?: string;
};

export const entryImages = {
  /**
   * The hero portrait: Amira in the white jacket, with St Peter's behind her.
   *
   * SUPPLIED BY THE ACADEMY AND USED EXACTLY AS SUPPLIED. The file is a
   * byte-for-byte copy of the one handed over ("aura bl.png"); nothing has been
   * retouched, recoloured, regenerated or recomposed, and the only treatment
   * applied is the crop and focal point below, which is the whole of the list
   * the brief permits.
   *
   * IT IS THE ONE IMAGE ON THE PAGE WITH A DARK GROUND. Every other photograph
   * here sits on ivory; this one is a studio portrait vignetted to near-black at
   * its edges, so the hero's ivory-to-transparent veil now fades cream into that
   * vignette rather than into a warm room. The veil is unchanged -- it is what
   * keeps the statement's measure clear of her -- and the seam it produces is a
   * deliberate consequence of the supplied artwork rather than a setting anyone
   * chose.
   *
   * Framed at 32% from the top: her face sits higher in this frame than in the
   * portrait it replaces, and 32 keeps her eyes on the upper third at every
   * aspect ratio the column takes. 26% at the tall narrow crop a phone gives it,
   * which is what keeps her face out of the bottom half there.
   */
  portrait: {
    src: "/brand/amira-hero-white-jacket.png",
    width: 1024,
    height: 1536,
    focus: "50% 28%",
    focusMobile: "50% 24%",
  },
  /** A real microblading result, uncropped enough that both brows read. */
  browResult: {
    src: "/brand/microblading-brows-result.jpg",
    width: 620,
    height: 830,
    focus: "50% 38%",
  },
  /** Amira observing a student mapping a brow. */
  guidance: {
    src: "/brand/amira-student-guidance-01.jpg",
    width: 1024,
    height: 1024,
    focus: "52% 45%",
  },
  /** Amira working on a live model during training. */
  liveDemo: {
    src: "/brand/amira-live-demo.jpg",
    width: 1024,
    height: 1024,
    focus: "58% 40%",
  },
  /** Amira at a PhiBrows training table, mapping alongside another artist. */
  phibrowsTraining: {
    src: "/brand/amira-phibrows-training.jpg",
    width: 1128,
    height: 1162,
    focus: "62% 40%",
  },
  /** Students with their PhiBrows certificates. */
  certificates: {
    src: "/brand/students-certificates.jpg",
    width: 708,
    height: 445,
    focus: "50% 40%",
  },
} as const satisfies Record<string, EntryImage>;

/**
 * The destination photograph, and why it is deliberately absent.
 *
 * The reference carries one image of Rome, and the brief asks for it. The
 * academy has not supplied one: there is no photograph of Rome, St Peter's or
 * any Roman subject anywhere in `public/brand`, and the same brief forbids
 * filling that gap with stock or with a generated image in the strongest terms
 * it uses about anything.
 *
 * So the slot is a shape the page can read rather than a picture someone
 * invented, which is the pattern `lib/programs.ts` already sets for every field
 * the academy has not supplied: while this is null the destination frame simply
 * does not render, and the section closes on the four real photographs instead.
 * Drop the academy's own Rome photograph into `public/brand`, name it here with
 * its real dimensions, and the frame turns itself on with no other change.
 */
export const romeImage: EntryImage | null = null;

export type BenefitCopy = { title: string; body: string };
export type InfoCopy = { title: string; body: string };

/** One of the two days, as the programme prints it. */
export type EntryDayCopy = { label: string; title: string; items: string[] };

/**
 * One kit tier, in the two figures that actually differ between them.
 *
 * The support duration lives HERE and not in the benefits strip, because it is
 * a function of the kit rather than of the masterclass: writing "six months"
 * once, globally, would promise every artist the premium tier's follow-up.
 */
export type EntryKitCopy = { name: string; bonus: string; support: string };

/**
 * THE SELLING MOVEMENT, AND WHY IT IS OPTIONAL PER LOCALE.
 *
 * These eight blocks are the argument the page makes between the strip and the
 * information bar: what this is beyond a technique course, the two days, the
 * professional guidance beside them, who it is open to, what PhiBrows is, what
 * an artist leaves with, the kits, and the decision.
 *
 * They are optional because they are written language by language rather than
 * translated in one pass, and a locale that has not been written yet should
 * render the page it renders today rather than English inside an Italian page.
 * Every section below returns `null` when its block is absent, so a language
 * arrives complete or not at all.
 */
export type EntrySections = {
  intro: { title: string; body: string[] };
  program: { title: string; days: [EntryDayCopy, EntryDayCopy]; closing: string[] };
  business: { title: string[]; lede: string; itemsLede: string; items: string[]; closing: string[] };
  access: { title: string; lead: string; body: string[] };
  method: { title: string; body: string[] };
  outcome: { title: string; lines: string[]; itemsLabel: string; items: string[] };
  kits: { title: string; tiers: [EntryKitCopy, EntryKitCopy, EntryKitCopy]; note: string };
  close: {
    title: string[];
    body: string[];
    place: string[];
    marks: string[];
    ctaTitle: string;
    ctaLines: string[];
    cta: string;
    ctaNote: string;
  };
};

export type EntryCopy = {
  /** Metadata for the route. */
  meta: { title: string; description: string };
  nav: {
    home: string;
    about: string;
    courses: string;
    academy: string;
    contact: string;
    menu: string;
    close: string;
  };
  enroll: string;
  hero: {
    /** Two display lines. The second is the one set in bronze. */
    titleTop: string;
    titleBottom: string;
    tagline: string[];
    /**
     * One sentence under the statement. OPTIONAL and per-language: the hero is
     * a statement first, so a locale carries this only where the academy has
     * asked for it. Absent, the actions follow the tagline directly and the
     * composition is unchanged.
     */
    support?: string;
    reserve: string;
    discover: string;
    /** Four short lines inside the circular seal. */
    badge: string[];
    portraitAlt: string;
  };
  benefits: [BenefitCopy, BenefitCopy, BenefitCopy, BenefitCopy];
  mastery: {
    title: string;
    items: string[];
    /** Three words that close the section. Optional, per language. */
    closing?: string[];
    captions: { browResult: string; guidance: string; training: string };
  };
  founder: {
    eyebrow: string;
    /** Two display lines: the given name, then the family name. */
    nameTop: string;
    nameBottom: string;
    /**
     * EXACTLY "Founder & Master Educator of Aura Academy" in English. The brief
     * names this string twice and rules out the alternative wording by name.
     */
    role: string;
    /**
     * The italic line under the name. OPTIONAL, and Italian deliberately has
     * none: it used to be built from `nameTop + nameBottom`, so the panel
     * printed "Amira Bechini" twice within forty pixels and a third time under
     * the quote. The name is stronger stated once at display size and once as
     * the attribution.
     */
    signature?: string;
    /** Two short paragraphs under the role. Optional, as above. */
    body?: string[];
    /** Four one-word marks. Optional, as above. */
    marks?: string[];
    quote: string;
    portraitAlt: string;
  };
  info: {
    date: InfoCopy;
    place: InfoCopy;
    seats: InfoCopy;
    ctaTitle: string;
    ctaSub: string;
  };
  footer: { instagram: string; facebook: string };
  /** The selling movement. Present only in the languages it has been written in. */
  sections?: EntrySections;
};

const en: EntryCopy = {
  meta: {
    title: "Microblading Masterclass",
    description:
      "A two-day PhiBrows microblading masterclass with Amira Bechini in Roma, 20\u201321 September. Live-model practice, official certification, business and positioning guidance, and guided support after the training.",
  },
  nav: {
    home: "Home",
    about: "About Amira",
    courses: "Courses",
    academy: "Academy",
    contact: "Contact",
    menu: "Menu",
    close: "Close",
  },
  enroll: "Enroll now",
  hero: {
    titleTop: "Microblading",
    titleBottom: "Masterclass",
    tagline: ["Master your craft.", "Build your name."],
    reserve: "Reserve your place",
    discover: "Discover the program",
    badge: ["2 days", "intensive", "hands-on", "training"],
    portraitAlt: "Amira Bechini, founder and master educator of Aura Academy",
  },
  benefits: [
    {
      title: "The PhiBrows method",
      body: "A structured, world-renowned method built around precision, consistency and professional standards.",
    },
    {
      title: "Practical experience",
      body: "Hands-on training with live models and direct personal guidance from Amira.",
    },
    {
      title: "Official certification",
      body: "Receive your official certificate upon successful completion of the training.",
    },
    {
      title: "Ongoing support",
      body: "Continue learning after the masterclass with guided online support.",
    },
  ],
  mastery: {
    title: "What you will master",
    items: [
      "Brow design & symmetry",
      "Skin anatomy",
      "Mapping techniques",
      "Hair stroke technique",
      "Colour theory",
      "Client consultation",
      "Live model practice",
      "Aftercare & client management",
      "Professional presentation",
      "Service positioning",
    ],
    captions: {
      browResult: "Microblading result, healed",
      guidance: "Mapping, corrected at the table",
      training: "Amira Bechini at a PhiBrows training table",
    },
  },
  founder: {
    eyebrow: "Your master",
    nameTop: "Amira",
    nameBottom: "Bechini",
    role: "Founder & Master Educator of Aura Academy",
    signature: "Amira Bechini",
    body: [
      "Amira doesn\u2019t teach only what to do. She teaches you how to think, work and present yourself like a professional artist.",
      "During the Rome Masterclass, Amira personally guides students through technique, precision, live-model practice, client experience and professional positioning.",
    ],
    marks: ["Technique.", "Confidence.", "Positioning.", "Growth."],
    quote:
      "My mission is to help artists build confidence through knowledge, practice and professional guidance.",
    portraitAlt: "Amira Bechini working on a live model during training",
  },
  info: {
    date: { title: "20\u201321 September", body: "2 full days" },
    place: { title: "Roma, Italy", body: "Exact location will be shared upon booking." },
    seats: { title: "Limited seats", body: "A small group, so every artist is followed personally." },
    ctaTitle: "Enroll now",
    ctaSub: "Secure your place",
  },
  footer: { instagram: "Instagram", facebook: "Facebook" },
  sections: {
    intro: {
      title: "More than a microblading course",
      body: [
        "You are not here only to learn how to create beautiful brows.",
        "You are here to learn how to work with precision, build professional confidence, present your results correctly and understand how to turn your new skill into a service people value.",
        "With Amira, every step connects technique with real professional practice.",
      ],
    },
    program: {
      title: "The two-day experience",
      days: [
        {
          label: "Day 1",
          title: "Build the foundation",
          items: [
            "Theory",
            "Skin anatomy",
            "Brow design & symmetry",
            "Mapping",
            "Hair stroke technique",
            "Colour theory",
            "Client consultation",
            "Professional positioning",
          ],
        },
        {
          label: "Day 2",
          title: "Put it into practice",
          items: [
            "Hands-on training",
            "Live model practice",
            "Correcting common mistakes",
            "Before & after presentation",
            "Client experience",
            "Presenting your service professionally",
            "Communicating value with confidence",
          ],
        },
      ],
      closing: ["You don\u2019t leave with theory alone.", "You leave knowing what to do next."],
    },
    business: {
      title: ["Learn the art.", "Learn how to present it."],
      lede: "Being technically skilled is only one part of becoming a successful artist.",
      itemsLede:
        "During the masterclass, Amira also shares professional guidance on how to:",
      items: [
        "Position yourself professionally",
        "Present your results more effectively",
        "Communicate the value of your service",
        "Build trust with potential clients",
        "Approach consultations with confidence",
        "Create a stronger client experience",
        "Present your services professionally",
        "Build visibility around your personal brand",
      ],
      closing: [
        "Mastering microblading gives you a skill.",
        "Knowing how to position that skill gives it value.",
      ],
    },
    access: {
      title: "Start where you are.",
      lead: "No prior microblading experience required.",
      body: [
        "You don\u2019t need to arrive as an expert. You need curiosity, commitment and the willingness to learn.",
        "Amira guides you step by step \u2014 from understanding the fundamentals to practising on a live model with professional guidance.",
      ],
    },
    method: {
      title: "What makes PhiBrows different?",
      body: [
        "PhiBrows is more than a technique. It is a structured professional system built around precision, education, standards and an international community.",
        "The goal is not simply to complete a course. The goal is to build a strong professional foundation you can continue developing after the training.",
      ],
    },
    outcome: {
      title: "What you will leave with",
      lines: [
        "A skill you understand.",
        "A technique you have practised.",
        "A service you know how to present.",
        "A clearer path toward building your professional work.",
      ],
      itemsLabel: "Included in the masterclass",
      items: [
        "Professional training kit",
        "Official certificate",
        "Live model experience",
        "Guided feedback",
        "Business & positioning guidance",
        "Post-course support",
        "Bonus learning resources",
        "Personalised artist logo",
        "Profile on PhiAcademy.com",
        "PhiMap listing",
        "Bonus business courses",
      ],
    },
    kits: {
      title: "Choose the right kit for you",
      tiers: [
        { name: "Starter kit", bonus: "2 bonus courses", support: "2 months of support" },
        { name: "Standard kit", bonus: "3 bonus courses", support: "4 months of support" },
        { name: "Premium kit", bonus: "4 bonus courses", support: "6 months of support" },
      ],
      note: "All kits include professional tools, pigments and learning materials.",
    },
    close: {
      title: ["Two days can change", "the way you work."],
      body: [
        "You can continue watching tutorials, saving inspiration and waiting until you feel ready.",
        "Or you can spend two focused days learning directly, practising correctly and leaving with a clearer professional direction.",
      ],
      place: ["Rome.", "20\u201321 September."],
      marks: ["Limited seats.", "Personal guidance.", "Real practice."],
      ctaTitle: "Your next level starts in Rome.",
      ctaLines: [
        "Learn the technique.",
        "Practise it for real.",
        "Build the confidence to present your work professionally.",
      ],
      cta: "Enroll now",
      ctaNote: "Secure your place in the Rome Microblading Masterclass.",
    },
  },
};

const it: EntryCopy = {
  meta: {
    title: "Masterclass di Microblading",
    description:
      "Due giornate di masterclass PhiBrows di microblading con Amira Bechini a Roma, 20\u201321 settembre. Pratica su modella dal vivo, certificazione ufficiale, guida al posizionamento professionale e supporto guidato dopo il percorso.",
  },
  nav: {
    home: "Home",
    about: "Chi \u00e8 Amira",
    courses: "Corsi",
    academy: "Accademia",
    contact: "Contatti",
    menu: "Menu",
    close: "Chiudi",
  },
  enroll: "Iscriviti ora",
  hero: {
    titleTop: "Microblading",
    titleBottom: "Masterclass",
    tagline: ["Perfeziona la tua tecnica.", "Costruisci il tuo valore professionale."],
    support:
      "Due giornate intensive con Master Amira Bechini, dedicate alla tecnica, alla pratica su modella dal vivo e allo sviluppo di una presenza professionale pi\u00f9 solida e consapevole.",
    reserve: "Riserva il tuo posto",
    discover: "Scopri il programma",
    badge: ["2 giorni", "intensivi", "di pratica", "in aula"],
    portraitAlt: "Amira Bechini, fondatrice e Master Educator di Aura Academy",
  },
  benefits: [
    {
      title: "Il metodo PhiBrows",
      body: "Un metodo riconosciuto a livello internazionale, fondato su precisione, struttura e standard professionali elevati.",
    },
    {
      title: "Esperienza pratica",
      body: "Formazione hands-on su modelle dal vivo, con supervisione diretta e feedback personalizzato.",
    },
    {
      title: "Certificazione ufficiale",
      body: "Al termine del percorso, riceverai la certificazione prevista dal programma.",
    },
    {
      title: "Supporto continuo",
      body: "Il percorso prosegue anche dopo la masterclass, con supporto guidato in base al kit scelto.",
    },
  ],
  mastery: {
    title: "Cosa imparerai",
    items: [
      "Design e simmetria del sopracciglio",
      "Anatomia della pelle",
      "Tecniche di mappatura",
      "Tecnica del pelo",
      "Teoria del colore",
      "Consulenza cliente",
      "Pratica su modella dal vivo",
      "Aftercare e gestione cliente",
      "Presentazione professionale del lavoro",
      "Posizionamento del servizio",
    ],
    closing: ["Impara.", "Pratica.", "Perfeziona."],
    captions: {
      browResult: "Risultato microblading, a guarigione",
      guidance: "La mappatura, corretta al tavolo",
      training: "Amira Bechini a un tavolo di formazione PhiBrows",
    },
  },
  founder: {
    eyebrow: "La tua Master Educator",
    nameTop: "Amira",
    nameBottom: "Bechini",
    /* No `signature`: the name is set once at display size above and once as the
       attribution under the quote, and that is the whole of it. */
    role: "Fondatrice e Master Educator di Aura Academy",
    body: [
      "Non insegna soltanto una tecnica. Ti guida a sviluppare precisione, sicurezza e una mentalit\u00e0 professionale applicabile al lavoro reale.",
      "Durante la masterclass di Roma, ogni partecipante viene accompagnata personalmente attraverso tecnica, pratica su modella dal vivo, esperienza cliente e posizionamento professionale.",
    ],
    marks: ["Tecnica.", "Sicurezza.", "Posizionamento.", "Crescita."],
    quote:
      "La mia missione \u00e8 accompagnare ogni artista verso una maggiore sicurezza professionale attraverso conoscenza, pratica e una guida concreta.",
    portraitAlt: "Amira Bechini al lavoro su una modella durante la formazione",
  },
  info: {
    date: { title: "20\u201321 settembre", body: "2 giornate piene" },
    place: { title: "Roma, Italia", body: "La sede esatta viene comunicata alla prenotazione." },
    seats: { title: "Posti limitati", body: "Un gruppo ristretto, per seguire ogni artista personalmente." },
    ctaTitle: "Iscriviti ora",
    ctaSub: "Riserva il tuo posto",
  },
  footer: { instagram: "Instagram", facebook: "Facebook" },
  sections: {
    intro: {
      title: "Molto pi\u00f9 di un corso di Microblading",
      body: [
        "Non si tratta semplicemente di apprendere una tecnica.",
        "Si tratta di acquisire metodo, precisione, sicurezza e una visione professionale pi\u00f9 completa del proprio lavoro.",
        "Ogni fase della masterclass \u00e8 pensata per collegare la tecnica alla pratica reale: dalla consulenza alla cliente fino alla presentazione e al posizionamento del proprio servizio.",
      ],
    },
    program: {
      title: "Due giorni di formazione intensiva",
      days: [
        {
          label: "Giorno 1",
          title: "Costruisci le basi",
          items: [
            "Teoria",
            "Anatomia della pelle",
            "Design e simmetria",
            "Mappatura",
            "Tecnica del pelo",
            "Teoria del colore",
            "Consulenza cliente",
            "Posizionamento professionale",
          ],
        },
        {
          label: "Giorno 2",
          title: "Trasforma la teoria in pratica",
          items: [
            "Training pratico",
            "Pratica su modella dal vivo",
            "Correzione degli errori pi\u00f9 comuni",
            "Presentazione del prima e dopo",
            "Gestione dell\u2019esperienza cliente",
            "Presentazione professionale del servizio",
            "Comunicazione del valore",
          ],
        },
      ],
      closing: [
        "Non lasci la masterclass con sola teoria.",
        "Ne esci con maggiore consapevolezza, metodo e direzione.",
      ],
    },
    business: {
      title: ["Padroneggia la tecnica.", "Impara a valorizzarla."],
      lede: "La qualit\u00e0 tecnica \u00e8 fondamentale, ma rappresenta solo una parte del percorso professionale.",
      itemsLede: "Durante la masterclass riceverai anche indicazioni concrete su come:",
      items: [
        "Posizionarti in modo professionale",
        "Valorizzare i tuoi risultati",
        "Comunicare correttamente il valore del servizio",
        "Creare fiducia durante la consulenza",
        "Migliorare l\u2019esperienza cliente",
        "Presentare il tuo servizio con maggiore sicurezza",
        "Rafforzare la tua immagine professionale",
        "Sviluppare una presenza pi\u00f9 riconoscibile nel settore",
      ],
      closing: [
        "Una tecnica crea competenza.",
        "Il giusto posizionamento le d\u00e0 valore.",
      ],
    },
    access: {
      title: "Parti da dove sei.",
      lead: "Non \u00e8 richiesta esperienza precedente nel microblading.",
      body: [
        "Non devi arrivare gi\u00e0 esperta.",
        "Servono motivazione, attenzione e volont\u00e0 di imparare.",
        "Il percorso \u00e8 strutturato passo dopo passo, dalle basi fino alla pratica su modella dal vivo, con una guida costante durante ogni fase.",
      ],
    },
    method: {
      title: "Cosa rende PhiBrows diverso?",
      body: [
        "PhiBrows non \u00e8 soltanto una tecnica: \u00e8 un sistema professionale strutturato, fondato su precisione, formazione, standard condivisi e una comunit\u00e0 internazionale.",
        "L\u2019obiettivo non \u00e8 completare un corso, ma costruire una base professionale solida su cui continuare a crescere anche dopo la formazione.",
      ],
    },
    outcome: {
      title: "Cosa porterai con te",
      lines: [
        "Una tecnica che comprendi realmente.",
        "Un metodo che hai messo in pratica.",
        "Un servizio che sai presentare con maggiore sicurezza.",
        "Una direzione professionale pi\u00f9 chiara.",
      ],
      itemsLabel: "Incluso nella Masterclass",
      items: [
        "Kit di formazione professionale",
        "Certificazione ufficiale",
        "Esperienza su modella dal vivo",
        "Feedback personalizzato",
        "Guida al business e al posizionamento",
        "Supporto post-corso",
        "Risorse formative bonus",
        "Logo artista personalizzato",
        "Profilo su PhiAcademy.com",
        "Presenza su PhiMap",
        "Corsi bonus dedicati alla crescita professionale",
      ],
    },
    kits: {
      title: "Scegli il percorso pi\u00f9 adatto a te",
      tiers: [
        { name: "Starter Kit", bonus: "2 corsi bonus", support: "2 mesi di supporto" },
        { name: "Standard Kit", bonus: "3 corsi bonus", support: "4 mesi di supporto" },
        { name: "Premium Kit", bonus: "4 corsi bonus", support: "6 mesi di supporto" },
      ],
      note: "Tutti i kit includono strumenti professionali, pigmenti e materiali didattici.",
    },
    close: {
      title: ["Due giorni.", "Un nuovo standard per il tuo lavoro."],
      body: [
        "Due giornate dedicate ad apprendere, praticare e acquisire una visione pi\u00f9 professionale del microblading.",
      ],
      place: ["Roma", "20\u201321 settembre"],
      marks: ["Posti limitati.", "Guida personale.", "Pratica reale."],
      ctaTitle: "Il tuo prossimo livello inizia a Roma.",
      ctaLines: [
        "Perfeziona la tecnica.",
        "Mettila in pratica.",
        "Impara a valorizzare il tuo lavoro con maggiore sicurezza.",
      ],
      cta: "Iscriviti ora",
      ctaNote: "Riserva il tuo posto alla Microblading Masterclass di Roma.",
    },
  },
};

const fr: EntryCopy = {
  meta: {
    title: "Masterclass de Microblading",
    description:
      "Deux jours de masterclass PhiBrows de microblading avec Amira Bechini \u00e0 Rome, les 20 et 21 septembre. Pratique sur mod\u00e8le, certificat officiel, accompagnement au positionnement professionnel et suivi encadr\u00e9 apr\u00e8s la formation.",
  },
  nav: {
    home: "Accueil",
    about: "\u00c0 propos d\u2019Amira",
    courses: "Formations",
    academy: "Acad\u00e9mie",
    contact: "Contact",
    menu: "Menu",
    close: "Fermer",
  },
  enroll: "S\u2019inscrire",
  hero: {
    titleTop: "Microblading",
    titleBottom: "Masterclass",
    tagline: ["Ma\u00eetrisez votre art.", "Faites-vous un nom."],
    reserve: "R\u00e9servez votre place",
    discover: "D\u00e9couvrir le programme",
    badge: ["2 jours", "intensifs", "de pratique", "encadr\u00e9e"],
    portraitAlt: "Amira Bechini, fondatrice et master educator d\u2019Aura Academy",
  },
  benefits: [
    {
      title: "La m\u00e9thode PhiBrows",
      body: "Une m\u00e9thode structur\u00e9e et reconnue dans le monde entier, fond\u00e9e sur la pr\u00e9cision, la constance et des standards professionnels.",
    },
    {
      title: "Exp\u00e9rience pratique",
      body: "Formation pratique sur mod\u00e8le vivant, avec l\u2019accompagnement personnel d\u2019Amira.",
    },
    {
      title: "Certification officielle",
      body: "Recevez votre certificat officiel \u00e0 l\u2019issue de la formation.",
    },
    {
      title: "Suivi continu",
      body: "Continuez \u00e0 apprendre apr\u00e8s la masterclass gr\u00e2ce \u00e0 un suivi en ligne encadr\u00e9.",
    },
  ],
  mastery: {
    title: "Ce que vous ma\u00eetriserez",
    items: [
      "Dessin et sym\u00e9trie du sourcil",
      "Anatomie de la peau",
      "Techniques de mapping",
      "Technique du poil",
      "Th\u00e9orie de la couleur",
      "Consultation cliente",
      "Pratique sur mod\u00e8le",
      "Suivi et relation client",
      "Pr\u00e9sentation professionnelle",
      "Positionnement du service",
    ],
    captions: {
      browResult: "R\u00e9sultat microblading, cicatris\u00e9",
      guidance: "Le mapping, corrig\u00e9 \u00e0 la table",
      training: "Amira Bechini \u00e0 une table de formation PhiBrows",
    },
  },
  founder: {
    eyebrow: "Votre master",
    nameTop: "Amira",
    nameBottom: "Bechini",
    role: "Fondatrice et Master Educator d\u2019Aura Academy",
    signature: "Amira Bechini",
    body: [
      "Amira n\u2019enseigne pas seulement quoi faire. Elle vous apprend \u00e0 penser, \u00e0 travailler et \u00e0 vous pr\u00e9senter comme une artiste professionnelle.",
      "Pendant la Masterclass de Rome, Amira accompagne personnellement les \u00e9l\u00e8ves sur la technique, la pr\u00e9cision, la pratique sur mod\u00e8le, l\u2019exp\u00e9rience cliente et le positionnement professionnel.",
    ],
    marks: ["Technique.", "Confiance.", "Positionnement.", "Croissance."],
    quote:
      "Ma mission est d\u2019aider les artistes \u00e0 gagner en confiance par le savoir, la pratique et un accompagnement professionnel.",
    portraitAlt: "Amira Bechini au travail sur un mod\u00e8le pendant la formation",
  },
  info: {
    date: { title: "20\u201321 septembre", body: "2 journ\u00e9es compl\u00e8tes" },
    place: { title: "Rome, Italie", body: "Le lieu exact est communiqu\u00e9 \u00e0 la r\u00e9servation." },
    seats: { title: "Places limit\u00e9es", body: "Un petit groupe, pour que chaque artiste soit suivie personnellement." },
    ctaTitle: "S\u2019inscrire",
    ctaSub: "R\u00e9servez votre place",
  },
  footer: { instagram: "Instagram", facebook: "Facebook" },
  sections: {
    intro: {
      title: "Plus qu\u2019une formation de microblading",
      body: [
        "Vous n\u2019\u00eates pas ici uniquement pour apprendre \u00e0 dessiner de beaux sourcils.",
        "Vous \u00eates ici pour apprendre \u00e0 travailler avec pr\u00e9cision, gagner en assurance professionnelle, pr\u00e9senter correctement vos r\u00e9sultats et comprendre comment transformer un nouveau savoir-faire en un service que l\u2019on reconna\u00eet.",
        "Avec Amira, chaque \u00e9tape relie la technique \u00e0 la pratique professionnelle r\u00e9elle.",
      ],
    },
    program: {
      title: "L\u2019exp\u00e9rience de deux jours",
      days: [
        {
          label: "Jour 1",
          title: "Poser les fondations",
          items: [
            "Th\u00e9orie",
            "Anatomie de la peau",
            "Dessin et sym\u00e9trie du sourcil",
            "Mapping",
            "Technique du poil",
            "Th\u00e9orie de la couleur",
            "Consultation cliente",
            "Positionnement professionnel",
          ],
        },
        {
          label: "Jour 2",
          title: "Passer \u00e0 la pratique",
          items: [
            "Formation pratique",
            "Pratique sur mod\u00e8le",
            "Corriger les erreurs les plus courantes",
            "Pr\u00e9sentation de l\u2019avant / apr\u00e8s",
            "Exp\u00e9rience cliente",
            "Pr\u00e9senter votre service de mani\u00e8re professionnelle",
            "Communiquer la valeur avec assurance",
          ],
        },
      ],
      closing: ["Vous ne repartez pas avec la seule th\u00e9orie.", "Vous repartez en sachant quoi faire ensuite."],
    },
    business: {
      title: ["Apprenez l\u2019art.", "Apprenez \u00e0 le pr\u00e9senter."],
      lede: "Ma\u00eetriser la technique n\u2019est qu\u2019une partie du m\u00e9tier d\u2019artiste accomplie.",
      itemsLede: "Pendant la masterclass, Amira partage aussi un accompagnement professionnel sur la mani\u00e8re de :",
      items: [
        "Vous positionner professionnellement",
        "Pr\u00e9senter vos r\u00e9sultats plus efficacement",
        "Communiquer la valeur de votre service",
        "Construire la confiance avec vos futures clientes",
        "Aborder les consultations avec assurance",
        "Cr\u00e9er une exp\u00e9rience cliente plus forte",
        "Pr\u00e9senter vos services de mani\u00e8re professionnelle",
        "D\u00e9velopper la visibilit\u00e9 de votre marque personnelle",
      ],
      closing: [
        "Ma\u00eetriser le microblading vous donne un savoir-faire.",
        "Savoir le positionner lui donne de la valeur.",
      ],
    },
    access: {
      title: "Partez d\u2019o\u00f9 vous \u00eates.",
      lead: "Aucune exp\u00e9rience pr\u00e9alable en microblading n\u2019est requise.",
      body: [
        "Vous n\u2019avez pas besoin d\u2019arriver experte. Il vous faut de la curiosit\u00e9, de l\u2019engagement et l\u2019envie d\u2019apprendre.",
        "Amira vous guide pas \u00e0 pas, de la compr\u00e9hension des fondamentaux \u00e0 la pratique sur mod\u00e8le avec un accompagnement professionnel.",
      ],
    },
    method: {
      title: "Qu\u2019est-ce qui rend PhiBrows diff\u00e9rent ?",
      body: [
        "PhiBrows est plus qu\u2019une technique. C\u2019est un syst\u00e8me professionnel structur\u00e9, fond\u00e9 sur la pr\u00e9cision, la formation, des standards et une communaut\u00e9 internationale.",
        "L\u2019objectif n\u2019est pas simplement de terminer une formation, mais de b\u00e2tir une base professionnelle solide \u00e0 d\u00e9velopper ensuite.",
      ],
    },
    outcome: {
      title: "Ce que vous emporterez",
      lines: [
        "Un savoir-faire que vous comprenez.",
        "Une technique que vous avez pratiqu\u00e9e.",
        "Un service que vous savez pr\u00e9senter.",
        "Un chemin plus clair vers votre travail professionnel.",
      ],
      itemsLabel: "Inclus dans la masterclass",
      items: [
        "Kit professionnel",
        "Certificat officiel",
        "Exp\u00e9rience sur mod\u00e8le",
        "Retours personnalis\u00e9s",
        "Accompagnement business et positionnement",
        "Suivi apr\u00e8s la formation",
        "Ressources p\u00e9dagogiques bonus",
        "Logo d\u2019artiste personnalis\u00e9",
        "Profil sur PhiAcademy.com",
        "R\u00e9f\u00e9rencement PhiMap",
        "Formations business bonus",
      ],
    },
    kits: {
      title: "Choisissez le kit qui vous convient",
      tiers: [
        { name: "Kit Starter", bonus: "2 formations bonus", support: "2 mois de suivi" },
        { name: "Kit Standard", bonus: "3 formations bonus", support: "4 mois de suivi" },
        { name: "Kit Premium", bonus: "4 formations bonus", support: "6 mois de suivi" },
      ],
      note: "Tous les kits comprennent les outils professionnels, les pigments et les supports p\u00e9dagogiques.",
    },
    close: {
      title: ["Deux jours peuvent changer", "votre fa\u00e7on de travailler."],
      body: [
        "Vous pouvez continuer \u00e0 regarder des tutoriels, enregistrer de l\u2019inspiration et attendre de vous sentir pr\u00eate.",
        "Ou vous pouvez consacrer deux journ\u00e9es concentr\u00e9es \u00e0 apprendre directement, pratiquer correctement et repartir avec une direction professionnelle plus claire.",
      ],
      place: ["Rome.", "20\u201321 septembre."],
      marks: ["Places limit\u00e9es.", "Accompagnement personnel.", "Pratique r\u00e9elle."],
      ctaTitle: "Votre prochain niveau commence \u00e0 Rome.",
      ctaLines: [
        "Apprenez la technique.",
        "Pratiquez-la pour de vrai.",
        "Gagnez l\u2019assurance de pr\u00e9senter votre travail professionnellement.",
      ],
      cta: "S\u2019inscrire",
      ctaNote: "R\u00e9servez votre place \u00e0 la Masterclass de Microblading de Rome.",
    },
  },
};

const ar: EntryCopy = {
  meta: {
    title: "ماستر كلاس المايكروبليدنغ",
    description:
      "ماستر كلاس مايكروبليدنغ بمنهج PhiBrows على مدى يومين مع أميرة بشيني في روما، ٢٠–٢١ سبتمبر. تدريب عملي على عارضة، شهادة رسمية، إرشاد في التموضع المهني، ومتابعة موجّهة بعد التدريب.",
  },
  nav: {
    home: "الرئيسية",
    about: "عن أميرة",
    courses: "الدورات",
    academy: "الأكاديمية",
    contact: "اتصلي بنا",
    menu: "القائمة",
    close: "إغلاق",
  },
  enroll: "سجّلي الآن",
  hero: {
    titleTop: "مايكروبليدنغ",
    titleBottom: "ماستر كلاس",
    tagline: ["أتقني حرفتك.", "اصنعي اسمك."],
    reserve: "احجزي مقعدك",
    discover: "اكتشفي البرنامج",
    badge: ["يومان", "مكثّفان", "تدريب", "عملي"],
    portraitAlt: "أميرة بشيني، مؤسِّسة أكاديمية أورا والمدرِّبة المعتمدة",
  },
  benefits: [
    {
      title: "منهج PhiBrows",
      body: "منهج منظّم ومعروف عالمياً، مبني على الدقة والاتساق والمعايير المهنية.",
    },
    {
      title: "خبرة عملية",
      body: "تدريب عملي على عارضة حقيقية، بمتابعة شخصية مباشرة من أميرة.",
    },
    {
      title: "شهادة رسمية",
      body: "تحصلين على شهادتك الرسمية عند إتمام التدريب بنجاح.",
    },
    {
      title: "متابعة مستمرة",
      body: "واصلي التعلّم بعد الماستر كلاس عبر متابعة إلكترونية موجّهة.",
    },
  ],
  mastery: {
    title: "ما الذي ستتقنينه",
    items: [
      "تصميم الحاجب والتماثل",
      "تشريح البشرة",
      "تقنيات رسم الخريطة",
      "تقنية الشعرة",
      "نظرية اللون",
      "استشارة العميلة",
      "التطبيق على عارضة",
      "العناية اللاحقة والتعامل مع العميلة",
      "العرض المهني",
      "تموضع الخدمة",
    ],
    captions: {
      browResult: "نتيجة مايكروبليدنغ بعد الالتئام",
      guidance: "رسم الخريطة، بالتصحيح على الطاولة",
      training: "أميرة بشيني في جلسة تدريب PhiBrows",
    },
  },
  founder: {
    eyebrow: "مدرِّبتك",
    nameTop: "أميرة",
    nameBottom: "بشيني",
    role: "مؤسِّسة أكاديمية أورا والمدرِّبة المعتمدة",
    signature: "أميرة بشيني",
    body: [
      "أميرة لا تعلّمك ما تفعلينه فحسب، بل كيف تفكّرين وتعملين وتقدّمين نفسك كفنانة محترفة.",
      "خلال ماستر كلاس روما، ترافق أميرة الطالبات شخصياً في التقنية والدقة والتطبيق على عارضة وتجربة العميلة والتموضع المهني.",
    ],
    marks: ["التقنية.", "الثقة.", "التموضع.", "النمو."],
    quote:
      "رسالتي أن أساعد الفنانات على بناء الثقة عبر المعرفة والممارسة والإرشاد المهني.",
    portraitAlt: "أميرة بشيني أثناء العمل على عارضة خلال التدريب",
  },
  info: {
    date: { title: "٢٠–٢١ سبتمبر", body: "يومان كاملان" },
    place: { title: "روما، إيطاليا", body: "يُعلَن الموقع بالتحديد عند الحجز." },
    seats: { title: "مقاعد محدودة", body: "مجموعة صغيرة، لتحظى كل فنانة بمتابعة شخصية." },
    ctaTitle: "سجّلي الآن",
    ctaSub: "احجزي مقعدك",
  },
  footer: { instagram: "إنستغرام", facebook: "فيسبوك" },
  sections: {
    intro: {
      title: "أكثر من دورة مايكروبليدنغ",
      body: [
        "أنتِ هنا لا لتتعلّمي رسم حواجب جميلة فقط.",
        "أنتِ هنا لتتعلّمي العمل بدقة، وبناء الثقة المهنية، وعرض نتائجك بالشكل الصحيح، وفهم كيف تحوّلين مهارتك الجديدة إلى خدمة يقدّرها الناس.",
        "مع أميرة، كل خطوة تربط التقنية بالممارسة المهنية الحقيقية.",
      ],
    },
    program: {
      title: "تجربة اليومين",
      days: [
        {
          label: "اليوم الأول",
          title: "ابني الأساس",
          items: [
            "النظرية",
            "تشريح البشرة",
            "تصميم الحاجب والتماثل",
            "رسم الخريطة",
            "تقنية الشعرة",
            "نظرية اللون",
            "استشارة العميلة",
            "التموضع المهني",
          ],
        },
        {
          label: "اليوم الثاني",
          title: "ضعيها موضع التطبيق",
          items: [
            "تدريب عملي",
            "التطبيق على عارضة",
            "تصحيح الأخطاء الشائعة",
            "عرض ما قبل وما بعد",
            "تجربة العميلة",
            "تقديم خدمتك باحترافية",
            "إيصال القيمة بثقة",
          ],
        },
      ],
      closing: ["لا تخرجين بالنظرية وحدها.", "تخرجين وأنتِ تعرفين الخطوة التالية."],
    },
    business: {
      title: ["تعلّمي الفن.", "وتعلّمي كيف تقدّمينه."],
      lede: "الإتقان التقني جزء واحد فقط من أن تصبحي فنانة ناجحة.",
      itemsLede: "خلال الماستر كلاس، تشارك أميرة أيضاً إرشاداً مهنياً حول كيفية:",
      items: [
        "تموضعك بشكل مهني",
        "عرض نتائجك بفاعلية أكبر",
        "إيصال قيمة خدمتك",
        "بناء الثقة مع العميلات المحتملات",
        "إدارة الاستشارات بثقة",
        "خلق تجربة أقوى للعميلة",
        "تقديم خدماتك باحترافية",
        "بناء حضور حول علامتك الشخصية",
      ],
      closing: [
        "إتقان المايكروبليدنغ يمنحك مهارة.",
        "ومعرفة كيفية تموضع تلك المهارة تمنحها قيمة.",
      ],
    },
    access: {
      title: "ابدئي من حيث أنتِ.",
      lead: "لا تُشترط أي خبرة سابقة في المايكروبليدنغ.",
      body: [
        "لستِ بحاجة إلى أن تصلي خبيرة. تحتاجين إلى الفضول والالتزام والرغبة في التعلّم.",
        "ترافقك أميرة خطوة بخطوة، من فهم الأساسيات إلى التطبيق على عارضة بإرشاد مهني.",
      ],
    },
    method: {
      title: "ما الذي يميّز PhiBrows؟",
      body: [
        "PhiBrows أكثر من تقنية. إنه نظام مهني منظّم مبني على الدقة والتعليم والمعايير ومجتمع دولي.",
        "الهدف ليس إنهاء دورة فحسب، بل بناء أساس مهني متين تواصلين تطويره بعد التدريب.",
      ],
    },
    outcome: {
      title: "ما الذي ستخرجين به",
      lines: [
        "مهارة تفهمينها.",
        "تقنية طبّقتِها بيديك.",
        "خدمة تعرفين كيف تقدّمينها.",
        "مسار أوضح نحو بناء عملك المهني.",
      ],
      itemsLabel: "مشمول في الماستر كلاس",
      items: [
        "حقيبة تدريب مهنية",
        "شهادة رسمية",
        "تجربة على عارضة",
        "ملاحظات موجّهة",
        "إرشاد في العمل والتموضع",
        "متابعة بعد الدورة",
        "مصادر تعليمية إضافية",
        "شعار شخصي للفنانة",
        "ملف على PhiAcademy.com",
        "إدراج في PhiMap",
        "دورات عمل إضافية",
      ],
    },
    kits: {
      title: "اختاري الحقيبة المناسبة لكِ",
      tiers: [
        { name: "حقيبة Starter", bonus: "دورتان إضافيتان", support: "شهران من المتابعة" },
        { name: "حقيبة Standard", bonus: "٣ دورات إضافية", support: "٤ أشهر من المتابعة" },
        { name: "حقيبة Premium", bonus: "٤ دورات إضافية", support: "٦ أشهر من المتابعة" },
      ],
      note: "كل الحقائب تشمل الأدوات المهنية والأصباغ والمواد التعليمية.",
    },
    close: {
      title: ["يومان قادران على تغيير", "طريقتك في العمل."],
      body: [
        "يمكنك أن تواصلي مشاهدة الدروس وحفظ الإلهام وانتظار الشعور بالجاهزية.",
        "أو أن تمنحي يومين من التركيز للتعلّم مباشرة، والتطبيق بالشكل الصحيح، والخروج باتجاه مهني أوضح.",
      ],
      place: ["روما.", "٢٠–٢١ سبتمبر."],
      marks: ["مقاعد محدودة.", "متابعة شخصية.", "تطبيق حقيقي."],
      ctaTitle: "مستواك التالي يبدأ في روما.",
      ctaLines: [
        "تعلّمي التقنية.",
        "طبّقيها فعلياً.",
        "وابني الثقة لتقديم عملك باحترافية.",
      ],
      cta: "سجّلي الآن",
      ctaNote: "احجزي مقعدك في ماستر كلاس المايكروبليدنغ بروما.",
    },
  },
};

const COPY: Record<Locale, EntryCopy> = { en, it, fr, ar };

/**
 * The entry page's copy for one language.
 *
 * The parameter is typed `string` because that is what a route param is, and
 * the routing layer has already refused anything that is not one of the four
 * before a page renders — so the cast narrows rather than checks. The `??` is
 * there for the one caller that could ever be wrong, and it falls back to the
 * routing default rather than throwing: a missing translation should show the
 * page in English, not a 500.
 */
export const entryCopy = (locale: string): EntryCopy =>
  COPY[locale as Locale] ?? COPY.en;
