"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { displayManifesto, sectionPad, shell } from "@/lib/ui";

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
    <motion.span style={{ color }} className="word-resolve me-[0.22em] inline-block">
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

  return (
    <section className={`${sectionPad} bg-ivory`}>
      <div className={shell}>
        <div ref={ref} className="max-w-[24ch]">
          {lines.map((words, li) => (
            <p key={li} className={`${displayManifesto} ${li > 0 ? "mt-[0.35em]" : ""}`}>
              {words.map((word) => {
                const i = cursor++;
                return (
                  <Word
                    key={`${li}-${i}`}
                    progress={scrollYProgress}
                    range={[i / total, (i + 1.6) / total]}
                  >
                    {word}
                  </Word>
                );
              })}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
