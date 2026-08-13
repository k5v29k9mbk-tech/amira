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

/**
 * 1600px content field with the page gutter.
 *
 * The gutter is wider than a reading layout needs, on purpose. It is the margin
 * of the page, and it is what lets a frame that breaks it, the hero portrait at
 * xl, read as breaking something rather than as sitting flush.
 */
export const shell = "mx-auto w-full max-w-[1600px] px-6 md:px-10 lg:px-16";

/**
 * Section rhythm: 96px on phones, 144 on tablet, 208 on desktop.
 *
 * Air is the cheapest luxury signal a page has and the first one a cramped
 * layout loses. These are deliberately larger than a content site would set:
 * at desktop the gap between two acts is more than a fifth of the viewport, so
 * each section arrives alone rather than as the next item in a list.
 */
export const sectionPad = "py-24 md:py-36 lg:py-52";

/**
 * The half of that rhythm, for a section that continues the one above it.
 *
 * The page is paced in pairs: two sections share a ground, then the ground
 * changes and a new part of the argument starts. Every section carried the full
 * measure top and bottom, so a join *inside* a pair was 208px of padding plus
 * another 208, the same 416px as the break *between* two pairs. Nothing about
 * the spacing said which of the two a reader had just crossed, and half a
 * viewport of empty ivory in the middle of one chapter reads as the page having
 * ended rather than as air.
 *
 * A continuing section now opens with no padding of its own and lives on the
 * closing measure of the section above, so a join inside a pair is 208px and a
 * break between them is still 416. Same tokens, half the value, and the
 * difference is what makes the ground changes legible as chapter marks.
 */
export const sectionPadBottom = "pb-24 md:pb-36 lg:pb-52";
export const sectionPadTop = "pt-24 md:pt-36 lg:pt-52";

/*
 * The display scale, largest to smallest. Five steps and no sixth: every
 * oversized line on the site is one of these, so a heading's size states its
 * rank in the page rather than the taste of whoever last touched the file.
 *
 *   hero       the opening statement, once per site
 *   manifesto  the statement that follows it
 *   section    a numbered act, and the closing frame
 *   chapter    a heading inside an act: a method chapter, a course panel
 *   row        a heading inside a list: a question, one of the three claims
 *
 * `displayLarge` sits beside `chapter` and is the pull-quote weight rather than
 * a heading: it is what the founder's mission line is set in.
 */
/*
 * The opening statement. 7.2vw rather than 8: the statement sets in two blocks
 * that each wrap, so it is four lines on a laptop, and four lines of Cormorant
 * at 8vw pushed the portrait's caption onto the fold line. The step down buys
 * roughly 50px of the first screen back and costs nothing anyone can see, since
 * the headline is still the largest thing on the site by a wide margin.
 */
/*
 * The floor is 2.5rem rather than 2.75. At 44px the longest of the four
 * statements, "Créez votre carrière.", is wider than the gutter of a 375px
 * phone and broke to a one-word third line; at 40px it holds. Nothing above
 * 640px changes, because 7.2vw passes 40px at 556.
 */
export const displayHero = "display text-[clamp(2.5rem,7.2vw,8rem)]";
export const displaySection = "display text-[clamp(2.25rem,6vw,7rem)]";
export const displayManifesto = "display text-[clamp(2.25rem,7vw,8rem)]";
export const displayLarge = "display text-[clamp(1.75rem,3.4vw,3.25rem)]";

/** Size only, for the one heading that animates between two sizes. */
export const chapterSize = "text-[clamp(1.75rem,3vw,3rem)]";
export const displayChapter = `display ${chapterSize}`;
export const displayRow = "display text-[clamp(1.25rem,2.2vw,1.875rem)]";

/*
 * Three more steps, added because the inner pages had already invented them.
 * Each of these was written out by hand in two or more files, which is how a
 * locked scale stops being locked: not by someone choosing a sixth size on
 * purpose, but by the same size being retyped somewhere the scale was not
 * imported. Naming them costs nothing and makes the drift visible next time.
 *
 *   stat   a figure the academy states about itself
 *   item   a named entry in a list: a curriculum line, a published value
 *   quote  the page speaking in its own voice, not a heading
 */
export const displayStat = "display text-[clamp(2rem,3.4vw,3rem)]";
export const displayItem = "display text-[1.25rem] md:text-[1.5rem]";
export const displayQuote = "display text-[clamp(1.75rem,4vw,3.5rem)]";

/**
 * The rhythm above a page that opens with a heading rather than the hero.
 * 7.5rem clears the fixed bar; the tail is shorter than a section's because
 * what follows is the same page's own first block, not a new act.
 */
export const pageHeader = "pt-[7.5rem] pb-16 md:pt-40 md:pb-24";

/**
 * The small-caps line above a heading. `SectionLabel` is the homepage's
 * numbered variant; these are the plain ones the inner pages use, per ground.
 */
export const eyebrow = "label text-bronze-ink";
export const eyebrowLight = "label text-bronze-hi";

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
