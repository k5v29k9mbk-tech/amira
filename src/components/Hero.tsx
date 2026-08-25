import { getTranslations } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import {
  arrow,
  btnSolidLight,
  displayHero,
  linkRuleLight,
  shell,
} from "@/lib/ui";
import { dur, heroBeat, stagger } from "@/lib/motion";
import { whatsappLinkWith } from "@/lib/studio";
import { HeroFilm } from "./HeroFilm";
import { HeroBeat, HeroCopy } from "./HeroChoreography";
import { MaskReveal } from "./MaskReveal";
import { Magnetic } from "./Magnetic";

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
 * What replaces the plate is her name — not on this screen, but immediately
 * under it. A campaign is signed rather than illustrated, and the signature is
 * now the section directly below the hero (`Signature`), on the same espresso
 * ground: the film stops, the ground stays, and her name stands on a plain
 * field with nothing else in it. Everything about how it is set is unchanged,
 * only where. The reasoning is at the foot of this composition, where it used
 * to be.
 *
 * THE AXIS. One centred column, optically centred in the screen: the bar, the
 * statement, the promise, the evidence, then the two actions. Same six pieces in
 * the same reading order at every width, hung on the middle of the frame instead
 * of on the inline margin.
 *
 * This screen was built asymmetric — statement on columns 1 to 7, signature
 * alone on 9 to 12, everything bottom aligned — and the reasoning for that was
 * sound while the ground was a dark treatment room: the eye met the frame first
 * and the type second, and the scrim could be heavy down one side and eight
 * percent everywhere else. The footage is now the academy's own classroom, which
 * is lit, busy across its whole width, and half white flipchart. There is no
 * quiet side left to hang type on, and an off-centre statement over a frame with
 * no quiet side reads as type that missed rather than type that was placed.
 *
 * Centred, the composition has a single axis and the scrim can be built to it:
 * `HeroFilm` pools its darkness in the middle where the words are and releases
 * the corners and the top of the frame, so the film stays film exactly where
 * nothing is set over it. Symmetry is also the cheapest luxury there is — it is
 * how a title card is set, and a title card is what this screen is.
 *
 * The one thing centring must not become is a template hero, and the guards
 * against that are the measure and the vertical placement. The statement is held
 * to 15ch, so it breaks into three short lines the way a title is set and never
 * runs the width of a laptop; the supporting line is held to 46ch under it; and
 * the whole block is centred against a section that carries the header's height
 * at the top and the scroll cue's at the foot, so it sits on the optical centre
 * rather than the arithmetic one.
 *
 * 100svh, not 100vh: the small viewport unit is the one that does not jump when
 * the mobile address bar collapses. It is a floor rather than a cap, so a long
 * translation lengthens the section instead of overflowing it.
 */
