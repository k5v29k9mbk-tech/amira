/**
 * The editing surfaces, and which parts of the message catalogue each one owns.
 *
 * WHY THIS IS NOT ONE PAGE PER ROUTE. The obvious partition -- home, about,
 * contact -- does not survive contact with the catalogue, because the catalogue
 * is organised by SECTION and several sections are rendered by more than one
 * route. `catalog` appears on the homepage, the courses index and the contact
 * page; `faq` appears on the homepage and the FAQ page; `programs` on the
 * homepage and every course page. Partitioning by route would mean storing
 * those strings two or three times, and two copies of one sentence is a
 * guarantee that one day they will differ and nobody will know which is live.
 *
 * So a page here is a group of namespaces that is EDITED together, and every
 * namespace belongs to exactly one. A route that needs three of them asks for
 * three. The assertion at the bottom is what keeps that property true: it fails
 * the build if a namespace is claimed twice or not at all.
 *
 * `label` and `blurb` are Italian because they are read by Amira. Neither is
 * ever used as a key.
 */
export type PageId = "common" | "home" | "about" | "catalog" | "contact" | "faq" | "privacy";

export type PageDefinition = {
  id: PageId;
  label: string;
  blurb: string;
  /** Top-level keys of `messages/*.json` this page owns. */
  namespaces: readonly string[];
  /** Which public routes print these strings. Shown in the admin, and nowhere else. */
  appearsOn: readonly string[];
};

export const PAGES: readonly PageDefinition[] = [
  {
    id: "common",
    label: "Elementi comuni",
    blurb: "Menu, piè di pagina, pulsanti e titolo del sito. Compaiono su ogni pagina.",
    namespaces: ["meta", "nav", "cta", "footer", "sections", "intro", "notFound"],
    appearsOn: ["ogni pagina"],
  },
  {
    id: "home",
    label: "Home",
    blurb: "La pagina iniziale, dall’apertura fino alla chiusura.",
    namespaces: [
      "hero",
      "authority",
      "positioning",
      "manifesto",
      "method",
      "pathway",
      "journey",
      "experience",
      "receive",
      "work",
      "students",
      "voices",
      "success",
      "powder",
      "stroke",
      "closing",
      "mentor",
    ],
    appearsOn: ["/"],
  },
  {
    id: "about",
    label: "Chi è Amira",
    blurb: "La pagina dedicata ad Amira e alla sua storia.",
    namespaces: ["about", "instructor"],
    appearsOn: ["/about", "/courses/…"],
  },
  {
    id: "catalog",
    label: "Corsi",
    blurb: "Nomi dei corsi, descrizioni, informazioni pratiche e pagine dei singoli corsi.",
    namespaces: ["catalog", "programs"],
    appearsOn: ["/courses", "/courses/…", "/", "/contact"],
  },
  {
    id: "contact",
    label: "Contatti",
    blurb: "La pagina dei contatti e i recapiti mostrati nel sito.",
    namespaces: ["contact"],
    appearsOn: ["/contact", "ogni pagina"],
  },
  {
    id: "faq",
    label: "Domande frequenti",
    blurb: "Le domande e le risposte, in pagina dedicata e in home.",
    namespaces: ["faq"],
    appearsOn: ["/faq", "/", "/courses/…"],
  },
  {
    id: "privacy",
    label: "Informativa privacy",
    blurb:
      "Testo legale. Modificalo solo su indicazione di chi lo ha redatto: è un impegno verso chi scrive dal sito, non testo pubblicitario.",
    namespaces: ["privacy"],
    appearsOn: ["/privacy"],
  },
] as const;

export const PAGE_IDS = PAGES.map((p) => p.id);

export const pageById = (id: string): PageDefinition | undefined =>
  PAGES.find((p) => p.id === id);

/** Which page owns a given top-level namespace. */
export const pageForNamespace = (ns: string): PageId | undefined =>
  PAGES.find((p) => p.namespaces.includes(ns))?.id;

/**
 * Every namespace is owned once and only once.
 *
 * Checked here rather than in a test because getting it wrong silently drops
 * strings out of the admin: a namespace nobody claims is a section of the site
 * that has no edit form and quietly keeps rendering whatever was seeded.
 */
export function assertNamespacesPartition(all: readonly string[]): void {
  const claimed = PAGES.flatMap((p) => p.namespaces);
  const seen = new Set<string>();
  const twice = claimed.filter((n) => (seen.has(n) ? true : (seen.add(n), false)));
  if (twice.length) {
    throw new Error(`Namespaces claimed by more than one page: ${[...new Set(twice)].join(", ")}`);
  }
  const unclaimed = all.filter((n) => !seen.has(n));
  if (unclaimed.length) {
    throw new Error(`Namespaces no page owns: ${unclaimed.join(", ")}`);
  }
  const invented = [...seen].filter((n) => !all.includes(n));
  if (invented.length) {
    throw new Error(`Pages claim namespaces the catalogue does not have: ${invented.join(", ")}`);
  }
}
