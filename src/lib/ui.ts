// Shared class strings.
// Shape lock: 2px on cards, fields and buttons. Circles only on icon badges.
// Colour lock: one champagne gold. The primary button is ink-on-ivory and
// inverts with the theme, which keeps it at ~15:1 in both modes.
export const btnPrimary =
  "inline-flex items-center justify-center gap-2.5 rounded-[2px] whitespace-nowrap bg-bone px-7 py-3.5 text-[13px] font-medium tracking-[0.12em] text-ink uppercase transition-all duration-300 hover:bg-accent-hi hover:text-accent-ink active:translate-y-px disabled:opacity-50";

export const btnGhost =
  "inline-flex items-center justify-center gap-2.5 rounded-[2px] whitespace-nowrap border border-accent/60 px-7 py-3.5 text-[13px] font-medium tracking-[0.12em] text-bone uppercase transition-all duration-300 hover:border-accent hover:bg-surface-2 active:translate-y-px disabled:opacity-50";

export const field =
  "w-full rounded-[2px] border border-line bg-surface px-4 py-3.5 text-sm text-bone placeholder:text-muted focus:border-accent focus:outline-none";

export const label = "block text-[11px] font-medium tracking-[0.18em] text-muted uppercase";

export const shell = "mx-auto w-full max-w-[1400px] px-5 md:px-10";

export const sectionTitle =
  "display text-[2rem] leading-[1.1] text-bone sm:text-5xl md:text-[3.5rem]";

/** Small caps label with a gold hairline. The poster's TECNICA · PRECISIONE rule. */
export const eyebrow =
  "flex items-center gap-3 text-[11px] font-medium tracking-[0.28em] text-accent-hi uppercase";

/** Circular gold icon ring, straight off the brand poster's feature list. */
export const iconRing =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/50 text-accent-hi";
