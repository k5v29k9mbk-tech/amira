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
 * Section rhythm: 64px on phones, 80 on tablet, 112 on desktop.
 *
 * Air is the cheapest luxury signal a page has and the first one a cramped
 * layout loses, so these stay well above what a content site would set. They
 * used to be 96 / 144 / 208, and 208 was too much by a wide margin: with the
 * same measure under the section above it, a break between two acts was 416px
 * of empty ground on a 900px screen — nearly half a viewport of nothing, which
 * a reader does not read as air but as the page having ended.
 *
 * 112 puts a full break at 224 and a join inside a pair at 112, which is the
 * range this kind of editorial page is set in. The rhythm below is unchanged:
 * what makes the ground changes legible as chapter marks is still the
 * difference between a padded join and an unpadded one, not the size of either.
 */
export const sectionPad = "py-16 md:py-20 lg:py-28";

/**
 * The half of that rhythm, for a section that continues the one above it.
 *
 * The page is paced in pairs: two sections share a ground, then the ground
 * changes and a new part of the argument starts. Every section used to carry the
 * full measure top and bottom, so a join *inside* a pair was the same as a break
 * *between* two pairs, and nothing about the spacing said which of the two a
 * reader had just crossed.
 *
 * A continuing section opens with no padding of its own and lives on the closing
 * measure of the section above, so at desktop a join inside a pair is 112px and
 * a break between them is 224. Same tokens, half the value, and the difference
 * is what makes the ground changes legible as chapter marks.
 */
export const sectionPadBottom = "pb-16 md:pb-20 lg:pb-28";
export const sectionPadTop = "pt-16 md:pt-20 lg:pt-28";

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
 *
 * And it is the one size on the site capped by the viewport's height as well as
 * its width, because it is the one size set in a screen that is 100svh with a
 * full composition inside it. Sized off the width alone it takes 200px of a
 * 720px laptop and pushes everything under it past the fold.
 *
 * THE HEIGHT CAP IS 8.8vh, DOWN FROM 10.5, AND THE REASON IS THE LINE BREAK.
 * The hero is now an editorial split: the statement shares the screen with a
 * portrait, so it is set in a column of a little over half the width rather
 * than across the whole of it. At 10.5vh the second of its two sentences no
 * longer fit that column on a laptop, and "Build your career." broke after
 * "your", leaving one word alone on a third line. A display statement is set,
 * not wrapped, and an orphan is the one thing that says nobody looked.
 *
 * 8.8vh is the largest size at which both sentences hold one line each in all
 * four languages, French included, which is the longest of them. The ceiling
 * drops with it, from 8rem to 6.5rem, for the same reason: on a very tall
 * display the vh term stops binding and the ceiling has to hold the same line.
 * On a phone the width term is far smaller and the floor decides, so nothing
 * about the mobile screen changes.
 */
export const displayHero = "display text-[clamp(2.5rem,min(7.2vw,8.8vh),6.5rem)]";
export const displaySection = "display text-[clamp(2rem,4.6vw,4.5rem)]";
export const displayManifesto = "display text-[clamp(1.875rem,4.2vw,4rem)]";
export const displayLarge = "display text-[clamp(1.625rem,2.8vw,2.75rem)]";

/** Size only, for the one heading that animates between two sizes. */
export const chapterSize = "text-[clamp(1.5rem,2.4vw,2.25rem)]";
export const displayChapter = `display ${chapterSize}`;
export const displayRow = "display text-[clamp(1.125rem,1.7vw,1.5rem)]";

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
export const displayStat = "display text-[clamp(1.75rem,2.6vw,2.5rem)]";
export const displayItem = "display text-[1.25rem] md:text-[1.5rem]";
export const displayQuote = "display text-[clamp(1.5rem,3.2vw,2.75rem)]";

/**
 * The rhythm above a page that opens with a heading rather than the hero.
 * 7.5rem clears the fixed bar; the tail is shorter than a section's because
 * what follows is the same page's own first block, not a new act.
 */
export const pageHeader = "pt-[7.5rem] pb-12 md:pt-36 md:pb-16";

/**
 * The small-caps line above a heading. `SectionLabel` is the homepage's
 * numbered variant; these are the plain ones the inner pages use, per ground.
 */
