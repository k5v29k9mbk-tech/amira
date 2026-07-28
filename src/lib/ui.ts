// Shared class strings.
// Shape lock: 2px on cards, fields and buttons. Circles only on icon badges.
// Colour lock: one champagne gold. The primary button is ink-on-ivory and
// inverts with the theme, which keeps it at ~15:1 in both modes.
/**
 * Buttons carry a gold panel that wipes across on hover, drawn on a ::before at
 * -z-10 so it passes behind the label rather than repainting it. `isolate`
 * keeps that stacking context local. The wipe starts from the inline start, so
 * it runs right-to-left in Arabic.
 */
const btnBase =
  "group/btn relative isolate inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-[2px] whitespace-nowrap px-9 py-4 text-[12px] font-medium tracking-[0.16em] uppercase transition-colors duration-500 active:translate-y-px disabled:opacity-50 " +
  "before:absolute before:inset-0 before:-z-10 before:origin-[left] before:scale-x-0 before:transition-transform before:duration-[600ms] before:ease-[cubic-bezier(0.16,1,0.3,1)] hover:before:scale-x-100 rtl:before:origin-[right]";

export const btnPrimary = `${btnBase} bg-bone text-ink before:bg-accent-hi hover:text-accent-ink`;

export const btnGhost = `${btnBase} border border-accent/60 text-bone before:bg-surface-2 hover:border-accent`;

export const field =
  "w-full rounded-[2px] border border-line bg-surface px-4 py-3.5 text-sm text-bone placeholder:text-muted focus:border-accent focus:outline-none";

export const label = "block text-[11px] font-medium tracking-[0.18em] text-muted uppercase";

export const shell = "mx-auto w-full max-w-[1400px] px-5 md:px-10";

// Cormorant has a small x-height, so it needs roughly 12% more size than the
// Didone did to read at the same visual weight.
export const sectionTitle =
  "display text-[2.25rem] leading-[1.12] text-bone sm:text-[3.25rem] md:text-[4rem]";

/** Small caps label with a gold hairline. The poster's TECNICA · PRECISIONE rule. */
export const eyebrow =
  "flex items-center gap-3 text-[11px] font-medium tracking-[0.28em] text-accent-hi uppercase";

/** Circular gold icon ring, straight off the brand poster's feature list. */
export const iconRing =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/50 text-accent-hi";
