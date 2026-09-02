"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { introMedia } from "@/lib/media";
import { endIntro, introPending } from "@/lib/intro";
import { Logo } from "./Logo";
import { usePageText } from "@/lib/content/client";

/**
 * Opening sequence.
 *
 * Full-screen, black, muted, once per browser session. It plays over a page
 * that is already rendered underneath, so the transition out is a fade rather
 * than a page load: the film thins away and the homepage is simply there.
 *
 * Three beats. The logo holds the black while the clip loads. The film plays.
 * Then, a beat before it runs out, the film fades back to black and the logo
 * returns to sit there alone for about a second, before logo and black dissolve
 * together over a homepage that is already rising into place underneath.
 *
 * It gates itself. `introPending()` reads the attribute the bootstrap script in
 * the layout set before first paint, which already accounts for the session
 * flag, `prefers-reduced-motion`, the route, and the `?intro=1` override. If it
 * is false this component renders nothing and requests nothing.
 *
 * Nothing here can hold the site hostage. The overlay stands down on `ended`,
 * on a fade cue shortly before the end, on `error`, on a blocked autoplay
 * promise, on Escape, on the skip control, if playback has not started within
 * `startWithinMs`, or if a started clip stalls for `stallMs`. Whichever fires
 * first wins, and each of them runs the same exit.
 *
 * Deliberately not here: a sound toggle. The clip starts muted because every
 * browser demands it, and a control that unmutes a fifteen second film most
 * visitors will skip is a button nobody presses. If the academy wants it, it is
 * a `useState` and a `video.muted = !muted` away.
 */
export function IntroVideo({
  /** Cue the ending this long before the clip runs out, so no last frame shows. */
  fadeLeadMs = 1200,
  /** Crossfade from film to logo. */
  signFadeMs = 600,
  /** How long the logo holds the black on its own. */
  signHoldMs = 1000,
  /** Length of the final fade into the homepage. */
  fadeMs = 1400,
  /** Give up if playback has not begun by now. */
  startWithinMs = 6000,
  /** Give up if a running clip freezes for this long. */
  stallMs = 3500,
}: {
  fadeLeadMs?: number;
  signFadeMs?: number;
  signHoldMs?: number;
  fadeMs?: number;
  startWithinMs?: number;
  stallMs?: number;
} = {}) {
  const t = usePageText("common", "intro");
  const video = useRef<HTMLVideoElement>(null);
  const exited = useRef(false);
  const staged = useRef(false);
  const sign = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Decided once, on mount, so the server and the first client render agree.
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [gone, setGone] = useState(false);
  // The logo holds the black until the first frame of film actually arrives.
  const [rolling, setRolling] = useState(false);
  // "film" while the clip runs, "sign" once the logo has the screen to itself.
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    if (introPending()) setArmed(true);
    else setGone(true);
  }, []);

  /**
   * Leave. Hands the screen back at once (shield down, scroll restored, session
   * remembered, entrance animations released) and lets the overlay fade over
   * the live page for `fadeMs` before unmounting, so the logo dissolves and the
   * homepage resolves in the same movement rather than one after the other.
   *
   * Every failure path calls this directly: there is no reason to hold a title
   * card for a film that never played.
   */
  const exit = useCallback(() => {
    if (exited.current) return;
    exited.current = true;
    clearTimeout(sign.current);
    endIntro();
    setPlaying(false);
  }, []);

  /**
   * The ending proper. The film thins away, the logo comes back up in its
   * place, and the whole thing sits on black for a beat before it goes. Only
   * the clip's own end calls this; skipping is immediate.
   */
  const curtain = useCallback(() => {
    if (staged.current || exited.current) return;
    staged.current = true;
    setEnding(true);
    sign.current = setTimeout(exit, signFadeMs + signHoldMs);
  }, [exit, signFadeMs, signHoldMs]);

  useEffect(() => {
    if (!armed) return;
    const el = video.current;
    if (!el) return;

    let stall: ReturnType<typeof setTimeout> | undefined;
    let last = -1;

    const start = setTimeout(() => {
      if (el.currentTime === 0) exit();
    }, startWithinMs);

    // Watchdog rather than a hard cap: a healthy clip plays to its own end,
    // a frozen one is cut. A cap would truncate the film the academy paid for.
    const watch = () => {
      clearTimeout(stall);
      stall = setTimeout(() => {
        if (el.currentTime === last && !el.ended) exit();
      }, stallMs);
      last = el.currentTime;
    };

    const onTime = () => {
      watch();
      if (el.duration && el.duration - el.currentTime <= fadeLeadMs / 1000) curtain();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && exit();

    const onPlaying = () => setRolling(true);

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("playing", onPlaying);
    el.addEventListener("ended", curtain);
    el.addEventListener("error", exit);
    window.addEventListener("keydown", onKey);

    // A missing or unsupported file rejects here; so does a blocked autoplay.
    // Either way the page is the visitor's within a frame.
    void el.play().catch(exit);

    return () => {
      clearTimeout(start);
      clearTimeout(stall);
      clearTimeout(sign.current);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("playing", onPlaying);
      el.removeEventListener("ended", curtain);
      el.removeEventListener("error", exit);
      window.removeEventListener("keydown", onKey);
    };
  }, [armed, exit, curtain, fadeLeadMs, startWithinMs, stallMs]);

  if (!armed || gone) return null;

  return (
    <AnimatePresence onExitComplete={() => setGone(true)}>
      {playing && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: fadeMs / 1000, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] h-[100dvh] w-screen overflow-hidden bg-night"
        >
          <motion.video
            ref={video}
            poster={introMedia.posterSrc}
            autoPlay
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden
            tabIndex={-1}
            animate={{ opacity: ending ? 0 : 1 }}
            transition={{ duration: signFadeMs / 1000, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover object-center"
          >
            <source src={introMedia.webmSrc} type="video/webm" />
            <source src={introMedia.mp4Src} type="video/mp4" />
          </motion.video>

          {/* The logo bookends the film: it owns the black while the clip
              loads, steps aside once the first frame arrives, and comes back to
              hold the last beat on its own. */}
          <motion.div
            aria-hidden
            animate={{ opacity: rolling && !ending ? 0 : 1 }}
            transition={{
              duration: (ending ? signFadeMs : 900) / 1000,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <Logo
              variant="lockup"
              tone="gold"
              priority
              className="h-[38svh] max-h-[26rem] w-auto"
              sizes="(max-width: 768px) 55vw, 22rem"
            />
          </motion.div>

          {/* The control retires with the film: once the logo has the screen,
              there is a second left and nothing to skip. */}
          <motion.button
            type="button"
            autoFocus
            onClick={exit}
            animate={{ opacity: ending ? 0 : 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            // Faded out is not gone: without this it stays a clickable target.
            className={`label absolute bottom-8 left-1/2 -translate-x-1/2 border-b border-ivory/30 py-2 text-ivory/80 transition-colors duration-300 hover:border-ivory hover:text-ivory md:bottom-10 md:left-auto md:end-10 md:translate-x-0 ${
              ending ? "pointer-events-none" : ""
            }`}
          >
            {t("skip")}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
