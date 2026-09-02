/**
 * Everything the academy has officially supplied about itself, in one place
 * because the nav, footer, contact section and schema.org payload all read it.
 *
 * Source: "Aura Academy di Amira Bechini — contenuto ufficiale approvato dal
 * cliente". Nothing in this file is inferred. Fields the client did not supply
 * are left empty and every affordance that needs them is hidden rather than
 * filled with a placeholder.
 */
export const brand = {
  /** Legal and full brand name. */
  full: "Aura Academy di Amira Bechini",
  /** Short name, used in the nav, the wordmark and page titles. */
  short: "Aura Academy",
  founder: "Amira Bechini",
} as const;

export const academy = {
  street: "Lungomare Rodi 20",
  postcode: "64021",
  city: "Giulianova",
  province: "TE",
  country: "IT",
  /** Maximum students per course, as stated by the academy. */
  maxStudents: "3-4",
} as const;

export const legal = {
  company: "Aura Academy di Amira Bechini",
  vat: "02228390676",
  rea: "TE-221017",
} as const;

export const studio = {
  /**
   * The academy's ordinary mailbox, and the one a visitor is meant to write to.
   *
   * It arrived after `pec` and it is a different kind of address, which is why
   * it is a separate field rather than a correction of that one. A PEC is a
   * legal channel that rejects ordinary mail; this is a normal inbox that
   * accepts it. The footer prints this one, unlabelled, because there is
   * nothing to warn a reader about.
   *
   * `pec` is unchanged and still published on /contact and in the privacy
   * notice, where a rights request under the Regulation genuinely goes.
   */
  email: "Auraacdemyab@gmail.com",
  /**
   * The academy's line, written the way the academy writes it: with the
   * country code, and spaced in the Italian grouping. It is the display form
   * and the only place the number is typed for a human to read.
   *
   * It is the same line as `whatsapp` below, which is why the test asserts the
   * two agree rather than letting the digits drift apart. They are stored
   * separately because they are stored differently: `wa.me` wants bare digits,
   * a printed number wants the plus and the spaces, and deriving either from
   * the other would mean a formatter in this file for one number.
   *
   * Blank hides the affordance, exactly like `whatsapp`: `phoneLink` is null
   * and the footer's row renders nothing rather than a dead `tel:`.
   */
  phone: "+39 345 323 6514",
  /**
   * Certified legal mailbox. This is the only email address the academy
   * supplied; it is shown as a PEC and is deliberately NOT used as the
   * contact-form destination, since PEC boxes reject ordinary mail.
   */
  pec: "amirabechini@pec.it",
  instagram: "amirabechini_master",
  tiktok: "amirabchini1",
  /**
   * Display name only. The academy gave a page name, not a URL, so this is
   * rendered as text and not linked.
   */
  facebook: "Amira Bechini",
  /**
   * The academy's WhatsApp line, supplied as +39 345 323 6514. Stored the way
   * wa.me wants it and the way the test enforces: digits only, country code
   * first, no plus and no spaces.
   *
   * Every WhatsApp affordance on the site reads `whatsappLink` and renders
   * nothing while this is blank, so emptying this string is all it takes to
   * pull the channel off the site again. Nothing hardcodes the number.
   */
  whatsapp: "393453236514",
} as const;

/**
 * The dialable form of the same line, derived from the printed one so the two
 * cannot disagree: everything that is not a digit or the leading plus is
 * stripped, which turns "+39 345 323 6514" into "tel:+393453236514".
 *
 * The plus is kept and is not decoration. A `tel:` number without a country
 * code is dialled against the handset's own country, so an Italian number
 * given to a phone roaming abroad rings the wrong line or nothing at all.
 */
export const phoneLink = studio.phone
  ? `tel:${studio.phone.replace(/[^\d+]/g, "")}`
  : null;

export const whatsappLink = studio.whatsapp ? `https://wa.me/${studio.whatsapp}` : null;

/**
 * The same line with the visitor's opening message already typed, so the first
 * thing she has to do is press send rather than compose. `message` is the
 * localised `contact.whatsappMessage`, encoded because it travels in a query
 * string and every translation of it carries a comma.
 *
 * Null when no number is on file, exactly like `whatsappLink`, so a caller
 * cannot accidentally render a live-looking button for a channel that is off.
 * The plain link is what schema.org uses: an identity URL, not an action.
 */
export const whatsappLinkWith = (message: string) =>
  whatsappLink ? `${whatsappLink}?text=${encodeURIComponent(message)}` : null;
export const instagramLink = `https://instagram.com/${studio.instagram}`;
export const tiktokLink = `https://tiktok.com/@${studio.tiktok}`;

export const addressLine = `${academy.street}, ${academy.postcode} ${academy.city} (${academy.province})`;

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${brand.full}, ${addressLine}`,
)}`;

/**
 * Mux playback id for Amira's welcome message. Empty until the clip is
 * uploaded; the section then shows the still with a caption instead of a
 * broken player.
 */
export const welcomeVideoId = process.env.NEXT_PUBLIC_WELCOME_VIDEO_ID ?? "";

/**
 * Before / after pairs for the results section. The two frames are mapped onto
 * a common canvas from the academy's own photographs, so the eyes sit on the
 * same pixels in both and the wipe reads as one face rather than two
 * photographs. Any new pair has to be aligned the same way.
 *
 * `label` is the accessible name for the slider and the alt text; it is not
 * printed on the page.
 */
export const beforeAfterPairs: { before: string; after: string; label: string }[] = [];
