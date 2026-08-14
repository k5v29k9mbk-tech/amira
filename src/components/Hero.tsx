import { getTranslations } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import {
  arrow,
  btnSolidLight,
  displayHero,
  displayLarge,
  linkRuleLight,
  shell,
} from "@/lib/ui";
import { dur, heroBeat, stagger } from "@/lib/motion";
import { HeroFilm } from "./HeroFilm";
import { HeroBeat, HeroCopy } from "./HeroChoreography";
import { MaskReveal } from "./MaskReveal";

/**
 * The three marks the academy can prove, in the order a visitor weighs them:
 * how long she has done this, how many she has taught, how many are in the
 * room. Values are quoted from the client's document, never rounded up here.
 */
const facts = ["years", "students", "classes"] as const;

/**
 * Opening composition: the academy's film, and the campaign set on it.
 *
 * THE CHANGE OF FORM. This screen used to be two columns on ivory, a statement
 * beside Amira in the arch. The film is now the composition rather than a
 * ground behind one, and a full-bleed clip with a portrait plate parked on top
 * of it is two focal images competing inside one frame: the eye is given a face
 * to read and a room to read and settles on neither. So the arch comes off the
 * first screen. `HeroPortrait` is kept, and so is the graded master it holds
 * (`heroMedia`, `amira-portrait-hero.jpg`), which is exactly as it was on disk;
 * nothing else on the site loses a photograph, and the founder's own section
 * further down the page still carries her portrait.
 *
 * What replaces the plate is her name. A campaign is signed rather than
 * illustrated, and this one now signs itself at the inline end of the last line
 * of the composition.
 *
 * THE GRID, AND WHY NOTHING IS CENTRED. Twelve columns, bottom aligned, with the
 * whole composition sitting on the closing measure of the section: the statement
 * and its evidence on columns 1 to 7, the signature alone on 9 to 12, and the
 * top third of the screen left as nothing but film. That asymmetry is the
 * design. A statement centred in the middle of a video is the house style of
 * every template that has ever shipped with a stock clip behind it, and it wins
 * legibility by covering the footage evenly, which is the one thing this screen
 * cannot afford to do.
 *
 * Bottom alignment is what makes the film readable as film. A reader meets the
 * frame first, uninterrupted, and the type second, and the scrim in `HeroFilm`
 * is shaped to exactly that: heavy along the bottom band and the inline start
 * where the type is, eight percent across the middle where it is not.
 *
 * 100svh, not 100vh: the small viewport unit is the one that does not jump when
 * the mobile address bar collapses. It is a floor rather than a cap, so a long
 * translation lengthens the section instead of overflowing it.
 *
 * On phones the twelve columns collapse to one and the order is the reading
 * order: the bar, the statement, the promise, the evidence, the two actions,
 * then the signature at the foot of it. The signature keeps its rule and loses
 * only its alignment, which is the one thing about it that needs a second
 * column to mean anything.
 */
