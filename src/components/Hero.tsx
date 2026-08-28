import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { btnLineLight, btnSolidLight, displayHero, shell } from "@/lib/ui";
import { dur, heroBeat, stagger } from "@/lib/motion";
import { brand } from "@/lib/studio";
import { HeroFilm } from "./HeroFilm";
import { HeroBeat, HeroCopy } from "./HeroChoreography";
import { MaskReveal } from "./MaskReveal";
import { Magnetic } from "./Magnetic";

/**
 * THE FIRST SCREEN: the academy's film, full bleed, with the title card set
 * over it.
 *
 * WHAT THIS SCREEN IS FOR, IN ONE SENTENCE. A visitor has about three seconds
 * here, and in those three seconds she has to learn four things: that this is
 * AURA ACADEMY, that it is a professional PMU academy, that Amira Bechini
 * founded it, and that what it sells is education rather than treatments. The
 * order of the column below is that list, set as a hierarchy:
 *
 *   brand      the academy's name, as a masthead
 *   statement  the claim, and the only Didone on the screen
 *   support    what the academy actually is, in one line
 *   action     the two things to do about it
 *   proof      the three marks the academy can stand behind
 *
 * THE BRAND USED TO BE A CAPTION. The line above the statement was
 * `hero.eyebrow`, "Aura Academy · Formazione professionale PMU · Italia", set
 * at label size: eleven pixels of small caps carrying the academy's name, its
 * category and its country in one middot-joined string. It was the correct
 * amount of information and the wrong amount of presence. A house whose name is
 * the smallest type on its own opening screen is a house that reads as a
 * personal page rather than as a school, and the name was competing for those
 * eleven pixels with two other facts.
 *
 * So the name is now a wordmark of its own and the byline under it is the
 * founder's credit, which is the hierarchy the academy asked for: the brand
 * first, the person who made it second, and neither of them anywhere near the
 * size of the statement. The category and the country did not survive the split
 * and did not need to: "Formazione professionale PMU" opens the supporting line
 * two beats later, and the country is in the footer, the schema and the contact
 * page. `hero.eyebrow` stays in all four catalogues, unread, because it is one
 * line of JSX away if the academy wants the bar back.
 *
 * THE LOCKUP IS LATIN IN EVERY LANGUAGE, and it is built from `lib/studio.ts`
 * rather than from the message catalogues. That is the point of it: `brand.short`
 * and `brand.founder` are the academy's registered name and the founder's name,
 * they are checked against the client's own document by the test suite, and a
 * brand that spells itself differently in Arabic than it does in Italian is four
 * brands. Nothing here is a translation, so nothing here can drift.
 *
 * RESTORED, NOT REDESIGNED, and that is still true of everything under the
 * lockup. This is the composition the site carried until `929d7d0` put a studio
 * portrait on an ivory split in its place: the same centred column, the same
 * apertures on the type that carries the argument, the same figure band under
 * two hairlines, the same light-ground button, and `HeroFilm` behind all of it.
 *
 * THE GROUND IS ESPRESSO AND THE TYPE IS IVORY, which is the whole reason the
 * scrim in `HeroFilm` exists: four layers of the brand's own near-black, pooled
 * in the middle of the frame where the words are and released at the corners, so
 * the darkness is concentrated where the reading happens and the picture stays a
 * picture everywhere else. It is unchanged, byte for byte, and it is what keeps
 * white type legible over a moving image without flattening the image into a
 * grey rectangle.
 *
 * THE COMPOSITION IS CENTRED AND IT CANNOT SPEND WHATEVER HEIGHT IT LIKES. The
 * section is the full small viewport, but the fixed bar owns the top of it, so
 * the padding clears it and the centring happens inside the padding box rather
 * than the border box. Every gap in the column is one of the five `--hero-air-*`
 * steps declared on `.hero` in globals.css, read in the order that file
 * documents them:
 *
 *   xs  wordmark to byline, a pair that reads as one object
 *   lg  lockup to statement, the first real break
 *   md  statement to supporting line, two blocks of one argument
 *   lg  supporting line to actions, two movements
 *   xl  actions to proof, the editorial break that closes the frame
 *
 * A centred hero grows past the fold in both directions at once, so the
 * intervals are clamped against viewport height rather than set, and the ratios
 * between them hold at every screen because they are struck from one figure.
 *
 * THE REVEAL IS SPLIT, ON PURPOSE. The lockup and the two lines of the statement
 * open through apertures; the supporting line, the actions and the figures fade
 * up. An aperture is the expensive-looking reveal, and used six times on one
 * screen it stops being an event, so it is spent on the brand and on the type
 * that carries the argument, and withheld from the type that supports it. The
 * intervals are `heroBeat` in lib/motion.ts rather than numbers typed here,
 * because the only thing that makes a sequence read as choreography is the
 * spacing between its beats, and that cannot be tuned when it is scattered
 * across two components.
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
        {/* THE LOCKUP. Two lines, two apertures, one beat apart.
        
            `dir="ltr"` is not decoration. Both lines are Latin in all four
            languages, and `.hero-brand` re-centres its tracked word with a
            start-relative `text-indent`; on the Arabic route the document is
            RTL, so without this the indent would be applied to the same side the
            trailing letter-space is already on and the wordmark would sit off
            its own centre line by a full em. Centring is unaffected either way,
            because the column above is `text-center` and both lines are one
            unbroken Latin run.

            The byline is bronze and the wordmark is ivory, which is the whole of
            the hierarchy between them. Bronze is the site's metal and it is
            spent at hairline weight; here it does the job the old eyebrow's
            bronze did, marking the line as a credit rather than as a second
            piece of the name. Two quiet differences, a size and a tone, read as
            subordinate. A rule between them would read as a device. */}
        <div dir="ltr">
          <MaskReveal onMount delay={heroBeat.brand} duration={dur.base} pad="0.24em">
            <span className="hero-brand block text-ivory">{brand.short}</span>
          </MaskReveal>

          <div className="mt-[var(--hero-air-xs)]">
            <MaskReveal onMount delay={heroBeat.byline} duration={dur.base} pad="0.24em">
              <span className="hero-byline block text-bronze-hi">by {brand.founder}</span>
            </MaskReveal>
          </div>
        </div>

        {/* THE STATEMENT. Two blocks, two apertures, one beat apart.

            It is set as the two lines the academy wrote separately, so nothing
            is split by code and nothing can split differently in Italian,
            French or Arabic.

            SENTENCE CASE, AND THAT IS A DECISION. The brief writes these two
            lines in capitals, as it writes every string in it, including the
            ones that land on `.label` controls that uppercase themselves. Set
            in caps at this size Cormorant is a different typeface: it is a
            Didone drawn for the lowercase, its capitals are wide and its
            contrast is highest exactly where a two-line campaign statement
            needs weight, and every other display line on this site, on every
            other route, is sentence case. Capitalising this one would not be a
            refinement of the identity, it would be a second identity on the
            screen that introduces it. The words are the academy's, verbatim;
            the case is the house's.

            THE MEASURE IS THREE STEPS, NOT ONE, and it grew. The old pair were
            short enough to sit inside 15ch on a laptop; "Non seguire lo
            standard." is twenty-four characters and "Don't follow the
            standard." is twenty-six, and inside the old cap both of them broke
            into two lines each, which is four display lines and a title card
            that has turned into a paragraph. 26ch at the largest step is about
            1030px on a 1440 laptop against 1312 of gutter-to-gutter, so each
            sentence holds its own line where there is room for it, and
            `text-balance` sets two even lines rather than a long one and an
            orphan where there is not. */}
        <h1
          className={`${displayHero} hero-statement mt-[var(--hero-air-lg)] max-w-[20ch] text-balance sm:max-w-[24ch] lg:max-w-[26ch]`}
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
            a phone against the statement's 20, so it sits visibly inside it and
            reads as subordinate; the grade is 80% ivory, which still clears AA
            over the pool the scrim puts exactly here, and is the difference
            between two things shouting and one speaking.

            It is also where the category went when the eyebrow was split into a
            lockup: this line opens on "Formazione professionale PMU" in every
            language, so the one fact the old bar carried that the new one does
            not is stated two beats later, in prose, at the point a reader is
            actually reading rather than scanning. 54ch at lg because the French
            runs to a hundred and sixteen characters and the old 50 put it on
            three lines against the Italian's two. */}
        <HeroBeat delay={heroBeat.sub}>
          <p className="mx-auto mt-[var(--hero-air-md)] max-w-[34ch] text-balance text-[16px] leading-[1.75] text-ivory/80 sm:max-w-[46ch] md:text-[17px] lg:max-w-[54ch]">
            {t("sub")}
          </p>
        </HeroBeat>

        {/* THE ACTIONS, AND THERE ARE TWO OF THEM AGAIN.

            The screen carried two, then one, and the one it kept was
            `cta.consultation`, to /contact, on the argument that the first
            screen should ask for exactly what the header, the standing bar and
            every closing frame ask for. That argument was right about
            consistency and wrong about what an opening screen is for. A visitor
            three seconds into a site she has never seen is not ready to book an
            appointment with a stranger; she is ready to find out what is being
            taught and who is teaching it. Asking for the booking here spent the
            screen's one action on the last step of the funnel.

            So the pair is back, and it is the pair the academy asked for: the
            catalogue first, her story second. Neither of them is a new ask.
            `cta.courses` is the same label the catalogue is opened with from
            /about and from the 404, and it is one of the four verbs the whole
            site is allowed to use; `hero.discoverAura` is the hero's own, and it
            points at the same /about the header's "Amira" points at.

            THE BOOKING IS NOT LOST FOR IT, which is the only real objection. It
            is in the bar directly above this on every screen at every width, in
            the phone menu, in the standing bar from the moment the hero is
            behind the reader, and in the closing frame of this page and of every
            course page. What it no longer does is stand as the first thing a
            visitor is asked for.

            Solid ivory for the catalogue and a hairline for her story: on the
            film an espresso button is a hole cut in the footage, and `ui.ts` has
            carried the light pair for the dark sections since before this screen
            needed it. One filled shape and one outline is what makes a pair read
            as primary and secondary rather than as two buttons.

            Stacked and full width on a phone, where a 230px button floated
            against the edge of a 390px screen reads as an afterthought and two
            of them side by side do not fit; from sm they set to their own widths
            on the composition's centre line.

            The lean is spent once, on the primary. That is what keeps it a
            detail rather than a behaviour every button on the site performs. */}
        <HeroBeat delay={heroBeat.actions} className="w-full">
          <div className="mt-[var(--hero-air-lg)] flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Magnetic className="w-full sm:w-auto">
              <Link
                href="/courses"
                className={`${btnSolidLight} hero-cta w-full sm:w-auto`}
              >
                {c("courses")}
              </Link>
            </Magnetic>

            <Link
              href="/about"
              className={`${btnLineLight} hero-cta w-full sm:w-auto`}
            >
              {t("discoverAura")}
            </Link>
          </div>
        </HeroBeat>

        {/* THE FIGURE BAND, and it now closes the screen rather than sitting in
            the middle of it.

            It used to stand between the supporting line and the action, on the
            argument that a reader should meet the proof before she is asked for
            anything. Under a two-action pair that is the wrong order: the band
            is a rule with three numbers in it, and putting it between the claim
            and the buttons pushed the buttons a movement further down a screen
            that is already competing for height on a phone. Below the actions it
            is what it actually is, the evidence the screen closes on, and the
            hierarchy reads brand, statement, description, action, proof.

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
          <dl className="mx-auto mt-[var(--hero-air-xl)] grid w-full max-w-[34rem] grid-cols-3 items-start gap-x-3 border-y border-hair-dark py-[var(--hero-air-sm)] sm:gap-x-6 md:max-w-[40rem] md:gap-x-8 lg:max-w-[42rem]">
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
        </HeroBeat>
      </HeroCopy>
    </section>
  );
}
