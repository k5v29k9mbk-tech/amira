"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { arrow, shell } from "@/lib/ui";
import { dur, ease } from "@/lib/motion";
import { entryCopy, entryImages } from "@/lib/entry";

/**
 * The first screen: the statement on the academy's ivory, the portrait bleeding
 * off the inline end, the seal where the two meet.
 *
 * THE COMPOSITION IS A BLEED, NOT A COLUMN, and that is the single decision the
 * rest of the file follows from. The portrait is positioned against the section
 * rather than placed in a grid cell, so it runs edge to edge and top to bottom
 * with no gutter on its outer side: it is a photograph the page is cropped
 * against, which is how a campaign sets an image, and a grid column with the
 * shell's 64px gutter beside it would have read as a picture in a layout.
 *
 * `end-0` and `ps-` throughout rather than `right` and `pl-`, so the whole
 * composition mirrors on the Arabic route: the statement takes the start of the
 * line and the portrait the end, in both directions, without a second layout.
 *
 * THE SCORE. The site already has one, in `lib/motion.ts`, written for the
 * homepage film and read by its components; the note there records which beats
 * are live and which are kept for whatever composition wants them next. This is
 * a different composition with a different order — label, statement, date,
 * rule, tagline, actions — so it plays its own beats off the same durations and
 * the same curve rather than borrowing a score written for another screen. The
 * intervals are the ones that file argues for: 0.10-0.12 between two lines that
 * read as one object, more between two blocks.
 *
 * WHAT IT DOES NOT DO is wait for the opening film. That sequence belongs to the
 * academy's landing page and its bootstrap now targets that route; nothing here
 * is gated on it, so the statement is on screen as soon as the document paints.
 */
