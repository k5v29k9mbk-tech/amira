"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Scroll-reveal. Motivated: sequences content so the eye lands top-down, once.
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
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}
