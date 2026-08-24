"use client";

import { Fragment, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { displayManifesto, shell } from "@/lib/ui";

/**
 * The statement, revealed by reading position.
 *
 * Each word resolves from taupe to espresso as the section crosses the
 * viewport, so the sentence arrives at the pace it is read rather than all at
 * once. Colour is driven by a motion value per word, which never touches React
 * state: nothing re-renders while scrolling.
 *
 * Under prefers-reduced-motion the whole statement is simply set in espresso,
 * which is a legibility floor and not a nicety: taupe on ivory is 2.3:1, so a
 * reader whose words never resolve is left with a headline that does not meet
 * contrast at any size. It is done in globals.css, by a `.word-resolve` rule in
 * the `prefers-reduced-motion` block, because the colour is a scroll-bound motion
 * value written to the inline style and MotionProvider's animation policy cannot
 * see it. Doing it here instead meant rendering a different element per word than
 * the server did, which was a hydration mismatch multiplied by the word count.
 *
 * The statement is now the whole of the section. A line of small print used to
 * follow it, `manifesto.note`: "Small classes. Guided practice. Professional
 * standards that continue after the course." Every one of those three is stated
 * again further down the page, with a reason attached and at length: small
 * classes and the support after the course are two of the three claims in act
 * 06, and guided practice is a chapter of the method in act 02. Three benefits
 * asserted as a list, four sections before the same three are argued, is the
 * page telling a reader something and then telling her again — and it was
 * sitting directly under the sentence that says this school does not sell a
 * checklist. The key stays in all four catalogues, unused, so restoring it is
 * one line if the academy wants it back.
 */
function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const color = useTransform(progress, range, ["#b6a79c", "#211916"]);
  return (
    <motion.span style={{ color }} className="word-resolve inline-block">
      {children}
    </motion.span>
  );
}

export function Manifesto() {
  const t = useTranslations("manifesto");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.55"],
  });

  const lines = [t("one"), t("two")].map((line) => line.split(" "));
  const total = lines.flat().length;
  let cursor = 0;

  /*
   * The head is 64px rather than the house 112, and it is half of a pair:
   * the signature above closes on 48, so the gap between her name and the
   * sentence she is saying is 112 across the ground change instead of 224.
   * The full reasoning is on the section in `Signature`. The tail is the
   * house rhythm untouched, because what follows *is* a new act.
   */
  return (
    <section className="pt-10 pb-16 md:pt-12 md:pb-20 lg:pt-16 lg:pb-28 bg-ivory">
      <div className={shell}>
        {/* THE MEASURE BELONGS ON THE LINE, NOT ON THE BLOCK AROUND IT, and
            getting that wrong here cost the homepage a screen and a half.

            `ch` is the width of the font's own "0", resolved against the element
            that carries it. On this wrapper, which inherits the 16px body face,
            `max-w-[24ch]` is about 230px — so the statement was set at 100px in
            a 230px column, one word per line, and the section stood 2130px tall
            with a 230px ribbon of type down the inline edge of it. That is the
            large empty area a reader met immediately after the hero: not a
            spacing bug and not an animation, a measure resolved against the
            wrong font.

            On the `p`, the same 24ch is 24 characters of Cormorant at display
            size, which is what was meant. It is the identical mistake the method
            section documents fixing, in the identical form; if a third one turns
            up, look for a `ch` on anything that is not the type it is measuring. */}
        <div ref={ref}>
          {lines.map((words, li) => (
            <p
              key={li}
              className={`${displayManifesto} max-w-[24ch] ${li > 0 ? "mt-[0.35em]" : ""}`}
            >
              {/* The space between two words is a real space in the document,
                  not a margin on the box.

                  It used to be `me-[0.22em]` on every word span and no
                  whitespace at all between them, which looks identical and is
                  not the same thing. A margin is invisible to everything that
                  reads the document rather than paints it: copy the manifesto
                  and you get "l'occhio,la mano"; a screen reader announces the
                  two words run together; the crawler indexes them as one token.
                  The words are inline-blocks, so an ordinary space between them
                  collapses to exactly one space and sets the same gap the margin
                  was faking. */}
              {words.map((word, wi) => {
                const i = cursor++;
                return (
                  <Fragment key={`${li}-${i}`}>
                    {wi > 0 ? " " : null}
                    <Word
                      progress={scrollYProgress}
                      range={[i / total, (i + 1.6) / total]}
                    >
                      {word}
                    </Word>
                  </Fragment>
                );
              })}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
