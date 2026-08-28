import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { btnSolidLight, displayHero, shell } from "@/lib/ui";
import { dur, heroBeat, stagger } from "@/lib/motion";
import { HeroFilm } from "./HeroFilm";
import { HeroBeat, HeroCopy } from "./HeroChoreography";
import { MaskReveal } from "./MaskReveal";
import { Magnetic } from "./Magnetic";

/**
 * THE FIRST SCREEN: the academy's film, full bleed, with the title card set
 * over it.
 *
 * RESTORED, NOT REDESIGNED. This is the composition the site carried until
 * `929d7d0`, "Step 1: rebuild the hero around Amira", which replaced the footage
 * with a studio portrait and turned the screen into an ivory split, copy on the
 * left and photograph on the right. Everything below is that earlier screen put
 * back: the same centred column, the same order of beats, the same figure band
 * under the supporting line, the same pair of light-ground actions, and
 * `HeroFilm` behind all of it. What is not restored is the copy, which is
 * today's; see the note at the eyebrow.
 *
 * WHICH FILM, AND HOW IT WAS IDENTIFIED, because two different video heroes
 * existed and only one of them is this one. `heroFilmMedia` pointed at the
 * pigment macro until the repositioning (`c502264`) swapped it for the classroom
 * footage. The two eras are told apart by the screen itself rather than by the
 * clip: the figure band sat *inside* the hero only while the pigment cut played,
 * and it had already moved out to `AuthorityStrip` by the time the classroom
 * footage arrived. A reference showing three figures over the video is therefore
 * necessarily the pigment era, and so is a bar reading "beauty education", which
 * is the wording that same commit replaced. Both details agree, so this screen
 * is the pigment one and `lib/media` points back at it.
 *
 * THE GROUND IS ESPRESSO AND THE TYPE IS IVORY, which is the whole reason the
 * scrim in `HeroFilm` exists: four layers of the brand's own near-black, pooled
 * in the middle of the frame where the words are and released at the corners, so
 * the darkness is concentrated where the reading happens and the picture stays a
 * picture everywhere else. It is unchanged from the version that shipped with
 * this screen, byte for byte, and it is what keeps white type legible over a
 * moving image without flattening the image into a grey rectangle.
 *
 * THE COMPOSITION IS CENTRED AND IT CANNOT SPEND WHATEVER HEIGHT IT LIKES. The
 * section is the full small viewport, but the fixed bar owns the top of it and
 * the scroll cue the bottom, so the padding clears both and the centring happens
 * inside the padding box rather than the border box. Every gap in the column is
 * one of the five `--hero-air-*` steps declared on `.hero` in globals.css: a
 * centred hero grows past the fold in both directions at once, so the intervals
 * are clamped against viewport height rather than set, and the ratios between
 * them hold at every screen because they are struck from the same figure.
 *
 * THE REVEAL IS SPLIT, ON PURPOSE. The bar and the two lines of the statement
 * open through apertures; the supporting line, the figures and the actions fade
 * up. An aperture is the expensive-looking reveal, and used six times on one
 * screen it stops being an event, so it is spent on the type that carries the
 * argument and withheld from the type that supports it. The intervals are
 * `heroBeat` in lib/motion.ts rather than numbers typed here, because the only
 * thing that makes a sequence read as choreography is the spacing between its
 * beats, and that cannot be tuned when it is scattered across two components.
 */

/**
 * The three marks the academy can prove. The order is deliberate: what has been
 * done, to how many, under what constraint. Values are quoted from the client's
 * document and are never rounded up here.
 */
const facts = ["years", "students", "classes"] as const;

