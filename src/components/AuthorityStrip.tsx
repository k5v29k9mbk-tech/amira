import { getTranslations } from "next-intl/server";
import { displayChapter, displaySection, sectionPadJoin, shell } from "@/lib/ui";
import { precisionMedia } from "@/lib/media";
import { MediaFrame } from "./MediaFrame";
import { Parallax } from "./Parallax";
import { stagger } from "@/lib/motion";
import { MaskReveal } from "./MaskReveal";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

/**
 * The credibility act: why this teaching is worth trusting, in words.
 *
 * THE FIGURES HAVE GONE BACK TO THE HERO, AND THIS SECTION IS WHAT IS LEFT.
 * Four figures used to stand here under a hairline. The opening screen is now
 * an editorial split with a masthead band in it, carrying the three the academy
 * leads with, so printing them again one screen later added nothing and read as
 * a page repeating itself.
 *
 * What is left is the half the hero cannot carry: the claim that this is taught
 * from inside a working practice, and the sentence about where the protocols
 * come from. Both are qualitative, both are checkable, and neither is a number.
 *
 * THIS IS AN INTERIM SHAPE. The credibility section is its own step in the
 * redesign and has not been rebuilt yet; what happened here was the removal of
 * a duplication the new hero created, not a redesign of the act. When it is
 * rebuilt, the thing to add is evidence the hero has no room for: her training,
 * the institute behind the academy, and the standards the teaching is held to.
 *
 * WHAT MAY BE PRINTED HERE, WHICH IS THE ONLY RULE THIS FILE HAS. Every claim
 * is quoted from the academy's own document. The line about international
 * masterclasses is what her own story says (`about.story.p3`) and is a claim
 * about what she attends, never about what she runs. If a future edit cannot
 * point at the source document, it does not belong in this section.
 *
 * THE GROUND, AND THE RHYTHM EITHER SIDE OF IT. Near-black, continuing the hero
 * and the signature above it, so the opening of the page is one dark movement in
 * three parts: the film, the name, the proof. The manifesto's ivory is then the
 * first change of ground on the page, and it falls on a change of subject.
 *
 * The head is the measure the manifesto used to carry directly under the
 * signature (64px at desktop), because this section is what now follows the
 * signature and the pair still has to read as one movement. The tail is the full
 * section rhythm, so the drop onto ivory is 176px: more than the 112 of a join
 * inside a pair, less than the 224 of a break between two acts, which is exactly
 * what this edge is. The dark opening ends here.
 */
