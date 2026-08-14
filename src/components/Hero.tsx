import { getTranslations } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { arrow, btnSolidLight, displayHero, linkRuleLight, shell } from "@/lib/ui";
import { dur, heroBeat, stagger } from "@/lib/motion";
import { heroFilmMedia } from "@/lib/media";
import { HeroPortrait } from "./HeroPortrait";
import { HeroBeat, HeroCopy } from "./HeroChoreography";
import { MaskReveal } from "./MaskReveal";
import { MediaFrame } from "./MediaFrame";

/**
 * The three marks the academy can prove, in the order a visitor weighs them:
 * how long she has done this, how many she has taught, how many are in the
 * room. Values are quoted from the client's document, never rounded up here.
 */
const facts = ["years", "students", "classes"] as const;

/**
 * Opening composition.
 *
 * Two columns on a warm ivory field: the statement on the left, Amira in the
 * arch on the right, and a lot of air around both. The grid is bottom aligned,
 * so the primary action and the base of the frame sit on the same line, which
 * is what holds the two halves together.
 *
 * The first screen has to answer four questions before anything is scrolled:
 * who teaches, what is taught, on what evidence, and what to do next. The
 * eyebrow carries the name and the country, the portrait carries its own credit
 * so the face has a name and a role attached to it, and one hairline-ruled line
 * of figures sits between the promise and the action. Nothing here is a card or a
 * badge: the figures are set in the display serif and their labels in the same
 * small caps as every other label on the site, so the row reads as a masthead
 * rather than as statistics.
 *
 * 100svh, not 100vh: the small viewport unit is the one that does not jump when
 * the mobile address bar collapses. It is a floor rather than a cap, so a long
 * translation lengthens the section instead of overflowing it.
 *
 * On phones the portrait leads and the copy follows, because the portrait is
 * the argument: this is a person, and she teaches what she practises.
 */
export async function Hero() {
  const t = await getTranslations("hero");
  const inst = await getTranslations("instructor");

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-night text-ivory pt-[68px] pb-16 md:pt-[76px] md:pb-20">
      {/* Ground. The academy's own film, full bleed, and the two layers that
          make type legible over it.

          It replaces two ivory washes: a beige gradient across the upper field
          and a warm pool behind the arch. Both were there to give flat paper
          some depth, and both were painting over the footage the moment the
          ground stopped being paper.

          The scrim is deliberately two layers rather than one. `overlay` on the
          media is a flat 52% of night across the whole frame, which is what
          holds the statement and the figures; the gradient over it is weighted
          to the two edges, where the fixed header sits above and the scroll cue
          and the primary action sit below. A single flat scrim strong enough for
          the edges would have taken the film with it, and the film is the point.

          `bg-night` on the section is the floor under all of it, so the first
          paint, a blocked autoplay and a reduced-motion visit are all a dark
          composition rather than a flash of white. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <MediaFrame media={heroFilmMedia} priority sizes="100vw" />
        <span className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--aura-black)_70%,transparent),transparent_26%,transparent_54%,color-mix(in_srgb,var(--aura-black)_75%,transparent))]" />
      </div>

      <div
        className={`${shell} grid w-full items-end gap-10 py-8 sm:gap-12 md:py-10 lg:grid-cols-12 lg:gap-10 lg:py-0`}
      >
        {/* The opening score.

            The beats and their intervals are `heroBeat` in lib/motion.ts, not
            numbers typed here, because the only thing that makes a sequence read
            as choreography rather than as things appearing is the interval
            between beats, and that cannot be tuned when it is spread across two
            components. The order is the bar, the portrait, its frame, her name,
            her role, the headline line by line, this line, then the figures: a
            reader meets the person, then the promise, then the evidence.

            The eyebrow and the statement open through apertures; the supporting
            line and the figures fade up. That split is the point. An aperture is
            expensive-looking and used four times on the first screen it stops
            being an event, so it is spent on the three pieces of type that carry
            the argument and withheld from the two that support them. */}
        <HeroCopy className="order-2 max-w-[42rem] lg:order-1 lg:col-span-6 lg:pb-2">
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
              inline row stopped working. From lg this column is 6 of 12, so it
              is about 430px at that breakpoint and 716 at the 1600px cap, while
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

              The two actions are now the two things a visitor can do here:
              read the catalogue, or book. The secondary used to be "Meet
              Amira", pointing at /about, which was the right link while the
              founder arrived two thirds of the way down this page. She is now
              the first act after the statement, with her own link to the full
              story, so the first screen no longer has to carry a third
              destination: it asks for the enquiry instead. */}
          <HeroBeat delay={heroBeat.facts + stagger.base}>
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
        </HeroCopy>

        {/* The columns stay even; the asymmetry is in where the frame sits
            inside its half, not in how many columns each half owns. Taking a
            column off the statement only forced the figures below onto two
            lines, and a masthead that wraps is worse than a symmetrical grid.
            On the widest screens the column is allowed to eat the page gutter,
            so the frame runs past the margin the rest of the page keeps. The
            margin is logical, so in Arabic the frame leans on the left edge
            exactly as it leans on the right in the other three. */}
        <div className="order-1 w-full lg:order-2 lg:col-span-6 lg:col-start-7 xl:-me-6 2xl:-me-12">
          <HeroPortrait
            alt={inst("portrait")}
            name={inst("title")}
            role={t("founderRole")}
            tone="light"
          />
        </div>
      </div>

      {/* Scroll cue: a hairline that fills and empties. No word, no icon. */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-1/2 hidden h-12 w-px -translate-x-1/2 overflow-hidden bg-ivory/20 lg:block"
      >
        <span className="block h-full w-full origin-top bg-ivory/70 motion-safe:animate-[aura-cue_3s_ease-in-out_infinite]" />
      </span>
    </section>
  );
}
