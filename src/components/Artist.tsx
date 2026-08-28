"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { artistMedia } from "@/lib/media";
import { dist, dur, ease, stagger } from "@/lib/motion";
import {
  arrow,
  displayChapter,
  displaySection,
  linkRule,
  sectionPad,
  shell,
} from "@/lib/ui";
import { MediaFrame } from "./MediaFrame";
import { MaskReveal } from "./MaskReveal";
import { Reveal } from "./Reveal";

/**
 * 02 THE ARTIST. The act the rest of the homepage is evidence for.
 *
 * THE SHAPE, AND WHY IT IS TWO PARTS RATHER THAN TWO COLUMNS. The act used to be
 * a single grid: copy on the left, portrait pinned on the right, both on screen
 * from the first pixel of the section to the last. That is a layout, and it was
 * a decent one, but it spends the photograph as furniture beside a paragraph.
 * Nothing about it is an event.
 *
 * It is now a spread and then a plate. The copy reads first, across the full
 * measure, and ends. Then the photograph takes the whole screen on its own for
 * the length of a held beat, and only after that does it fold down into the
 * composition it finishes in, with her name arriving beside it. A reader meets
 * the argument, then the person, then the credit; the picture is the turn
 * between the two rather than an illustration of either.
 *
 * THE SCORE, in one place, measured in the pin's own progress:
 *
 *   entry            the aperture rises from the foot of the plate as it climbs
 *                    into the screen, finishing exactly as the pin takes hold
 *   0.00 - 0.34      the held frame: the plate at 88svh, centred on the screen,
 *                    alone on the ivory, closing in on itself the whole time
 *   0.34 - 0.72      the fold: it scales and travels to its final box on the
 *                    inline end, on the house curve, arriving at rest
 *   0.50             the byline is released on the opposite side and resolves
 *                    over a beat, overlapping the tail of the fold so the two
 *                    read as one movement rather than two
 *   0.72 - 1.00      the finished composition, held, before the act scrolls away
 *
 * EVERY VALUE IS A FUNCTION OF SCROLL POSITION, not an animation fired at a
 * threshold, and that is what makes the whole sequence reversible: scroll back
 * up and the plate unfolds, re-centres and grows again at exactly the rate the
 * wheel turns. There is nothing to replay and no state to get stuck in.
 *
 * THE ONE TRANSFORM THAT MATTERS IS UNIFORM. The plate travels and scales, and
 * the scale is a single number applied to both axes. That is a constraint rather
 * than a simplification. The obvious way to grow a portrait box into a wider one
 * is to scale the axes independently and counter-scale the photograph inside to
 * undo the distortion; it works, but it costs a nested element per axis and it
 * forces the picture's own zoom to whatever number happens to make the crop
 * cover. Holding the plate's 4:5 through the entire move means the photograph is
 * never stretched by a pixel, the crop never changes, and its slow close-in stays
 * an independent value that can be tuned without touching the geometry.
 *
 * THE SIZES ARE BOUNDED BY THE PHOTOGRAPH, not by taste. The file the academy
 * supplied is 1024x1024. At 88svh on a 900px screen the plate renders the image
 * 792px tall, which is 1.29 source pixels per CSS pixel and still sharp. A plate
 * that filled the width instead would render it past 1300 and print about half a
 * source pixel per CSS pixel, which is visibly soft on any retina display. "Near
 * full screen" is therefore full *height*, not full width, which for a standing
 * portrait is the right reading anyway: it is the shape of a cover, and a
 * letterboxed band across a square source would have had to crop her at the
 * chest to fill it. If a larger master ever arrives, `HOLD_VH` is the number to
 * raise.
 *
 * IT BLEEDS UNDER THE BAR, ON PURPOSE. At 88svh the plate's head sits about 54px
 * down a 900px screen and the fixed header is 77px tall, so the top of the frame
 * runs beneath it. The bar takes an opaque ivory ground on the first 16px of
 * scroll, so what a reader sees is the plate running to the trim rather than
 * type floating over a photograph. That is the magazine move, and it is the
 * reason this can be as large as it is. If the bar is ever made transparent
 * again, this has to come down to about 82svh.
 *
 * BELOW LG THERE IS NO PIN AND NO FOLD. The stage is not sticky, the plate is
 * neither scaled nor moved, and the order is the one the act reads in on a
 * phone: the statement, the paragraph, her name, her titles, then the
 * photograph, full width and 4:5. The aperture still opens and the picture still
 * closes in on itself, both at a reduced amplitude, because those are the two
 * that cost nothing on a small screen and read as the picture being alive rather
 * than as the page moving.
 *
 * REDUCED MOTION. Every transform here is a motion value bound to `style` and
 * written each frame, which is the one category `reducedMotion="user"` cannot
 * reach: no animation is ever started, so there is nothing for it to shorten.
 * They are pinned in globals.css instead, by `.drift`, and the layout is arranged
 * so that pinning them lands on the right answer rather than on a broken frame:
 * the plate's untransformed position IS the finished composition, and the
 * aperture's untransformed position is fully open. `.artist-byline` pins the
 * byline in the same block, because although its resolve does go through Motion's
 * animation path, a reader who has asked for no movement should find her name and
 * the link to her story already there rather than fade them in by scrolling. What
 * that reader gets is the settled spread, complete and still, with no JavaScript
 * involved in the decision.
 */