export const eyebrow = "label text-bronze-ink";
export const eyebrowLight = "label text-bronze-hi";

/**
 * Micro-interaction contract for the two action shapes below.
 *
 * `group/btn` and `group/link` are named groups, not bare `group`, and that is
 * load-bearing rather than tidy: several of these sit inside a card or a row that
 * is itself a `group` (the course rows, the gallery frames), and an unnamed group
 * would let a hover anywhere on the parent drive the arrow inside the button. The
 * name scopes the hover to the control the pointer is actually on.
 *
 * An arrow inside either shape moves on hover, 4px along the inline axis, by
 * carrying `arrow` on the icon. It is `translate-x` under a logical selector
 * rather than `translate-x` alone, because in Arabic the arrow is mirrored by
 * `flip-x` and an unmirrored nudge would send it backwards into the label.
 */
const btnBase =
  "label group/btn inline-flex items-center justify-center gap-3 whitespace-nowrap px-10 py-4 transition-colors duration-500 ease-[var(--ease-aura)] active:translate-y-px disabled:opacity-50";

/**
 * The bar-sized variant of the same shape.
 *
 * The header's action and the phone's standing action are the two places a
 * button has to fit a bar rather than a composition, and both had written their
 * own padding inline — `px-5 py-3` in one, `px-5 py-4` in the other, against
 * `px-10 py-4` here. Three paddings for one shape is how a system stops being
 * one. This is the shape at bar scale: same face, same tracking, same gap, same
 * transition, less horizontal padding. Ground colours stay with the caller,
 * because both of those two swap theirs against what is behind them.
 */
export const btnCompact =
  "label group/btn inline-flex items-center justify-center gap-3 whitespace-nowrap px-6 py-3.5 transition-colors duration-500 ease-[var(--ease-aura)] active:translate-y-px";

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
 *
 * The rule draws over 500ms on the house curve and the arrow beside it moves 4px
 * on 300ms, deliberately out of step: the shorter travel finishing first is what
 * makes the pair read as one gesture with a follow-through rather than as two
 * properties transitioning together.
 */
export const linkRule =
  "label group/link relative inline-flex items-center gap-3 py-1 text-espresso transition-colors duration-300 hover:text-bronze-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-[left] after:scale-x-0 after:bg-bronze after:transition-transform after:duration-500 after:ease-[var(--ease-aura)] hover:after:scale-x-100 rtl:after:origin-[right]";

export const linkRuleLight =
  "label group/link relative inline-flex items-center gap-3 py-1 text-ivory transition-colors duration-300 hover:text-bronze-hi after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-[left] after:scale-x-0 after:bg-bronze-hi after:transition-transform after:duration-500 after:ease-[var(--ease-aura)] hover:after:scale-x-100 rtl:after:origin-[right]";

/**
 * The arrow inside a `linkRule`, a button or a course row.
 *
 * One class on the icon, and it is the site's smallest and most repeated piece of
 * motion: 4px along the inline axis when the control it belongs to is hovered or
 * holds focus. Focus is included on purpose, so a keyboard reaches the same
 * affordance a pointer does.
 *
 * `rtl:group-hover/*:-translate-x-1` is the mirror. The glyph is already flipped
 * in Arabic by `flip-x`, so a positive nudge would drive it back into the label it
 * points away from. Three group names are covered because an arrow appears inside
 * all three shapes and Tailwind cannot resolve a group name at runtime.
 */
export const arrow =
  "transition-transform duration-300 ease-[var(--ease-aura)] group-hover/link:translate-x-1 group-focus-visible/link:translate-x-1 group-hover/btn:translate-x-1 group-hover/row:translate-x-1 rtl:group-hover/link:-translate-x-1 rtl:group-focus-visible/link:-translate-x-1 rtl:group-hover/btn:-translate-x-1 rtl:group-hover/row:-translate-x-1";

export const field =
  "w-full rounded-[2px] border border-hair bg-transparent px-4 py-3.5 text-[15px] text-espresso placeholder:text-mute focus:border-espresso focus:outline-none";

export const fieldLabel = "label block text-mute";
