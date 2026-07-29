"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
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
 * Under prefers-reduced-motion the whole statement is simply set in espresso.
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
    <motion.span style={{ color }} className="me-[0.22em] inline-block">
      {children}
    </motion.span>
  );
}

export function Manifesto() {
  const t = useTranslations("manifesto");
  const reduce = useReducedMotion();
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
            <p
              key={li}
              className={`${displayManifesto} ${li > 0 ? "mt-[0.35em]" : ""} ${
                reduce ? "text-espresso" : ""
              }`}
            >
              {words.map((word) => {
                const i = cursor++;
                return reduce ? (
                  <span key={`${li}-${i}`} className="me-[0.22em] inline-block">
                    {word}
                  </span>
                ) : (
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

        <p className="mt-16 max-w-[52ch] text-[17px] leading-relaxed text-mute md:mt-24">
          {t("note")}
        </p>
      </div>
    </section>
  );
}