/** The held frame's height, as a share of the small viewport height. */
const HOLD_VH = 0.88;

/** The pin's score. Kept together so the intervals read as a sequence. */
const FOLD_IN = 0.34;
const FOLD_OUT = 0.72;
const BYLINE_IN = 0.5;
const BYLINE_OUT = 0.78;

export type ArtistCopy = {
  /** `sections.amira`, the act's label. */
  label: string;
  /** `instructor.statementA` and `instructor.statementB`, the two masked lines. */
  statementA: string;
  statementB: string;
  /** `instructor.bio`. */
  bio: string;
  /** `instructor.title`, her name. */
  name: string;
  /** `instructor.credit`, her two titles. */
  credit: string;
  /** `about.readStory`, the link to the founder page. */
  readStory: string;
  /** `instructor.portrait`, the photograph's alt text. */
  portrait: string;
};

export function Artist({ copy }: { copy: ArtistCopy }) {
  const track = useRef<HTMLDivElement>(null);
  const cell = useRef<HTMLDivElement>(null);

  /**
   * The geometry of the fold, measured rather than written down.
   *
   * `grow` and `travel` are the two numbers that turn the finished composition
   * into the held frame, and neither can be a constant: the plate's resting
   * height comes from a viewport unit and its resting centre from a twelve
   * column grid inside a capped shell, so both move with the window and with the
   * reading direction. They are read off the plate's own cell, which is a plain
   * grid item and never carries a transform, so its box is the plate's layout box
   * whatever the plate is currently doing to itself.
   *
   * Measured in an effect, for the reason the whole motion layer is arranged
   * around: the server has no viewport, so a width read during render is the
   * hydration mismatch this system exists to avoid. Until it runs, `desktop` is
   * false and every value below is its own identity, which is the finished
   * composition, which is exactly what the server should be sending anyway.
   */
  const [stage, setStage] = useState({ grow: 1, travel: 0, desktop: false });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");

    const measure = () => {
      const el = cell.current;
      if (!el || !mq.matches) {
        setStage({ grow: 1, travel: 0, desktop: false });
        return;
      }
      const box = el.getBoundingClientRect();
      if (!box.height || !box.width) return;
      // The plate is `mx-auto` inside its cell, so the cell's centre is its own.
      const centre = box.left + box.width / 2;
      setStage({
        // Clamped rather than trusted: a very short window can ask for a growth
        // that would push the plate wider than its own screen, and a very tall
        // one can ask for less than nothing to happen.
        grow: Math.min(Math.max((HOLD_VH * window.innerHeight) / box.height, 1), 1.5),
        travel: window.innerWidth / 2 - centre,
        desktop: true,
      });
    };

    measure();
    window.addEventListener("resize", measure);
    mq.addEventListener("change", measure);
    return () => {
      window.removeEventListener("resize", measure);
      mq.removeEventListener("change", measure);
    };
  }, []);

  /**
   * The approach and the pin, read separately.
   *
   * `enter` runs while the plate is still climbing the screen and is what the
   * aperture is keyed to, so the picture is already whole by the time it is
   * held. `pin` runs from the moment the track's head reaches the top of the
   * screen to the moment its foot reaches the bottom, which is precisely the
   * span the stage is stuck for: nought is the first frame of the hold and one
   * is the last frame before the act lets go.
   */
  const { scrollYProgress: enter } = useScroll({
    target: cell,
    offset: ["start end", "start 45%"],
  });
  const { scrollYProgress: pin } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });

  /**
   * The plate's own passage, which is what the picture's life is keyed to on a
   * phone, and the reason there are three readings here rather than two.
   *
   * `pin` is meaningless below lg and worse than meaningless: nothing is stuck,
   * so the track is only as tall as the byline and the photograph inside it,
   * which on a 844px handset is about 690px. A track shorter than the screen
   * makes `["start start", "end end"]` an inverted range, because its foot
   * reaches the bottom of the screen before its head reaches the top, and the
   * progress it reports runs backwards. Measured: the close-in played in reverse
   * the whole way down the phone, the picture shrinking from 351px to 342px
   * instead of growing. It is a small enough number to look like nothing at all
   * rather than like a bug, which is exactly why it is worth a reading of its
   * own.
   *
   * This is the plain full-passage reading every other frame on the site uses,
   * and it cannot invert: the plate always enters the bottom of the screen and
   * leaves the top. It is wrong for the desktop sequence for the opposite
   * reason, which is that the plate is pinned for the middle third of that
   * passage and a reading taken from its own rect stops advancing for exactly as
   * long as the hold lasts.
   */
  const { scrollYProgress: passage } = useScroll({
    target: cell,
    offset: ["start end", "end start"],
  });

  const { grow, travel, desktop } = stage;

  // The aperture: a slot rising over a stationary photograph. The two travel the
  // same distance in opposite directions, so the sums cancel and the picture
  // never moves. What opens is the frame around it.
  const apertureY = useTransform(enter, [0, 1], ["100%", "0%"]);
  const contentY = useTransform(enter, [0, 1], ["-100%", "0%"]);

  // The fold. Identity until the stage has been measured, which is also the
  // whole of the phone's behaviour.
  const plateScale = useTransform(pin, [0, FOLD_IN, FOLD_OUT], [grow, grow, 1]);
  const plateX = useTransform(pin, [0, FOLD_IN, FOLD_OUT], [travel, travel, 0]);

  /*
   * The picture's own life inside the crop, independent of the fold.
   *
   * The close-in runs the whole length of the pin and is the slowest thing in the
   * act: four and a half percent across two and a half screens of scrolling is a
   * rate nobody can name and everybody registers. The drift is a third of it, so
   * the two read as depth rather than as one gesture.
   *
   * The drift has to stay inside the slack the scale opens, at every point and
   * not merely at the ends, or a hairline of ivory appears along one edge of the
   * frame part-way down the page. The overhang grows as 2.25% of progress and the
   * drift as 1.5% of it, so the picture is always a third of the slack clear of
   * its own edge. Raise one and the other has to be checked again.
   */
  const depth = desktop ? 1 : 0.6;
  const life = desktop ? pin : passage;
  const cropScale = useTransform(life, [0, 1], [1, 1 + 0.045 * depth]);
  const cropY = useTransform(life, [0, 1], ["0%", `${1.5 * depth}%`]);

  // The mat, drifting against the plate it surrounds. Small enough that the
  // hairline reads as breathing rather than as a second frame sliding.
  const matY = useTransform(life, [0, 1], desktop ? [-8, 8] : [-3, 3]);

  /**
   * The byline, which does not exist until the plate starts to fold.
   *
   * THIS IS A THRESHOLD AND AN ANIMATION, NOT A SCROLL-LINKED OPACITY, and the
   * reason is that a scroll-linked opacity does not work. It was written that
   * way first, `style={{ opacity }}` fed by a `useTransform` of the pin, and it
   * measured at 1.00 at all eleven scroll positions on the way down: the
   * property keeps whatever was rendered and is never written again. On this
   * very element, from this very scroll value, `y` interpolates correctly and so
   * does the plate's `scale` beside it. Only `opacity` is dropped. It is the same
   * fault `HeroPortrait` documents against the same version of Motion, and the
   * workaround is the one that file already proved: go through the animation
   * path, which works everywhere on this page.
   *
   * So the pin flips one boolean at 0.5 and the block animates to it. The visible
   * result is the same resolve on the site's own curve, it reverses on the way
   * back up because the boolean does, and it costs one re-render per crossing
   * rather than one style write per frame.
   *
   * The phone does not use the threshold at all. There is no pin there, the
   * byline sits above the photograph rather than beside it, and keying it to the
   * track's progress would leave her name blank at the top of the screen until a
   * reader scrolled past it. It watches itself instead, which is what every other
   * block on the site does.
   */
  /**
   * The mat's arrival, which is not the aperture's.
   *
   * The hairline is a sibling of the frame rather than a child of it, because it
   * sits *outside* the photograph's edge and an aperture that clipped it would
   * clip it away. That means it is not revealed by the reveal, and left to itself
   * it is simply drawn the moment the plate enters the screen: an empty
   * rectangle, at full cinematic size, on the ivory, several hundred pixels
   * before there is anything inside it. It reads exactly like an image that
   * failed to load, which is the one thing a photograph's frame must never do.
   *
   * So it fades, on a boolean, through CSS rather than through Motion. Opacity
   * driven by a scroll value is the property this version of Motion silently
   * drops, which the byline above has already had to work around; a class and a
   * transition sidestep the question entirely, and the blanket
   * `transition-duration` override in the reduced-motion block flattens it for
   * free. The threshold is deliberately late: two fifths of the plate on screen,
   * by which point the aperture is well up and the frame draws around a picture
   * rather than around nothing.
   */
  const byline = useRef<HTMLDivElement>(null);
  const plateSeen = useInView(cell, { once: true, amount: 0.4 });
  const [folded, setFolded] = useState(false);
  useMotionValueEvent(pin, "change", (v) => setFolded(v > BYLINE_IN));
  const bylineSeen = useInView(byline, { once: true, amount: 0.3 });
  const bylineShown = desktop ? folded : bylineSeen;

  return (
    <section id="amira" className={`${sectionPad} scroll-mt-20 bg-ivory`}>
      {/* PART ONE, THE SPREAD. The claim and the evidence for it, across the
          full measure and with nothing beside them. The statement takes seven
          columns and the paragraph four, dropped a heading's worth so the two
          read as a spread rather than as a row. It is the arrangement an
          editorial page opens on, and it is what lets the photograph below be an
          event rather than the thing the text happens to sit next to. */}
      <div className={shell}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <TrackedLabel>{copy.label}</TrackedLabel>

            {/* Two keys rather than one sentence, which is the house pattern for
                a display statement (`hero.titleA`/`titleB`) and is what makes a
                line-by-line reveal possible in four languages at once. Splitting
                one translated string on whitespace would mask wherever the
                browser happened to wrap it, which is a different word per
                language, per width and per font. Split by the translator, the
                break falls at the colon in every catalogue.

                The colon is also the house rule: the line was drafted with an em
                dash and the copy tests reject one anywhere in the message files,
                because an em dash in a headline is the one mark that reads as
                machine-written. */}
            <h2 className={`${displaySection} mt-10 max-w-[24ch]`}>
              <MaskReveal pad="0.18em">
                <span className="block">{copy.statementA}</span>
              </MaskReveal>
              <MaskReveal delay={stagger.line} pad="0.18em">
                <span className="block">{copy.statementB}</span>
              </MaskReveal>
            </h2>
          </div>

          {/* A plain fade-up, because an aperture on a paragraph is machinery:
              masking is spent on the headings and the photograph, where it is an
              event, and withheld from the body copy that supports them. */}
          <Reveal className="lg:col-span-4 lg:col-start-9 lg:mt-36">
            <p className="max-w-[46ch] text-[16px] leading-relaxed text-mute md:text-[17px]">
              {copy.bio}
            </p>
          </Reveal>
        </div>
      </div>

      {/* PART TWO, THE PLATE. The track is the scroll the sequence is spent over
          and the stage is what stays on screen while it is spent: at lg the track
          is 220svh, the stage is one screen of it, and the 120 left over is the
          hold and the fold. Below lg the track has no height of its own and
          nothing is stuck; it is the byline and then the photograph, in that
          order. */}
      <div ref={track} className="mt-16 md:mt-20 lg:mt-28 lg:h-[220svh]">
        <div className="lg:sticky lg:top-0 lg:h-svh">
          <div className={`${shell} lg:h-full`}>
            <div className="lg:grid lg:h-full lg:grid-cols-12 lg:items-center lg:gap-16">
              {/* The byline. First in the document on purpose: on a phone this is
                  the order the act is read in, and at lg the grid puts it on the
                  inline start without moving it in the tree. */}
              <motion.div
                ref={byline}
                initial={{ opacity: 0, y: dist.text }}
                animate={{
                  opacity: bylineShown ? 1 : 0,
                  y: bylineShown ? 0 : dist.text,
                }}
                transition={{ duration: dur.base, ease: ease.soft }}
                className="artist-byline lg:col-span-4"
              >
                <div className="border-t border-hair pt-8">
                  <p className={`${displayChapter} leading-none`}>{copy.name}</p>
                  <p className="label mt-4 leading-[1.7] text-bronze-ink">
                    {copy.credit}
                  </p>
                  <Link href="/about" className={`${linkRule} mt-10`}>
                    {copy.readStory}
                    <ArrowRight size={14} weight="light" className={`flip-x ${arrow}`} />
                  </Link>
                </div>
              </motion.div>

              {/* The plate's cell. Never transformed, which is what makes it
                  measurable: the fold's two numbers are read off this box. */}
              <div
                ref={cell}
                data-shown={plateSeen ? "true" : "false"}
                className="mt-12 lg:col-span-6 lg:col-start-7 lg:mt-0"
              >
                <motion.div
                  style={{ x: plateX, scale: plateScale }}
                  className="drift relative mx-auto aspect-[4/5] w-full lg:h-[68svh] lg:w-auto"
                >
                  {/* The mat: a hairline offset outside the frame, on the
                      section's own ground. The site's one piece of furniture for
                      a photograph, and the plane that makes the picture's own
                      drift read as depth rather than as movement. It sits inside
                      the plate, so it grows and travels with it. */}
                  <motion.span
                    aria-hidden
                    style={{ y: matY }}
                    className="artist-mat drift pointer-events-none absolute -inset-x-3 -inset-y-4 border border-hair md:-inset-x-5 md:-inset-y-5"
                  />

                  {/* The static clip, which only keeps the displaced aperture
                      from spilling into the layout while it is out of frame. The
                      `overflow: hidden` that does the revealing is on the
                      aperture below, because it has to be the *moving* element
                      that clips: put it on a static parent instead and the two
                      translates cancel into a photograph sitting exactly where it
                      started inside a clip box that never excluded it. That is a
                      silent no-op, and it is the bug this construction's sibling
                      in `MaskReveal` documents at length. */}
                  <span className="absolute inset-0 block overflow-hidden">
                    <motion.span
                      style={{ y: apertureY }}
                      className="drift block h-full w-full overflow-hidden"
                    >
                      <motion.span
                        style={{ y: contentY }}
                        className="drift block h-full w-full"
                      >
                        <motion.span
                          style={{ scale: cropScale, y: cropY }}
                          className="drift relative block h-full w-full"
                        >
                          {/* Held, the plate is about 634px across on a 900px
                              screen, and the source is 1024 square: the largest
                              cut Next has is the one worth asking for. */}
                          <MediaFrame
                            media={artistMedia}
                            alt={copy.portrait}
                            sizes="(min-width: 1024px) 70vh, 100vw"
                          />
                        </motion.span>
                      </motion.span>
                    </motion.span>
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The section label, with the one animated tracking on the site.
 *
 * The tracking cannot be a Tailwind class and this is not a matter of writing it
 * last. `.label` is declared in globals.css outside any cascade layer and every
 * Tailwind utility lives inside `@layer utilities`; unlayered rules beat layered
 * ones whatever their specificity, so a `tracking-[0.44em]` on a `.label` element
 * is discarded before order is even considered. Anything overriding `.label` has
 * to be a rule in that file with a heavier selector, which is what `.artist-label`
 * and its `[data-shown]` state are.
 *
 * It is a CSS transition rather than a Motion animation on purpose. Letter
 * spacing is not in Motion's positional set, so `reducedMotion="user"` would not
 * shorten it and a reader who asked for no movement would still watch the word
 * close up. As a transition it is caught by the blanket `transition-duration`
 * override in the reduced-motion block, and arrives set.
 *
 * `useInView` on the wrapper rather than `whileInView` on the label: the state
 * has to reach a CSS attribute, not a Motion style, and the boolean flips once.
 */
/**
 * THE LABEL LOST ITS NUMBER, and that is the whole of the change here.
 *
 * This act used to be "02 L'artista", one screen under "01 Lo standard", which
 * made two numbered chapters out of one step of the argument: who Amira is. The
 * two are the same claim in two halves - the standard she works to, then the
 * person who set it - and a reader met her name, her role and her portrait
 * twice in four screens because the page told her twice that a chapter had
 * started.
 *
 * So this half keeps its content and loses its furniture, which is the same
 * move the ladder makes under the method and the included list makes under the
 * path: a plain eyebrow instead of a numbered rule, so the act reads as the
 * continuation of 01 rather than as a chapter beside it. `artist-label` is the
 * tracking animation and is unchanged; it is the number and the rule that go.
 */
function TrackedLabel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });

  return (
    <div ref={ref} data-shown={seen ? "true" : "false"}>
      <p className="label artist-label text-bronze-ink">{children}</p>
    </div>
  );
}