export async function Hero() {
  const t = await getTranslations("hero");
  const c = await getTranslations("cta");
  const contact = await getTranslations("contact");
  const talk = whatsappLinkWith(contact("whatsappMessage"));

  /* Centred on both axes, and the two paddings are neither equal nor fixed.
     The section is the full small viewport but it does not own all of it: the
     fixed header sits on the top 68px and the scroll cue on the bottom 56, and
     centring inside the padding box rather than the border box is what puts
     the composition on the middle of what a reader can actually see.

     Both are clamped against vh rather than set, and every gap inside the
     composition is clamped the same way. A centred hero is the one layout that
     cannot spend whatever vertical space it likes: bottom-aligned, a tall
     composition simply started higher, but centred it grows past the fold in
     both directions at once, and what fell off the bottom of a 720px laptop was
     the signature — which is what eventually took the signature off this screen
     altogether. The floors are what the composition needs at 720 and the
     ceilings are what it should have at 1080. */
  return (
    <section className="hero relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-espresso text-ivory pt-[clamp(96px,12vh,112px)] pb-[clamp(56px,7vh,88px)]">
      <HeroFilm />

      {/* The opening score.

          The beats and their intervals are `heroBeat` in lib/motion.ts, not
          numbers typed here, because the only thing that makes a sequence read
          as choreography rather than as things appearing is the interval
          between beats, and that cannot be tuned when it is spread across two
          components. The order is the bar, the statement line by line, the
          supporting line, the figures, then the two actions. The last two beats
          in the score, `name` and `role`, belong to the signature and are no
          longer played here: it is a section of its own below the fold, so it
          arrives on scroll rather than on a delay measured from the opening.

          `HeroCopy` wraps the whole composition rather than one part of it, so
          the cue that holds the screen until any opening film has finished is
          read once and handed to every beat. Two blocks polling the same event
          is how a sequence acquires a stutter nobody can find later.

          The bar and the two lines of the statement open through apertures; the
          supporting line, the figures and the actions fade up. That split is the
          point. An aperture is the expensive-looking reveal, and used six times
          on one screen it stops being an event, so it is spent on the type that
          carries the argument and withheld from the type that supports it. */}
      <HeroCopy className={`${shell} flex w-full flex-col items-center text-center`}>
        {/* Three facts, one line: the academy, what it does, where. Wraps
            to two lines on a phone, so it carries its own leading. */}
        {/* `text-balance` is the whole of the change here and it is worth a
            line. The eyebrow is three facts joined by middots and it is longer
            than a phone line at every width below about 640, so it always wrapped
            — the question was only where. Left to the browser it broke wherever
            the last word stopped fitting, which at 430 put "· ITALY" alone on a
            second line under a full first one. A label set as one long line and
            one orphan reads as type that overflowed; the same words balanced
            across two even lines read as a bar that was set. */}
        <MaskReveal onMount delay={heroBeat.bar} duration={dur.base}>
          <p className="label text-balance leading-[1.7] text-bronze-hi">{t("eyebrow")}</p>
        </MaskReveal>

        {/* The measure is lifted below sm. 15ch of Cormorant at the floor
            size is about 330px, and a 390px phone has 342 of gutter to
            gutter: the cap was throwing "carriera." and "carrière." onto a
            third line to save nothing. Above sm it is the reading measure
            again, which is what keeps the statement from running the width
            of a laptop, and it matters more centred than it did against the
            margin: a centred line that runs long has two ragged ends instead
            of one, and the eye has to hunt for the start of the next line.

            Two blocks, two apertures, one beat apart. The statement was
            already set as two lines the academy wrote separately, which is
            what makes line masking possible here without measuring anything:
            nothing is split by code, so nothing can split differently in
            Italian, French or Arabic. The second line's aperture is a
            `stagger.line` behind the first, which is what makes the headline
            read as typesetting rather than as a block arriving. */}
        <h1
          className={`${displayHero} hero-statement mt-[var(--hero-air-sm)] max-w-[19ch] text-balance sm:max-w-[15ch]`}
        >
          <MaskReveal onMount delay={heroBeat.headline} duration={dur.slow}>
            <span className="block">{t("titleA")}</span>
          </MaskReveal>
          {/* A real space between the two lines, and it is not decorative.
              The statement is two sibling blocks with no whitespace between
              them, so everything that reads the document rather than paints it
              — copy and paste, a screen reader, a crawler, a share preview —
              received "Padroneggia l'arte.Crea la tua carriera." as one token.
              A whitespace-only text node between two block boxes paints
              nothing, so the composition is unchanged and the sentence is a
              sentence again. */}{" "}
          <MaskReveal
            onMount
            delay={heroBeat.headline + stagger.line}
            duration={dur.slow}
          >
            <span className="block">{t("titleB")}</span>
          </MaskReveal>
        </h1>

        {/* The supporting line, and everything about it is a step down from the
            statement above it rather than a smaller version of it.

            THE MEASURE. 34ch on a phone, not 46. At 46 this ran the full gutter
            width on every handset, so it set three long lines directly under a
            two-line headline that is held to 19 characters — two blocks the same
            width, one large and one small, which reads as a headline with a
            paragraph stuck to it. At 34 it is about 280px against the headline's
            342, so it sits visibly inside the statement's measure: narrower,
            indented by its own centring, and unmistakably subordinate. It costs a
            fourth line and buys the hierarchy the whole screen is built on.

            THE GRADE. 75% ivory rather than 85, and 15px rather than 16. Both are
            small and both are the same decision: this line explains the statement
            and must not compete with it. 75% of ivory over the scrim still clears
            AA comfortably — the pool underneath is built for exactly this — and
            it is the difference between two things shouting and one speaking.

            THE AIR. A full step of the rhythm above it (`md`, against the
            statement's `sm` from its eyebrow), because the eyebrow belongs to the
            headline and this does not. */}
        <HeroBeat delay={heroBeat.sub}>
          <p className="mx-auto mt-[var(--hero-air-md)] max-w-[34ch] text-[15px] leading-[1.75] text-ivory/75 sm:max-w-[42ch] sm:text-[16px] md:text-[18px]">
            {t("sub")}
          </p>
        </HeroBeat>

        {/* THE FIGURES ARE NO LONGER ON THIS SCREEN.

            The three marks the academy can prove used to sit here, between the
            supporting line and the actions, under a masthead rule. They are now
            `AuthorityStrip`, the section directly below the signature, where
            there are four of them and a sentence qualifying them.

            The reason is what the hero is for. This screen is a title card: a
            statement, the line that explains it, and one thing to press. A
            statistics table inside a title card is the single most brochure-like
            object a premium site can put on its first screen, and it was also
            the piece paying for it in height, since the composition is centred
            inside `100svh` and everything in it competes for the same fixed
            space. Taking the band out gives the statement, the line and the
            actions room to breathe on a 720px laptop and gives the evidence a
            field of its own two hundred pixels further down, which is where a
            reader looks for evidence anyway: after the claim, not inside it.

            `hero.facts.*` stays in all four catalogues and stays listed in
            `courses.test.ts`. Nothing was deleted, only moved. */}

        {/* The primary action takes the width on a phone. A 230px button
            floated against the edge of a 390px screen is the one element in
            the composition that reads as an afterthought, and it is the only
            thing on the first screen a visitor is meant to press. The
            secondary stays a text link at every width, so the hierarchy
            between the two never becomes two buttons.

            From sm they sit side by side on the axis, button then link, which
            is the one place the composition is not symmetrical about its
            centre: two actions of equal weight either side of the middle would
            be a choice between them, and there is a primary here.

            Both are the light-ground pair. On the film, an espresso button is a
            hole cut in the footage and an espresso rule under a link is
            invisible; the ivory pair is the same two shapes on the other
            ground, and ui.ts has carried it for the dark sections since before
            this screen needed it.

            WHAT THE SECOND ACTION ASKS FOR, AND WHY IT CHANGED. It used to be
            "Prenota il tuo posto", pointing at the contact page, with the header
            carrying the same words in a filled button eight inches above it. So
            the first screen asked a visitor who had been given no reason yet to
            trust the academy to commit twice, and offered the two hardest asks
            on the site before the softest one.

            It is now a conversation. "Parla con Amira" opens WhatsApp with the
            academy's own opening line, which is the smallest thing a reader can
            be asked for, and it is the one action on this screen that is
            answered by a person rather than a page. Booking has not been
            removed from the site; it has been moved to where a reader arrives
            already convinced, which is after the work, the method and the
            questions. Renders only while a number is on file: `whatsappLinkWith`
            returns null otherwise and the second action falls back to the
            contact page rather than to a dead link. */}
        <HeroBeat delay={heroBeat.actions} className="w-full">
          <div className="mt-[var(--hero-air-lg)] flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
            {/* The one control on the first screen a visitor is meant to
                press, and the only one that leans. Spending the gesture once,
                on the primary, is what keeps it a detail rather than a
                behaviour every button on the site performs. */}
            <Magnetic className="w-full sm:w-auto">
              <Link href="/courses" className={`${btnSolidLight} w-full sm:w-auto`}>
                {c("courses")}
              </Link>
            </Magnetic>
            {talk ? (
              <a href={talk} target="_blank" rel="noreferrer" className={linkRuleLight}>
                {c("talk")}
                <ArrowRight size={14} weight="light" className={`flip-x ${arrow}`} />
              </a>
            ) : (
              <Link href="/contact" className={linkRuleLight}>
                {c("requestSeat")}
                <ArrowRight size={14} weight="light" className={`flip-x ${arrow}`} />
              </Link>
            )}
          </div>
        </HeroBeat>

        {/* THE SIGNATURE IS NO LONGER ON THIS SCREEN. Her name used to close
            this column, under the actions, as the last beat of the score. It is
            now a section of its own directly below the hero (`Signature`), on
            the same espresso ground: a title card is signed at its foot, and
            the foot of this one is the section after it rather than the last
            inch of a viewport it has to share with six other pieces of type.

            What that buys the screen is the reason to do it. This composition
            is centred inside `100svh`, so everything in it competes for the
            same fixed height, and the signature was the piece that lost — on a
            720px laptop it sat against the fold, one line above the scroll cue,
            reading as the end of a block of copy rather than as a name on a
            frame. Removing it gives the statement, the figures and the actions
            the height back, and gives the name a field with nothing else in it.

            `heroBeat.name` and `heroBeat.role` are consequently unplayed here.
            They stay in the score, documented, because the beats after the
            actions are the shape of the entrance and not only two numbers this
            file happened to use. */}
      </HeroCopy>

      {/* Scroll cue: a hairline that fills and empties. No word, no icon.
          It sits in the band under the actions, which is the one part of the
          foot of the composition that carries no type at any width above lg —
          and it now points at something, which it did not while her name was
          the next thing down. */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-1/2 hidden h-12 w-px -translate-x-1/2 overflow-hidden bg-ivory/20 lg:block"
      >
        <span className="block h-full w-full origin-top bg-ivory/70 motion-safe:animate-[aura-cue_3s_ease-in-out_infinite]" />
      </span>
    </section>
  );
}
