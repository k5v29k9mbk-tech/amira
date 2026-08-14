"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { dist, dur, ease } from "@/lib/motion";

/**
 * Scroll-reveal. Motivated: sequences content so the eye lands top-down, once.
 *
 * The plainest reveal in the system, and still the right one for a paragraph, a
 * list row or a definition list. An aperture there would be four apertures in a
 * column and would read as machinery: masking is spent on headings and
 * photographs, where it is an event, and withheld from the body copy that
 * supports them. Timing and travel come from lib/motion.ts rather than from
 * numbers typed here, so this moves in the same language as everything else.
 *
 * No reduced-motion branch. It used to render `initial={reduce ? false : {...}}`,
 * which is a question with no answer on the server and was half of a page-wide
 * hydration mismatch. The policy is set once in MotionProvider: under a reduced
 * -motion preference the `y` arrives instantly and only the fade plays. See the
 * note there.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  id,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
  /** Anchor target, for rows the nav or an in-page link points at. */
  id?: string;
}) {
  const Tag = motion[as];

  return (
    <Tag
      id={id}
      className={className}
      initial={{ opacity: 0, y: dist.text }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: dur.base, delay, ease: ease.soft }}
    >
      {children}
    </Tag>
  );
}
