/**
 * Shared class strings.
 *
 * Shape lock: everything is square. Radius appears nowhere except 2px on form
 * fields, where a hard corner reads as a broken input rather than as a
 * decision. No shadows, no glows, no filled tracks: hierarchy is carried by
 * type size, ground colour and one-pixel hairlines.
 *
 * Colour lock: espresso on ivory, ivory on near-black, bronze at hairline
 * weight. The two bronze variants are the text-safe ones per ground; the raw
 * brand bronze is only ever a rule or a border.
 */

/** 1600px content field with the page gutter. */
export const shell = "mx-auto w-full max-w-[1600px] px-5 md:px-8 lg:px-12";

/** Section rhythm: 80px on phones, 128 on tablet, 176 on desktop. */
export const sectionPad = "py-20 md:py-32 lg:py-44";

export const displayHero = "display text-[clamp(2.75rem,8vw,9rem)]";
export const displaySection = "display text-[clamp(2.25rem,6vw,7rem)]";
export const displayManifesto = "display text-[clamp(2.25rem,7vw,8rem)]";
export const displayLarge = "display text-[clamp(1.75rem,3.4vw,3.25rem)]";

const btnBase =
  "label inline-flex items-center justify-center gap-3 whitespace-nowrap px-10 py-4 transition-colors duration-500 ease-[var(--ease-aura)] active:translate-y-px disabled:opacity-50";

/** Primary action on a light ground. */
export const btnSolid = `${btnBase} bg-espresso text-ivory hover:bg-bronze-ink`;

/** Primary action on a dark ground. */
export const btnSolidLight = `${btnBase} bg-ivory text-espresso hover:bg-bronze-hi`;

/** Secondary action, light ground. */
export const btnLine = `${btnBase} border border-espresso/35 text-espresso hover:border-espresso hover:bg-espresso hover:text-ivory`;

/** Secondary action, dark ground. */
export const btnLineLight = `${btnBase} border border-white/30 text-ivory hover:border-ivory hover:bg-ivory hover:text-espresso`;

/**
 * Text link with a rule that draws in from the inline start. It is the only
 * hover decoration on the site, so it looks the same everywhere it appears.
 */
export const linkRule =
  "label group/link relative inline-flex items-center gap-3 py-1 text-espresso transition-colors duration-300 hover:text-bronze-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-[left] after:scale-x-0 after:bg-bronze after:transition-transform after:duration-500 after:ease-[var(--ease-aura)] hover:after:scale-x-100 rtl:after:origin-[right]";

export const linkRuleLight =
  "label group/link relative inline-flex items-center gap-3 py-1 text-ivory transition-colors duration-300 hover:text-bronze-hi after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-[left] after:scale-x-0 after:bg-bronze-hi after:transition-transform after:duration-500 after:ease-[var(--ease-aura)] hover:after:scale-x-100 rtl:after:origin-[right]";

export const field =
  "w-full rounded-[2px] border border-hair bg-transparent px-4 py-3.5 text-[15px] text-espresso placeholder:text-mute focus:border-espresso focus:outline-none";

export const fieldLabel = "label block text-mute";
