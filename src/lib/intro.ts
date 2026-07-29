/**
 * Opening-sequence plumbing, shared by the overlay and by everything that has
 * to hold still until the overlay is gone.
 *
 * The decision to play is taken by a blocking inline script in the document,
 * not by React, and it is written to `<html data-intro-pending>`. That matters:
 * the black shield behind the overlay is CSS-gated on that attribute, so the
 * first paint is already black on a first visit and already the site on a
 * repeat one. Deciding in an effect instead would flash one frame of the
 * homepage before the intro covered it.
 */
export const INTRO_SESSION_KEY = "aura-intro-played";
export const INTRO_DONE_EVENT = "aura:intro-done";

/** Runs during HTML parse, before anything paints. Keep it small and defensive. */
export const INTRO_BOOTSTRAP = `try{var d=document.documentElement,p=location.pathname.replace(/\\/$/,""),h=/^(\\/[a-z]{2})?$/.test(p),f=/[?&]intro=1(?:&|$)/.test(location.search),s=sessionStorage.getItem("${INTRO_SESSION_KEY}"),r=matchMedia("(prefers-reduced-motion: reduce)").matches;if(h&&(f||(!s&&!r)))d.dataset.introPending="1"}catch(e){}`;

/**
 * True while the opening sequence owns the screen.
 *
 * Safe to call during a client render: the attribute is set before hydration,
 * so the first client render agrees with itself. On the server it is false,
 * which is also what the server markup reflects.
 */
export const introPending = () =>
  typeof document !== "undefined" &&
  document.documentElement.dataset.introPending === "1";

/** Hands the screen back: shield off, scroll restored, session remembered. */
export function endIntro() {
  if (typeof document === "undefined") return;
  delete document.documentElement.dataset.introPending;
  try {
    sessionStorage.setItem(INTRO_SESSION_KEY, "1");
  } catch {
    // Private mode or a blocked store. The intro simply plays again next load.
  }
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}
