"use client";

import { useEffect, useState } from "react";
import { INTRO_DONE_EVENT, introPending } from "./intro";

/**
 * False only while the opening sequence is still covering the page, so an
 * entrance animation can wait for its cue instead of playing to a black
 * overlay and being over before anyone sees it.
 *
 * Everywhere else, and on every route without an intro, it is true from the
 * first render and costs a single boolean.
 *
 * The initial value is read synchronously rather than in an effect: components
 * that use this render their `initial` variant either way, so the server and
 * client markup agree, and there is no frame where the content animates twice.
 */
export function useIntroReady() {
  const [ready, setReady] = useState(() => !introPending());

  useEffect(() => {
    if (ready) return;
    const done = () => setReady(true);
    window.addEventListener(INTRO_DONE_EVENT, done);
    return () => window.removeEventListener(INTRO_DONE_EVENT, done);
  }, [ready]);

  return ready;
}
