import { getTranslations } from "next-intl/server";
import { displayLarge, shell } from "@/lib/ui";
import { dur, stagger } from "@/lib/motion";
import { MaskReveal } from "./MaskReveal";
import { Reveal } from "./Reveal";

/**
 * The signature: her name and her titles, alone on the espresso ground.
 *
 * WHY IT IS NOT IN THE HERO ANY MORE. It used to close the hero's centred
 * column, under the two actions, as the last beat of the opening score. That is
 * the correct place for a name on a title card and the wrong place for it on
 * this page, for one reason that only shows up on a real screen: the hero is
 * `100svh` with its composition centred in it, so on a 720px laptop the name was
 * the piece that got pushed against the fold, and it read as the tail of a block
 * of marketing copy rather than as the thing being signed.
 *
 * Standing on its own it is a title card of its own. The film stops at the foot
 * of the hero, the ground stays espresso, and what a reader meets after the
 * first screen is her name on a plain field with nothing else in it. The two
 * sections read as two because the ground has stopped moving, not because a
 * colour changed: the hero is a lit classroom behind glass, this is the flat
 * near-black underneath it. That is also what gives the manifesto's ivory its
 * job back — it is the first change of ground on the page, and it now falls on a
 * change of subject rather than in the middle of one.
 *
 * The construction is exactly the hero's, moved: the hairline cut to 3.5rem and
 * centred, the name at the pull-quote size, the titles under it in the bronze
 * that is legible on black. What changes is only the cue. In the hero this
 * played on mount, on a delay, as the last beat of a score; below the fold there
 * is no score to be last in, so the rule and the name wipe in together when the
 * section is reached, and the titles fade a line behind them.
 *
 * The name is `instructor.title` and the titles are `hero.founderRole`, both
 * unchanged and both already in all four catalogues. Her section further down
 * the page (act 01) signs her a second time with the same construction at
 * reading size; these are the two moments on the homepage that name her, and
 * they are meant to be recognisably the same mark.
 */
export async function Signature() {
  const t = await getTranslations("hero");
  const inst = await getTranslations("instructor");

  /*
   * THE RHYTHM IS DELIBERATELY NOT `sectionPad`, AND THIS IS THE ONE
   * MEASUREMENT ON THE PAGE WORTH WRITING DOWN.
   *
   * The house rhythm is 112px top and bottom at desktop, which is right for
   * an act with an argument in it. Two of them meeting is 224px, and 224px
   * of nothing between her name and the statement it introduces is not air,
   * it is a reader wondering whether the page ended. The signature and the
   * manifesto are not two acts: they are a name and the sentence that name
   * is saying, and the whole point of the pair is that the second reads as
   * coming out of the first.
   *
   * So the tail here is 48px and the manifesto's head is 64px, which is 112
   * between the two — the house rhythm's *join*, spent once across the
   * ground change rather than twice. The head above the name keeps the full
   * 64 so it clears the hero's scroll cue, which sits in the last 80px of
   * the section above.
   *
   * Change one of these and change the other: they are a pair, and the
   * matching note is at the top of `Manifesto`.
   */
  return (
    <section className="pt-10 pb-8 md:pt-12 md:pb-10 lg:pt-16 lg:pb-12 bg-espresso text-ivory">
      <div className={`${shell} text-center`}>
        {/* The rule and the name are inside one aperture rather than two, so
            they wipe in as a single gesture: the line draws and the name lands
            on it. Two apertures a beat apart would make the hairline an event
            of its own, which is more than a 56px rule can carry. */}
        <MaskReveal duration={dur.slow}>
          <span className="mx-auto mb-5 block h-px w-14 bg-bronze-hi/50" />
          <p className={`${displayLarge} leading-[1.1] text-ivory`}>{inst("title")}</p>
        </MaskReveal>

        <Reveal delay={stagger.line} className="mt-3.5">
          <p className="label leading-[1.7] text-bronze-hi">{t("founderRole")}</p>
        </Reveal>
      </div>
    </section>
  );
}