export async function Hero() {
  const t = await getTranslations("hero");
  const inst = await getTranslations("instructor");

  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-espresso text-ivory pt-[68px] pb-14 md:pt-[76px] md:pb-16 lg:pb-20">
      <HeroFilm />

      {/* The opening score.

          The beats and their intervals are `heroBeat` in lib/motion.ts, not
          numbers typed here, because the only thing that makes a sequence read
          as choreography rather than as things appearing is the interval
          between beats, and that cannot be tuned when it is spread across two
          components. The order is the bar, the statement line by line, the
          supporting line, the figures, the actions, then her name and her role.

          `HeroCopy` wraps the whole grid rather than the copy column alone, so
          the cue that holds the screen until any opening film has finished is
          read once and handed to both halves. Two blocks polling the same event
          is how a sequence acquires a stutter nobody can find later.

          The bar, the statement and the signature open through apertures; the
          supporting line, the figures and the actions fade up. That split is the
          point. An aperture is the expensive-looking reveal, and used six times
          on one screen it stops being an event, so it is spent on the three
          pieces of type that carry the argument and withheld from the three that
          support them. */}
      <HeroCopy
        className={`${shell} grid w-full items-end gap-y-12 sm:gap-y-14 lg:grid-cols-12 lg:gap-10`}
      >
        <div className="max-w-[42rem] lg:col-span-7 lg:col-start-1">
          {/* Three facts, one line: the academy, what it does, where. Wraps
              to two lines on a phone, so it carries its own leading. */}
          <MaskReveal onMount delay={heroBeat.bar} duration={dur.base}>
            <p className="label leading-[1.8] text-bronze-hi">{t("eyebrow")}</p>
          </MaskReveal>

          {/* The measure is lifted below sm. 15ch of Cormorant at the floor
              size is about 330px, and a 390px phone has 342 of gutter to
              gutter: the cap was throwing "carriera." and "carrière." onto a
              third line to save nothing. Above sm it is the reading measure
              again, which is what keeps the statement from running the width
              of a laptop.

              Two blocks, two apertures, one beat apart. The statement was
              already set as two lines the academy wrote separately, which is
              what makes line masking possible here without measuring anything:
              nothing is split by code, so nothing can split differently in
              Italian, French or Arabic. The second line's aperture is a
              `stagger.line` behind the first, which is what makes the headline
              read as typesetting rather than as a block arriving. */}
          <h1 className={`${displayHero} mt-6 max-w-[19ch] text-balance sm:max-w-[15ch] md:mt-8`}>
            <MaskReveal onMount delay={heroBeat.headline} duration={dur.slow}>
              <span className="block">{t("titleA")}</span>
            </MaskReveal>
            <MaskReveal
              onMount
              delay={heroBeat.headline + stagger.line}
              duration={dur.slow}
            >
              <span className="block">{t("titleB")}</span>
            </MaskReveal>
          </h1>

          <HeroBeat delay={heroBeat.sub}>
            <p className="mt-6 max-w-[46ch] text-[16px] leading-relaxed text-ivory/85 sm:text-[17px] md:mt-8 md:text-[19px]">
              {t("sub")}
            </p>
          </HeroBeat>

          {/* Proof. A hairline above it and nothing around it: the figures are
              the evidence for the sentence above and the reason to press the
              button below, so they sit between the two.

              Three columns on a phone, one line from sm. Set inline, the three
              pairs are about 520px of type and a phone has 342, so they broke
              one to a line and the masthead became a bulleted list down the
              left edge. Stacked in three columns the figures stay on one
              baseline, which is the only thing about the row that has to be
              true for it to read as a masthead.

              And back to three columns from lg, which is the width where the
              inline row stopped working. From lg this column is 7 of 12, so it
              is about 500px at that breakpoint and 836 at the 1600px cap, while
              the three pairs set inline need roughly 700 of type plus 80 of
              gutter. The row wrapped, and it wrapped in the worst available
              shape: two pairs on the first line and the third alone under them,
              which reads as a list that has run out of room rather than as a
              masthead. Three columns holds the three figures on one baseline at
              every width, and it is shorter than the wrap it replaces, which the
              first screen has better uses for. */}
          <HeroBeat delay={heroBeat.facts}>
            <dl className="mt-8 grid grid-cols-3 gap-x-4 gap-y-3 border-t border-hair-dark pt-6 sm:flex sm:flex-wrap sm:items-baseline sm:gap-x-8 md:mt-10 md:gap-x-10 lg:grid lg:grid-cols-3 lg:gap-x-6 xl:gap-x-8">
              {facts.map((k) => (
                <div
                  key={k}
                  className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-2.5 lg:flex-col lg:items-start lg:gap-2"
                >
                  <dt className="display text-[1.375rem] leading-none text-ivory md:text-[1.5rem]">
                    {t(`facts.${k}.value`)}
                  </dt>
                  <dd className="label leading-[1.5] text-mute-dark">{t(`facts.${k}.label`)}</dd>
                </div>
              ))}
            </dl>
          </HeroBeat>

          {/* The primary action takes the width on a phone. A 230px button
              floated against the inline edge of a 390px screen is the one
              element in the composition that reads as an afterthought, and it
              is the only thing on the first screen a visitor is meant to
              press. The secondary stays a text link at every width, so the
              hierarchy between the two never becomes two buttons.

              Both are the light-ground pair now. On the film, an espresso
              button is a hole cut in the footage and an espresso rule under a
              link is invisible; the ivory pair is the same two shapes on the
              other ground, and ui.ts has carried it for the dark sections since
              before this screen needed it. */}
          <HeroBeat delay={heroBeat.actions}>
            <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
              <Link href="/courses" className={`${btnSolidLight} w-full sm:w-auto`}>
                {t("primary")}
              </Link>
              <Link href="/contact" className={linkRuleLight}>
                {t("secondary")}
                <ArrowRight size={14} weight="light" className={`flip-x ${arrow}`} />
              </Link>
            </div>
          </HeroBeat>
        </div>

        {/* The signature.

            Her name is the last thing to arrive and the only type on the screen
            set against the far margin, which is what makes it read as a
            signature on the frame rather than as a second heading. It is the
            display serif at the pull-quote size: comfortably below the
            statement, comfortably above everything else, so it is the second
            thing the eye finds and never competes for first.

            The rule above it is the same hairline that carries the figures on
            the other side of the grid, cut to 3.5rem. It arrives a beat ahead of
            the name and inside the same aperture, so the pair wipes in as one
            gesture: the line draws, the name lands on it.

            Alignment is the one thing that changes with the breakpoint. From lg
            the block is pushed to columns 9 to 12 and set to the inline end,
            which puts her name at the far corner of the composition, diagonally
            opposite the eyebrow. Below lg there is one column and no far corner
            to sign, so it keeps the margin every other line is hung on. Both are
            logical properties, so Arabic gets the mirror rather than a special
            case. */}
        <div className="lg:col-span-4 lg:col-start-9 lg:pb-1 lg:text-end">
          <MaskReveal onMount delay={heroBeat.name} duration={dur.slow}>
            <span className="mb-5 block h-px w-14 bg-bronze-hi/50 lg:ms-auto" />
            <p className={`${displayLarge} leading-[1.1] text-ivory`}>{inst("title")}</p>
          </MaskReveal>

          <HeroBeat delay={heroBeat.role} className="mt-3.5">
            <p className="label leading-[1.7] text-bronze-hi">{t("founderRole")}</p>
          </HeroBeat>
        </div>
      </HeroCopy>

      {/* Scroll cue: a hairline that fills and empties. No word, no icon.
          It sits in the band between the actions and the signature, which is the
          one part of the last line of the composition that carries no type at
          any width above lg. */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-1/2 hidden h-12 w-px -translate-x-1/2 overflow-hidden bg-ivory/20 lg:block"
      >
        <span className="block h-full w-full origin-top bg-ivory/70 motion-safe:animate-[aura-cue_3s_ease-in-out_infinite]" />
      </span>
    </section>
  );
}