export async function AuthorityStrip() {
  const t = await getTranslations("authority");
  const sections = await getTranslations("sections");
  const inst = await getTranslations("instructor");
  const hero = await getTranslations("hero");

  return (
    <section
      id="standard"
      className={`${sectionPadJoin} scroll-mt-20 bg-espresso text-ivory`}
    >
      <div className={shell}>
        {/* THE SPLIT. Half the field is text, five twelfths is the photograph,
            and the twelfth between them is the whole composition.

            IT ENGAGES AT 880px, NOT AT lg, and that is the fix rather than a
            preference. Built at `lg` it stacked everywhere from 768 to 1023, and
            that band is not "tablet" in practice: it is a laptop window that has
            not been maximised, which is how most of this site is actually looked
            at. The section was reported twice as reading like type above a large
            photograph, and both times the split was working correctly at 1024
            and above and simply never reached. 880 is the narrowest width at
            which six columns of type still hold the headline in three lines, so
            it is the earliest the split can honestly start. Below it the columns
            stack, which is what a phone and a small tablet want.

            The act used to run as two stacked rows: a heading beside a
            standfirst, then a square plate beside a note. That gave the picture
            a row of its own and it read as a banner with captions rather than as
            a spread, and at 509px square on a dark ground it was the loudest
            thing in the section by some distance. One row of two columns puts
            the argument and its proof side by side, which is what act 01 is, and
            it is the arrangement a fashion book uses for exactly this: a column
            of type, a measured gap, a portrait.

            The empty column is not spacing left over. Six columns of text
            against five of picture with nothing between them is a two-up, and a
            two-up reads as a comparison. The gap is what makes it a spread. */}
        <div className="grid gap-12 min-[880px]:grid-cols-12 min-[880px]:items-center min-[880px]:gap-8 lg:gap-10">
          {/* THE TYPE, in reading order and all of it in one column now: the
              mark, the claim, the argument, then the line that qualifies it
              against a hairline. It used to be split across two rows with the
              photograph between, so the standfirst and the note were four
              hundred pixels apart and read as two unrelated notes rather than as
              one paragraph and its footnote. */}
          <div className="min-[880px]:col-span-6">
            <MaskReveal>
              <SectionLabel n={1} tone="light">
                {sections("authority")}
              </SectionLabel>
            </MaskReveal>

            <MaskReveal delay={stagger.base} className="mt-8">
              <h2 className={`${displaySection} max-w-[15ch]`}>{t("title")}</h2>
            </MaskReveal>

            <Reveal delay={stagger.line}>
              <p className="mt-8 max-w-[46ch] text-[17px] leading-relaxed text-mute-dark md:mt-10 md:text-[18px]">
                {t("sub")}
              </p>
            </Reveal>

            <Reveal delay={stagger.line + 0.06}>
              <p className="mt-10 max-w-[46ch] border-t border-hair-dark pt-8 text-[16px] leading-relaxed text-mute-dark md:mt-12 md:pt-10 md:text-[15px]">
                {t("note")}
              </p>
            </Reveal>
          </div>

          {/* THE PORTRAIT. Five columns of twelve, which is a little over forty
              percent of the field, and 4:5 rather than the square it was.

              THE RATIO IS THE ONE CONSTRAINT THAT WAS MEASURED RATHER THAN
              CHOSEN. The brief on this frame is that the calipers are never cut,
              and the file's content runs to both edges: her hair reaches the
              right of the frame and her forearm the left, so every crop takes
              something. What matters is the hand, the face and the tool. At 4:5
              the centred crop keeps the whole fist, both points of the calipers
              and the face, and spends its 205 pixels on the outer edge of her
              hair and the far end of her forearm, which is framing rather than
              loss. 3:4 starts taking the hand. The crop was cut and looked at,
              not inferred.

              THE HEIGHT CAP IS FOR THE STACK, NOT FOR THE SPLIT. Between md and
              880 the two columns are still one above the other, and a 4:5 frame
              at the full width of a 768px tablet is 860px tall: most of a screen
              of photograph under a short column of type, which is the complaint
              this refinement started from. Capped at 30rem and centred it is
              384 wide there and the section comes down by nearly four hundred
              pixels. At lg the cap is lifted and the frame takes its column,
              because that is where the proportion the layout is built on lives:
              six columns of type against five of picture. Capping it there too
              was the first attempt and it cost the picture a fifth of its width,
              which put it at a third of the field instead of the two fifths the
              composition is balanced around.

              THE CAP IS A RANGE, NOT AN OVERRIDE, and it has to be. Written as
              `md:max-h-[30rem]` undone by `min-[880px]:max-h-none`, the undo
              silently lost: both are min-width media queries of equal
              specificity, so which one applies is decided by the order Tailwind
              emits them in, and an arbitrary `min-[...]` variant is not
              guaranteed to sort after a named breakpoint. Measured, the cap was
              still binding at 1440 and the picture rendered 384px wide instead
              of 523, a fifth of the field instead of two fifths. Stacked as
              `md:max-[879px]:` it is one media query with both bounds, it
              applies only in the band it is meant for, and there is nothing left
              to override. */}
          <Parallax
            distance={12}
            className="min-[880px]:col-span-5 min-[880px]:col-start-8"
          >
            <figure className="mx-auto">
              <div className="relative aspect-[4/5] w-full overflow-hidden md:max-[879px]:max-h-[30rem] md:max-[879px]:w-auto">
                <MediaFrame
                  media={precisionMedia}
                  alt={t("portraitAlt")}
                  sizes="(min-width: 1024px) 28vw, 100vw"
                />
              </div>
              {/* HER NAME, AS THE CAPTION TO HER HANDS.
                This is what is left of `Signature`, the band that used to sit
                between the hero and this section: her name at chapter size, her
                role under it, and a line about what she is for. Two of those
                three were worth keeping and the third was not - "formare
                professioniste competenti, con percorsi pratici, supporto
                continuo e standard elevati" is four benefits the page then
                makes four more times - so the band went and the name came here.

                It reads better here than it did there. There it captioned a
                photograph one section above it, with a ground change in
                between; here it captions the photograph it is standing next to,
                which is the academy's own frame of her measuring a brow. The
                claim in this act is that the teaching comes out of the work.
                Her name under the hands doing the work is that claim, made
                twice in one composition.

                `instructor.mission` stays in all four catalogues for /about and
                the course pages. */}
              <figcaption className="mt-6 border-t border-hair-dark pt-5">
                <p className={`${displayChapter} leading-none`}>
                  {inst("title")}
                </p>
                <p className="label mt-3 leading-[1.6] text-bronze-hi">
                  {hero("founderRole")}
                </p>
              </figcaption>
            </figure>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
