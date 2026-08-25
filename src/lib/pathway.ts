/**
 * The educational path: how a student moves through Aura Academy.
 *
 * WHY THIS FILE EXISTS AT ALL. The academy's own document states one thing
 * about progression, and states it plainly: every technique is taught "at base
 * level, from the beginning, and at advanced level for those already working"
 * (`faq.items.beginners.a`). That is a two-step ladder, and it was never drawn
 * anywhere on the site — a visitor met six disciplines and had no way to see
 * that each of them is entered at one of two heights, or which height was hers.
 *
 * So the first two tiers here are not new products. They are the two levels the
 * academy already teaches, given a name, an order and a place on the page.
 *
 * WHAT `published` IS FOR, AND WHY IT IS NOT A STYLING FLAG. The brief for the
 * repositioning asked for a four-step ecosystem: Foundations, Advanced, a
 * masterclass, and private one-to-one mentoring. The last two are a reasonable
 * shape for this business and an unreasonable thing for a website to assert on
 * its own, because the academy has supplied no evidence that either is offered:
 * no dates, no format, no fee, no mention in the source document, nothing in
 * the FAQ. A site that lists a product the business does not sell is not
 * aspirational, it is a page that takes an enquiry the academy then has to
 * refuse.
 *
 * Both are therefore built in full and shipped switched off. Everything that
 * reads this file filters on `published`, so a hidden tier renders nowhere: not
 * in the pathway section, not in the navigation, not in the sitemap, not in the
 * schema.org payload. When Amira confirms either one is real, flip the boolean
 * and the tier appears everywhere at once with its copy already translated into
 * all four languages.
 *
 * Do not delete a tier to hide it. The copy is what costs, and it is written.
 */

export type Tier = {
  key: string;
  /**
   * False while the academy has not confirmed the offering exists. A false
   * tier is absent from every surface of the site, by construction rather than
   * by CSS: see `publishedTiers`, which is what pages import.
   */
  published: boolean;
  /**
   * Where the tier's action goes. Both live tiers point at the catalogue,
   * because the level is a way into the six disciplines rather than a seventh
   * product sitting beside them.
   */
  href: string;
};

export const tiers: Tier[] = [
  // The two levels the academy states it teaches. Live.
  { key: "foundations", published: true, href: "/courses" },
  { key: "advanced", published: true, href: "/courses" },

  // Not yet confirmed by the academy. Built, translated, switched off.
  // Flip `published` to true once Amira confirms the offering and its terms.
  { key: "masterclass", published: false, href: "/contact" },
  { key: "private", published: false, href: "/contact" },
];

/** The only export a page may render from. Hidden tiers cannot leak. */
export const publishedTiers = tiers.filter((t) => t.published);
