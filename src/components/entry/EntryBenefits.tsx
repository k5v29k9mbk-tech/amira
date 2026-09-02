import Image from "next/image";
import {
  GraduationCap,
  PenNib,
  SealCheck,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/Reveal";
import { shell } from "@/lib/ui";
import { entryCopy } from "@/lib/entry";

/**
 * The dark strip under the hero: four claims, four line icons, three hairline
 * rules between them.
 *
 * WHY IT IS A GROUND CHANGE AND NOT A ROW OF CARDS. The reference sets these
 * four on a near-black band that runs the full width of the page, and that is
 * the whole reason the section reads as premium rather than as a feature grid:
 * the claims are separated by one-pixel rules on a shared ground, so they are
 * four columns of one object. Four bordered boxes on ivory would be the same
 * four sentences and a different kind of website — the one `lib/ui.ts` opens by
 * ruling out, with its shape lock and its "no cards, no pills, no glows".
 *
 * THE PHOTOGRAPH BEHIND IT IS REAL AND IS BARELY THERE. `classroom-practice`
 * is the academy's own room, and it sits at 15% under a charcoal wash so the
 * band has the depth the reference's does without becoming an image section.
 * It is `aria-hidden` and carries an empty alt: it is a texture, and a screen
 * reader announcing a classroom here would be describing something no sighted
 * reader is being asked to look at either. It is also the reason the wash is a
 * solid colour rather than an opacity on the band — type on a photograph needs a
 * floor it can be measured against, and ivory on this one is 14.8:1.
 *
 * THE RULES ARE BRONZE, NOT WHITE. A hairline of `--aura-bronze` at 40% is
 * what the reference draws between these four and it is the site's own
 * vocabulary for a rule; white at the same weight reads as a table border and
 * is the one thing on this band that would have looked like a UI rather than a
 * campaign. It is decoration either way, so the contrast floor that governs the
 * type above does not apply to it.
 *
 * THE FOUR COLUMNS ALIGN ON A SUBGRID, which is the fix for the only thing that
 * gave this band away as a grid of four independent cells: "World-renowned
 * PhiBrows method" sets on two lines and the other three headings set on one, so
 * every paragraph started at a different height and the row read as four
 * unrelated blocks. `grid-rows-subgrid` makes each cell inherit the parent's
 * three rows — icon, heading, body — so the three bands line up across all four
 * columns no matter how any one heading wraps. It is locale-proof, which a
 * `min-height` guess would not have been: the French and Arabic headings are
 * longer again.
 *
 * THE DIVIDERS ARE `divide-*`, NOT BORDERS ON THE CHILDREN, so the first column
 * in each row never carries a leading rule and nothing has to be special-cased
 * per breakpoint: the utility puts a rule between siblings and knows which
 * sibling is first. `divide-x` is logical in Tailwind v4, so the rules land on
 * the correct side in Arabic without a second rule set.
 */
export function EntryBenefits({ locale }: { locale: string }) {
  const copy = entryCopy(locale);

  /**
   * Four line icons in the brand metal, at hairline weight.
   *
   * `weight="light"` is the whole of the icon style here: at 1px stroke a
   * Phosphor glyph reads as a drawn mark rather than as an interface affordance,
   * which is the difference between this band and a features row. They are
   * `aria-hidden` because each one sits directly above the heading it
   * illustrates, and an icon that repeats its own label is noise in a screen
   * reader.
   */
  const icons = [PenNib, GraduationCap, SealCheck, UsersThree] as const;

  return (
    <section className="relative isolate overflow-hidden bg-charcoal text-ivory">
      <Image
        src="/brand/classroom-practice.jpg"
        alt=""
        aria-hidden
        fill
        loading="lazy"
        sizes="100vw"
        className="media-fit -z-10 opacity-15"
        style={{ "--obj": "50% 45%" } as React.CSSProperties}
      />
      {/* The wash. Solid rather than an alpha on the photograph, so the contrast
          floor under the type is a known number at every viewport width instead
          of a function of whatever pixels the crop happens to land on. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-charcoal/85" />

      <div className={shell}>
        {/*
          TWO COLUMNS ON A PHONE, FOUR FROM lg, AND NOTHING IN BETWEEN.

          One column would be four full-width claims stacked into a 900px scroll
          of near-black, which is a wall rather than a band. Two is the shape the
          content wants on a handset: the headings are two or three words and the
          bodies one sentence, so a 160px column holds them without a single
          orphan at 320px.

          `divide-y` between the two ROWS at that width, `lg:divide-y-0` once
          they are one row. The vertical rules are `divide-x` throughout and the
          horizontal ones only exist while the grid wraps, which is what keeps
          the four reading as a grid rather than as a list at every width.
        */}
        <div className="grid grid-cols-2 divide-x divide-y divide-bronze/40 lg:grid-cols-4 lg:grid-rows-[auto_auto_1fr] lg:divide-y-0">
          {copy.benefits.map((benefit, i) => {
            const Icon = icons[i];
            return (
              <Reveal
                key={benefit.title}
                delay={i * 0.08}
                className="flex flex-col items-center px-4 py-10 text-center sm:px-6 md:py-14 lg:row-span-3 lg:grid lg:grid-rows-subgrid lg:items-start lg:justify-items-center lg:gap-0 lg:px-8 lg:py-16"
              >
                <Icon
                  size={38}
                  weight="light"
                  aria-hidden
                  className="text-bronze-hi md:h-11 md:w-11"
                />
                {/*
                  `label` gives 11/12px small caps at 0.2em, which is the site's
                  caption. These are headings and have to out-rank the sentence
                  under them, so they take the same face a step up with the
                  tracking pulled back a little: at 0.2em a two-word heading set
                  at 13px is wider than a 160px column on a 320px phone, and the
                  reference's own headings are tracked tighter than its labels
                  for the same reason.

                  `entry-cap` rather than `.label` plus overrides, which the
                  note at `.hero .fact-label` in globals.css explains cannot
                  work: `.label` is declared unlayered and every Tailwind utility
                  lives in `@layer utilities`, so a `tracking-` beside it is
                  discarded before source order is consulted. `entry-cap` is
                  also what carries the Arabic reset -- tracked Naskh is broken
                  joining, not tracking -- which a bare utility had no way to.
                */}
                <h3 className="entry-cap mt-6 text-[0.75rem] leading-[1.5] md:mt-7 md:text-[0.8125rem]">
                  {benefit.title}
                </h3>
                <p className="mt-4 max-w-[26ch] text-[14px] leading-relaxed text-mute-dark md:mt-5 md:text-[15px]">
                  {benefit.body}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
