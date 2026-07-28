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
   * TODO(academy): digits only, no + or spaces. Empty until the academy
   * supplies the number. Every WhatsApp affordance on the site — the floating
   * button, the contact row — checks `whatsappLink` and disappears while this
   * is blank, so nothing links to a guessed number.
   */
  whatsapp: "",
} as const;

export const whatsappLink = studio.whatsapp ? `https://wa.me/${studio.whatsapp}` : null;
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
export const beforeAfterPairs: { before: string; after: string; label: string }[] = [
  {
    before: "/brand/brows-before.jpg",
    after: "/brand/brows-after.jpg",
    label: "Brow artistry",
  },
];