export async function Hero() {
  const t = await getTranslations("hero");
  const c = await getTranslations("cta");

  return (
    <section className="hero relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-espresso pt-[clamp(96px,12vh,112px)] pb-[clamp(56px,7vh,88px)] text-ivory">
      <HeroFilm />

      <HeroCopy className={`${shell} flex w-full flex-col items-center text-center`}>
        {/* THE BAR. Three facts joined by middots: the academy, what it does,
            where.

            THE COPY HERE IS TODAY'S, NOT THE ONE THIS SCREEN SHIPPED WITH, and
            that is a decision rather than an oversight. This line read
            "Professional beauty education" when the composition below was last
            on the site; `c502264`, "Reposition as a professional PMU education
            brand", changed it to "PMU education" across all four catalogues and
            changed `positioning.academy` to match. Restoring the layout is a
            layout change; reverting that string would quietly undo a brand
            decision the rest of the site still speaks in. The key is
            `hero.eyebrow` and it is one line in four files if the academy wants
            the older wording back.

            `text-balance` is load bearing. The line is longer than a phone line
            at every width below about 640, so it always wraps and the only
            question is where: left to the browser it broke wherever the last
            word stopped fitting, which put "· ITALY" alone under a full line. A
            label set as one long line and one orphan reads as type that
            overflowed; the same words balanced over two even lines read as a bar
            that was set. */}
        <MaskReveal onMount delay={heroBeat.bar} duration={dur.base}>
          <p className="label text-balance leading-[1.7] text-bronze-hi">
            {t("eyebrow")}
          </p>
        </MaskReveal>

        {/* THE STATEMENT. Two blocks, two apertures, one beat apart.

            It is set as the two lines the academy wrote separately, so nothing
            is split by code and nothing can split differently in Italian, French
            or Arabic. The measure is lifted below sm because 15ch of Cormorant
            at the floor size is about 330px against a 390px phone's 342 of
            gutter to gutter, and the cap was throwing the last word of the
            Italian and the French onto a third line to save nothing. */}
        <h1
          className={`${displayHero} hero-statement mt-[var(--hero-air-sm)] max-w-[19ch] text-balance sm:max-w-[15ch]`}
        >
          <MaskReveal onMount delay={heroBeat.headline} duration={dur.slow}>
            <span className="block">{t("titleA")}</span>
          </MaskReveal>
          {/* A real space between the two blocks, and it is not decorative. They
              are siblings with no whitespace between them, so everything that
              reads the document rather than paints it, copy and paste, a screen
              reader, a crawler, a share preview, received the two sentences as
              one token. A whitespace-only text node between two block boxes
              paints nothing, so the composition is unchanged and the sentence is
              a sentence again. */}{" "}
          <MaskReveal
            onMount
            delay={heroBeat.headline + stagger.line}
            duration={dur.slow}
          >
            <span className="block">{t("titleB")}</span>
          </MaskReveal>
        </h1>

        {/* THE SUPPORTING LINE, and every choice in it is a step down from the
            statement rather than a smaller version of it. The measure is 34ch on
            a phone against the statement's 19, so it sits visibly inside it and
            reads as subordinate; the grade is 75% ivory, which still clears AA
            over the pool the scrim puts exactly here, and is the difference
            between two things shouting and one speaking. */}
        <HeroBeat delay={heroBeat.sub}>
          <p className="mx-auto mt-[var(--hero-air-md)] max-w-[34ch] text-balance text-[16px] leading-[1.75] text-ivory/80 sm:max-w-[46ch] md:text-[17px] lg:max-w-[50ch]">
            {t("sub")}
          </p>
        </HeroBeat>

        {/* THE FIGURE BAND, back on the first screen and back inside the title
            card, between the supporting line and the actions.

            THE THIRD FIGURE IS NOT THE SAME KIND OF THING AS THE OTHER TWO, and
            the typography says so. Eight years and a hundred and fifty students
            are records: they say what has already happened, and any established
            academy could print a version of them. Three to four to a class is a
            constraint accepted on every course the academy runs, and it is the
            only one of the three that tells a visitor what will happen to her,
            in the room, on the day. It gets bronze instead of ivory and a step
            up in size, and nothing else. Two quiet differences read as emphasis;
            a rule around it or a fill behind it would read as a card, which is
            the thing this band exists not to be.

            Rules top and bottom in `hair-dark` rather than a box: on a moving
            picture a bordered panel is a hole cut in the footage, and two
            hairlines are a masthead. */}
        <HeroBeat delay={heroBeat.facts} className="w-full">
          <dl className="mx-auto mt-[var(--hero-air-lg)] grid w-full max-w-[34rem] grid-cols-3 items-start gap-x-3 border-y border-hair-dark py-[var(--hero-air-sm)] sm:gap-x-6 md:max-w-[40rem] md:gap-x-8 lg:max-w-[42rem]">
            {facts.map((k) => {
              const lead = k === "classes";
              return (
                <div
                  key={k}
                  className="flex flex-col items-center gap-[var(--hero-air-xs)]"
                >
                  <dt
                    className={`display text-[1.75rem] leading-none md:text-[2.125rem] ${
                      lead ? "text-bronze-hi" : "text-ivory"
                    }`}
                  >
                    {t(`facts.${k}.value`)}
                  </dt>
                  {/* `fact-label` is a rule in globals.css, not three utilities
                      here, and it has to be: `.label` is declared unlayered and
                      every Tailwind utility lives inside `@layer utilities`, so a
                      tracking or size class written on a `.label` element is
                      discarded before source order is even considered. At 320px
                      a column of this row is 82px and "EXPERIENCE" is 86 at the
                      house tracking, which is the whole reason the rule exists. */}
                  <dd
                    className={`label fact-label min-h-[2.9em] text-balance leading-[1.45] md:min-h-0 ${
                      lead ? "text-ivory" : "text-mute-dark"
                    }`}
                  >
                    {t(`facts.${k}.label`)}
                  </dd>
                </div>
              );
            })}
          </dl>

          {/* THE NOTE THE THIRD FIGURE USED TO CARRY IS NOT HERE ANY MORE.
              `hero.classesNote` set a second paragraph under the band to say
              what "3-4" means, and it was the fourth block of prose on a screen
              that has three seconds to say four things. The label under the
              figure already reads "allieve per corso", which is the fact; why
              the number is small is the argument the room makes at act 05, at
              length and beside a photograph of it happening. The string stays in
              all four catalogues.

              The band is now the last thing before the action, which is the
              order this screen wanted: the claim, the line under it, the three
              marks behind it, then the one thing to press. */}
        </HeroBeat>

        {/* THE ACTION, SINGULAR, AND THAT IS THE CHANGE.

            The screen used to carry two: the catalogue as a filled button and
            "conosci Amira" as a text link beside it. The link went to /about,
            and the act directly under this screen is the founder, with her
            portrait, her statement, her bio and a "leggi la sua storia" link of
            its own. So the second action on the first screen was an invitation
            to skip to a page that says what the next scroll says anyway, placed
            next to the one control this screen exists to get pressed. Two asks
            in the same eyeline is one ask weakened, and the weakened one was the
            catalogue.

            The catalogue is what stays, because it is what a visitor who is
            already interested wants and because it is the primary of the two
            actions the whole site is allowed to ask for (`cta.courses` and
            `cta.consultation`, see the note at PAGE_KEYS in courses.test.ts).
            The consultation is the closing ask, and the fixed bar above md and
            the standing bar on a phone carry it from here to the foot of the
            page, so a reader who is ready before she reaches the end never has
            to hunt for it.

            It is the light-ground button: on the film an espresso button is a
            hole cut in the footage, and `ui.ts` has carried the ivory pair for
            the dark sections since before this screen needed it.

            Full width on a phone, where a 230px button floated against the edge
            of a 390px screen reads as an afterthought; from sm it sets to its
            own width on the composition's centre line, which is where a single
            action belongs and where a pair could never sit. */}
        <HeroBeat delay={heroBeat.actions} className="w-full">
          <div className="mt-[var(--hero-air-lg)] flex justify-center">
            {/* The one control on the first screen that leans. Spending the
                gesture once, on the primary, is what keeps it a detail rather
                than a behaviour every button on the site performs. */}
            <Magnetic className="w-full sm:w-auto">
              <Link
                href="/courses"
                className={`${btnSolidLight} hero-cta w-full sm:w-auto`}
              >
                {c("courses")}
              </Link>
            </Magnetic>
          </div>
        </HeroBeat>
      </HeroCopy>
    </section>
  );
}
