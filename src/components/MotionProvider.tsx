"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * One place where the site's motion policy is set, and the fix for a hydration
 * mismatch that used to hit every visitor who prefers reduced motion.
 *
 * THE BUG. Eight components asked `useReducedMotion()` during render and chose
 * their markup from the answer: `initial={reduce ? false : {...}}`, or in
 * FrameReveal, PageTransition and Manifesto a different element altogether. That
 * question has no answer on a server. There is no matchMedia in Node, so the
 * server always rendered the full-motion branch, and a client that prefers
 * reduced motion rendered the other one. React found two different trees, logged
 * "Hydration failed because the server rendered HTML didn't match the client",
 * and threw away the server markup for the whole page to re-render it. A visitor
 * who had asked for less work got the most: the entire homepage rebuilt on the
 * client on every load.
 *
 * It cannot be fixed by making the components agree with the server, because the
 * preference is only knowable in the browser. Anything that reads it during the
 * first render is either wrong on the server or wrong on the client.
 *
 * THE FIX. Nothing reads the preference during render any more. Motion is told
 * the policy once, here, and applies it at the point where it actually matters:
 * `reducedMotion="user"` makes it check the media query when an animation
 * starts, and give positional values (every transform, plus width, height and
 * the inset properties) a transition of `{type: false}` so they arrive at their
 * target instantly. Opacity and colour still animate, which is the accessible
 * outcome rather than a compromise: what a reduced-motion preference asks to be
 * rid of is movement, and a fade is not movement. Content is never left
 * mid-transform or invisible.
 *
 * The important part for hydration is *when* Motion reads it. `shouldReduceMotion`
 * is resolved in the visual element's `mount()`, which runs in an effect after
 * hydration, and it is consulted only when starting an animation. It has no part
 * in building the initial render styles. So the server and the first client
 * render emit identical markup for every visitor, whatever their preference, and
 * there is nothing left to mismatch.
 *
 * WHAT THIS DOES NOT COVER. Motion values bound straight to `style` are not
 * animations: the scroll-linked drift in Parallax and HeroPortrait, and the word
 * colour in Manifesto, are values Motion writes as inline styles every frame,
 * and no animation is ever started for them. `reducedMotion` cannot see them.
 * Those are switched off in globals.css instead, by the `.drift` and
 * `.word-resolve` rules inside the `prefers-reduced-motion` block, where an
 * author `!important` declaration outranks an inline style. That is the correct
 * layer for them: it is the browser's own media query, evaluated before the
 * first paint, so there is no frame of movement and no JavaScript involved.
 *
 * Between the two, every animation and every scroll-linked transform on the site
 * is accounted for, and no component branches on the preference while rendering.
 *
 * MediaFrame still calls `useReducedMotion()` and should keep doing so. It uses
 * the answer in an effect, to decide whether to download a video at all, which
 * is a decision no CSS rule and no animation policy can make. An effect runs
 * after hydration, so it cannot mismatch.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