export function EntryHero() {
  const locale = useLocale();
  const copy = entryCopy(locale);
  const portrait = entryImages.portrait;

  /** One beat of the opening, as a prop spread. Transforms and opacity only. */
  const beat = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: dur.base, delay, ease: ease.soft },
  });

  return (
    <section className="relative isolate overflow-hidden bg-ivory">
      {/*
        THE PORTRAIT, ON THE END HALF, FROM lg.

        It is `absolute` and full height, so it carries the header's 88px as
        well: the reference runs the photograph up behind the masthead, and a
        portrait that started below the bar would read as a panel rather than as
        a bleed. The masthead is transparent at rest over ivory, and the crop
        below keeps her face well inside the frame, so nothing in the bar sits on
        anything that matters.

        THERE IS NO VEIL OVER THE PHOTOGRAPH, AND THERE MUST NOT BE ONE.

        A cream gradient used to sit across the inline-start third of this column
        to soften the join between the text ground and the picture. It was doing
        real damage: at 38% of the column it lay directly over her raised hand,
        her cuff and the near sleeve of the white jacket, fading the subject out
        with the thing that was supposed to be framing her.

        It was also unnecessary from the start, which only became clear on
        inspecting the supplied file. `amira-hero-white-jacket.png` is RGBA and
        is a CUT-OUT: everything around her is alpha zero, not a dark background.
        Sampled across the frame, the pixels to her left read (0,0,0,0) -- fully
        transparent -- so the browser composites her straight onto the section's
        own ivory. The artwork carries its own edge, softer than any CSS gradient
        could be and correct at every viewport, because it is part of the image
        rather than a guess about where the image's subject begins.

        SO THE TRANSITION IS THE ARTWORK'S, and the rule for anyone editing this
        composition is: nothing is ever laid on top of this photograph. A veil
        narrow enough to clear her at one window size does not clear her at
        another -- the picture is `object-fit: cover`, so a taller, narrower
        window crops it horizontally and slides her toward the column's leading
        edge. Measured, a 6% veil that left 10px of clearance at 1440x900 was
        overlapping her cuff by 23px at 1024x900. There is no safe width. There
        is only no veil.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 end-0 hidden w-[43%] lg:block xl:w-[42%]"
      >
        <Image
          src={portrait.src}
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="43vw"
          className="media-fit"
          style={
            {
              "--obj": portrait.focus,
              "--obj-m": portrait.focusMobile,
            } as React.CSSProperties
          }
        />

        {/*
          THE SEAL SITS INSIDE THE PICTURE AND IS PLACED WITH `right`, NOT `end`.

          It used to be a sibling of this column, positioned `end-[3%]` against
          the section, and that was correct in English by coincidence rather than
          by construction. `end` is the LOGICAL edge, so on the Arabic route it
          flips to the left of the page -- but the PHOTOGRAPH does not flip, and
          the layout mirroring had already moved the picture to the left half. So
          the seal landed on the photograph's left edge, which is exactly where
          her raised hand, her cuff and the near sleeve of the white jacket are:
          a bronze disc printed over the subject, on one language only.

          Anchored inside the column and with the physical property, it sits
          against the picture's own right-hand side in both directions -- the
          side the basilica and the empty ground are on, and the side she is not
          on. `right` is the correct property here precisely BECAUSE the image is
          never mirrored: this is a position relative to the artwork, not to the
          reading order.
        */}
        <EntrySeal
          lines={copy.hero.badge}
          className="absolute bottom-[12%] right-[5%] z-20 hidden lg:flex xl:right-[6%]"
        />
      </div>

      <div className={shell}>
        {/*
          THE MEASURE: 57% OF TYPE AGAINST 43% OF PHOTOGRAPH.

          The photograph takes 43% of the screen, which is the share the brief
          asks for and a step down from the 47 it held before. It buys two things
          at once. The type column gains three points of measure, so the longest
          of the four statements sits further from her. And because the column is
          narrower, `object-fit: cover` scales the picture DOWN to fit it, which
          shrinks the vertical crop rather than deepening it: at 1440x900 the
          frame now discards about 100px of a 928px-tall render instead of 187 of
          1015, and every one of those pixels comes back as air above her head.
          The
          statement is set in Cormorant at up to 6.5rem and the longest of the
          four locales is the French tagline; at this measure both of its lines
          hold single lines from 1024 up, which is the test that fixed the
          number.

          76svh BELOW lg, AND THE BRIEF IS WHAT SETS IT. At `100svh` the type
          block owned the whole first screen on a phone and the portrait began
          exactly one pixel below the fold, so a visitor's opening view of a page
          built around Amira contained no Amira at all — the statement ends
          around 61% of the screen and the rest was ivory. At 76 the same block
          is still comfortably centred with air above and below it, and the
          photograph breaks the fold by about a fifth of the viewport: enough
          that she reads as the other half of the composition rather than as
          something further down the page. Nothing above lg changes, where the
          portrait is a bleed on the end half and is on screen from the first
          frame anyway.

          The vertical rhythm is the hero air scale from globals.css, which is
          declared on `.hero` and read by every gap inside it. It is a clamp
          against viewport HEIGHT, which is the axis a first screen actually
          competes for: a fixed scale overflows a 568px handset and looks starved
          on a 932px one.
        */}
        <div className="hero relative z-10 flex min-h-[76svh] flex-col justify-center pt-[calc(76px+var(--hero-air-xl))] pb-[var(--hero-air-xl)] md:pt-[calc(88px+var(--hero-air-xl))] lg:min-h-[92svh] lg:w-[57%]">
          {/*
            THE STATEMENT, IN TWO LINES AND TWO INKS.

            The reference sets the first line in the near-black and the second in
            the brand's bronze, which is the one place on this page colour does
            hierarchical work rather than decorative. `bronze-ink` rather than the
            raw brand bronze: at display size on ivory the raw metal is 3.7:1,
            which clears AA for large text only, and the text-safe derivative is
            5.1:1 and reads as the same metal.

            `hero-statement` carries the tracking and leading the site already
            tuned for two stacked display lines on a phone; the note in
            globals.css argues both numbers.

            Two beats 0.12 apart, which is the interval `lib/motion.ts` names as
            the smallest that still reads as two beats rather than one block.
          */}
          <h1 className="display hero-statement text-[clamp(2.5rem,min(7vw,9vh),5.75rem)] uppercase">
            <motion.span className="block" {...beat(0.06)}>
              {copy.hero.titleTop}
            </motion.span>
            <motion.span className="block text-bronze-ink" {...beat(0.18)}>
              {copy.hero.titleBottom}
            </motion.span>
          </h1>

          {/*
            THE DATE AND THE PLACE, READ FROM THE INFORMATION BAR'S OWN TWO
            STRINGS RATHER THAN COMPOSED HERE.

            This used to build the second line as `{city}, {country}` out of
            `masterclass`, and on the Arabic route that produced two bugs at
            once. The city was stored untranslated as the Latin "Roma", so a
            Latin run inside an Arabic paragraph was reordered by the bidi
            algorithm and the line rendered as "Italy, Roma" -- the two halves
            swapped. And the separator was a Latin comma in a language that has
            its own, which is a rule the site already enforces against the
            message catalogues in `courses.test.ts`.

            Both disappear by not composing the line at all. `info.place.title`
            and `info.date.title` are already written out per locale, already
            carry the right comma and the right numerals in Arabic, and are
            already what the bar at the foot of this page prints -- so the two
            statements of the same fact cannot drift apart either.
          */}
          <motion.p
            className="entry-cap mt-[var(--hero-air-md)] text-[clamp(1rem,1.5vw,1.375rem)] font-normal leading-snug text-espresso [--cap-track:0.14em]"
            {...beat(0.34)}
          >
            <span className="block">{copy.info.date.title}</span>
            <span className="block">{copy.info.place.title}</span>
          </motion.p>

          {/* The gold rule. 88px of hairline bronze, which is the reference's
              one piece of pure ornament and the site's own vocabulary for it:
              hairline weight, brand metal, no other decoration anywhere. */}
          <motion.div
            aria-hidden
            className="mt-[var(--hero-air-md)] h-px w-[88px] origin-[left] bg-bronze rtl:origin-[right]"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: dur.slow, delay: 0.46, ease: ease.aura }}
          />

          <motion.p
            className="entry-cap mt-[var(--hero-air-md)] max-w-[34ch] text-[clamp(1rem,1.35vw,1.1875rem)] font-normal leading-relaxed text-mute [--cap-track:0.1em]"
            {...beat(0.56)}
          >
            {copy.hero.tagline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </motion.p>


          {/*
            THE SUPPORTING SENTENCE, WHERE A LANGUAGE HAS ONE.

            Its own beat, after the tagline's and before the actions', so it
            arrives with the block it belongs to. `--hero-air-sm` is the step the
            air scale reserves for a line that qualifies the one above it, which
            is exactly what this is.
          */}
          {copy.hero.support ? (
            <motion.p
              className="mt-[var(--hero-air-sm)] max-w-[46ch] text-[15px] leading-relaxed text-mute md:text-[16px]"
              {...beat(0.62)}
            >
              {copy.hero.support}
            </motion.p>
          ) : null}

          {/* THE TWO ACTIONS, IN THE SITE'S OWN HIERARCHY: a filled block for the
              commitment, a ruled text link for the look. `flex-wrap` with a
              `gap` rather than a fixed row, because at 320px in French the two
              do not sit side by side and the link belongs under the button
              rather than squeezed beside it. */}
          <motion.div
            className="mt-[var(--hero-air-lg)] flex flex-wrap items-center gap-x-9 gap-y-5"
            {...beat(0.68)}
          >
            <Link
              href="/contact"
              className="label group/btn inline-flex items-center justify-center gap-3 whitespace-nowrap bg-espresso px-9 py-4 text-ivory transition-colors duration-500 ease-[var(--ease-aura)] hover:bg-bronze-ink active:translate-y-px"
            >
              {copy.hero.reserve}
            </Link>

            <Link
              /* THE TWO-DAY PROGRAMME, WHICH IS WHAT THE LABEL SAYS.
                 It used to point at `#courses`, the academy's six-discipline
                 catalogue, which is nine acts further down and is a different
                 question: that section answers "what else do you teach", and a
                 reader who presses "Discover the program" is asking "what
                 happens on these two days". `#programme` is the section that
                 answers it, directly below. */
              href="/#programme"
              className="label group/link relative inline-flex items-center gap-3 py-1 text-espresso transition-colors duration-300 hover:text-bronze-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-[left] after:scale-x-0 after:bg-bronze after:transition-transform after:duration-500 after:ease-[var(--ease-aura)] hover:after:scale-x-100 rtl:after:origin-[right]"
            >
              {copy.hero.discover}
              <ArrowRight size={16} weight="light" className={`flip-x ${arrow}`} aria-hidden />
            </Link>
          </motion.div>
        </div>
      </div>

      {/*
        THE PORTRAIT ON A PHONE, AND WHY IT IS A SECOND ELEMENT RATHER THAN THE
        SAME ONE REFLOWED.

        The desktop portrait is an absolutely positioned bleed on the end half of
        a full-height section. There is no arrangement of that element that also
        works below 1024: the statement needs the whole width, so the photograph
        has to leave the flow entirely and come back underneath it, at an aspect
        ratio a phone can carry without either cropping her out of the frame or
        taking two thirds of the screen.

        Same file, same crop, a different focal point — `focusMobile` is 4% higher
        so the tall narrow crop keeps her face out of the bottom half — and it is
        the only image on the page that is `priority`, because it is the only one
        above the fold at any width. 4:5 is the ratio the reference's crop reads
        at on a handset, and it leaves the statement in possession of the first
        screen with the photograph opening the second.
      */}
      <div className="relative aspect-[4/5] w-full sm:aspect-[3/2] lg:hidden">
        <Image
          src={portrait.src}
          alt={copy.hero.portraitAlt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="media-fit"
          style={
            {
              "--obj": portrait.focus,
              "--obj-m": portrait.focusMobile,
            } as React.CSSProperties
          }
        />
        <EntrySeal lines={copy.hero.badge} className="absolute bottom-6 right-5 flex sm:bottom-8 sm:right-8" />
      </div>

      {/* The seal at desktop, on the seam between the portrait and the ground,
          low in the frame exactly as the reference places it. It is a separate
          instance rather than one shared node for the same reason the portrait
          is: the two live in different stacking contexts and are positioned
          against different boxes. */}

    </section>
  );
}

