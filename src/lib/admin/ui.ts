/**
 * The admin's class strings.
 *
 * IT IS A TOOL, NOT A SHOWCASE. The public site is paced in 112px sections and
 * set in a display serif; none of that belongs here. What is borrowed is the
 * palette and the two faces, so the dashboard is recognisably the same
 * property, and the shape lock -- square corners, hairline rules, no shadows
 * and no filled tracks -- because those are cheap to honour and a rounded card
 * with a drop shadow would look like it wandered in from another product.
 *
 * Everything else is denser than the site by a wide margin: 8px rhythm instead
 * of 112, 13-14px type instead of a clamp, and labels in the sans at every
 * size. Cormorant appears exactly once, on the wordmark in the header.
 */

/** Page frame. Narrower than the site's 1600 because forms are read, not scanned. */
export const adminShell = "mx-auto w-full max-w-[1100px] px-5 md:px-8";

/** The page's ground. Paper rather than ivory: forms need the lighter of the two. */
export const adminPage = "min-h-dvh bg-paper text-espresso";

export const adminHeader =
  "border-b border-hair bg-ivory/80 backdrop-blur supports-[backdrop-filter]:bg-ivory/60";

/** Section heading, 13px, tracked, uppercase. The only label style. */
export const adminLabel =
  "text-[11px] font-medium uppercase tracking-[0.14em] text-mute";

export const adminTitle = "text-[19px] font-medium tracking-tight text-espresso";

export const adminBody = "text-[14px] leading-relaxed text-espresso";
export const adminHint = "text-[12.5px] leading-relaxed text-mute";

/**
 * Text input. 2px radius is the one place a corner is softened on this
 * property, and the reason is in `globals.css`: at this size a hard corner
 * reads as a broken input rather than as a decision.
 */
export const adminField =
  "w-full rounded-[2px] border border-hair bg-white px-3 py-2.5 text-[14px] text-espresso " +
  "outline-none transition-colors placeholder:text-taupe " +
  "focus:border-bronze focus:ring-1 focus:ring-bronze/30 " +
  "disabled:cursor-not-allowed disabled:bg-ivory disabled:text-mute";

export const adminFieldLabel =
  "mb-1.5 block text-[12px] font-medium tracking-[0.02em] text-espresso";

/** Primary action. Solid espresso, square, no shadow. */
export const adminButton =
  "inline-flex items-center justify-center gap-2 bg-espresso px-4 py-2.5 text-[13px] " +
  "font-medium tracking-[0.02em] text-ivory transition-opacity hover:opacity-85 " +
  "disabled:cursor-not-allowed disabled:opacity-45";

/** Secondary action: a hairline box, same metrics. */
export const adminButtonLine =
  "inline-flex items-center justify-center gap-2 border border-hair bg-transparent px-4 py-2.5 " +
  "text-[13px] font-medium tracking-[0.02em] text-espresso transition-colors " +
  "hover:border-espresso disabled:cursor-not-allowed disabled:opacity-45";

/**
 * An error the person must read before trying again.
 *
 * Bronze rather than a red, because the palette has no red and introducing one
 * for a mistyped password would be the loudest colour on the property. The
 * left rule and the weight carry the urgency instead.
 */
export const adminError =
  "border-s-2 border-bronze bg-bronze/[0.07] px-3.5 py-3 text-[13px] leading-relaxed text-bronze-ink";

export const adminNotice =
  "border-s-2 border-hair bg-ivory px-3.5 py-3 text-[13px] leading-relaxed text-mute";

/** A hairline panel. The only container shape in the admin. */
export const adminPanel = "border border-hair bg-white";

export const adminRule = "border-hair";