/**
 * The seal: four tracked lines in a bronze disc.
 *
 * IT IS THE ONE ROUND OBJECT ON THE SITE, and that is a deliberate exception
 * rather than a lapse. `lib/ui.ts` opens with a shape lock — everything is
 * square, radius appears nowhere except 2px on form fields — and the lock is
 * what keeps the system from drifting into an app UI. A seal is not a card, a
 * pill or a badge in that sense: it is the editorial device a campaign uses to
 * stamp a claim onto an image, it is round because a stamp is round, and it is
 * the shape the reference sets. Nothing else on this page or any other takes a
 * radius, so the exception stays legible as one.
 *
 * `--aura-bronze` at full strength with ivory type, which is 4.6:1 and clears AA
 * for the 10-11px it carries. It is the raw brand metal rather than a text-safe
 * derivative because here the bronze is the GROUND and the ivory on it is the
 * type; the derivatives exist for bronze used as ink.
 *
 * `aria-hidden`: all four lines restate what the information bar at the foot of
 * the page states in prose, and a screen reader meeting "2 / days / intensive /
 * hands-on / training" as five separate runs of tracked capitals gets noise
 * rather than the fact. The fact is not lost — it is in `info.date` — so this is
 * decoration over an image, which is exactly what should be hidden.
 */
function EntrySeal({ lines, className = "" }: { lines: readonly string[]; className?: string }) {
  return (
    <div
      aria-hidden
      className={`aspect-square w-[104px] flex-col items-center justify-center rounded-full bg-bronze text-center text-ivory sm:w-[124px] lg:w-[136px] xl:w-[152px] ${className}`}
    >
      <span className="grid gap-[0.2em] px-3">
        {lines.map((line) => (
          <span
            key={line}
            className="entry-cap block text-[0.5rem] leading-tight sm:text-[0.5625rem] lg:text-[0.625rem] xl:text-[0.6875rem]"
          >
            {line}
          </span>
        ))}
      </span>
    </div>
  );
}
