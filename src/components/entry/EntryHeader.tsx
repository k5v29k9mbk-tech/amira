"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { Logo } from "@/components/Logo";
import { brand } from "@/lib/studio";
import { shell } from "@/lib/ui";
import { dur, ease, stagger } from "@/lib/motion";
import { entryCopy } from "@/lib/entry";
import { useLocale } from "next-intl";

/**
 * The entry page's masthead, and the reason it is a second component rather
 * than a fifth branch inside `Header`.
 *
 * `Header` is the site's bar and it is tuned to within a few pixels: the note at
 * the top of that file argues its exact four labels against the width French
 * needs at 1024, argues the booking action down to one word to buy that room,
 * and argues the WhatsApp mark off the bar entirely. This masthead carries five
 * labels and a filled action, which is a different set of constraints, and
 * pushing both through one component would mean every future adjustment to
 * either had to be made without breaking the other.
 *
 * `Header` now dispatches: the entry route gets this, every other route gets the
 * bar it always had, unchanged. Neither knows about the other's arithmetic.
 *
 * WHAT IT SHARES WITH THE BAR, deliberately, so the two read as one site: the
 * shell and its gutters, the label face and its tracking, the house curve and
 * its 500ms, the monogram, the language control, the focus trap and the scroll
 * lock. What differs is only what the composition needs.
 *
 * IT NEVER GOES LIGHT. `Header` cross-fades its type to ivory while it floats
 * over the homepage film, because espresso on footage is not dim, it is gone.
 * This page opens on the academy's warm ivory with a portrait beside it, so the
 * type is espresso at every scroll position and the only thing that changes is
 * whether the bar has a ground under it. That is the state the note in `Header`
 * anticipated when it kept its light branch behind a constant.
 */
export function EntryHeader() {
  const locale = useLocale();
  const copy = entryCopy(locale);
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [past, setPast] = useState(false);
  const { scrollY } = useScroll();

  /**
   * 16px, the same threshold the site bar uses.
   *
   * At rest the masthead is type on the hero's own ivory with no rule under it,
   * which is the reference's composition and the state that matters. The moment
   * the page moves it takes its ground, so the portrait's dark half never passes
   * under unbacked type.
   */
  useMotionValueEvent(scrollY, "change", (y) => setPast(y > 16));

  useEffect(() => setOpen(false), [pathname]);

  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  /**
   * The same modal contract the site bar's menu honours, and for the same
   * reasons argued at length there: `aria-modal` tells a screen reader the rest
   * of the document is inert but does not tell the browser, so Tab has to be
   * wrapped by hand or focus walks the page underneath an opaque overlay; and a
   * dialog that does not restore focus leaves a keyboard reader at the top of
   * the document. The tabbable set is read on each press rather than cached,
   * because the language control renders a button per locale.
   */
  useEffect(() => {
    if (!open) return;

    const restoreTo = opener.current;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;

      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || !panel.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panel.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      restoreTo?.focus({ preventScroll: true });
    };
  }, [open]);

  /**
   * The five destinations the reference names, in its order.
   *
   * `academy` IS AN ANCHOR, NOT A ROUTE, and that is what keeps this one page.
   * The academy's landing page is no longer somewhere else to be linked to: it
   * is the rest of THIS page, starting at the film hero directly below the
   * masterclass. So the label scrolls there rather than navigating, and there is
   * no second document anywhere holding a copy of either half.
   */
  const links = [
    { href: "/", label: copy.nav.home },
    { href: "/about", label: copy.nav.about },
    { href: "/courses", label: copy.nav.courses },
    { href: "/#academy", label: copy.nav.academy },
    { href: "/contact", label: copy.nav.contact },
  ] as const;

  const solid = past;

  return (
    <header
      className={`no-print fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ease-[var(--ease-aura)] ${
        solid ? "border-hair bg-ivory/95 backdrop-blur-sm" : "border-transparent"
      }`}
    >
      <div
        className={`${shell} flex h-[76px] items-center justify-between gap-5 text-espresso md:h-[88px] md:gap-8`}
      >
        {/* THE STACKED LOCKUP, WHICH IS THE ONE PLACE THIS MASTHEAD DEPARTS
            FROM THE SITE BAR'S RULE ABOUT THE MONOGRAM.

            `Logo`'s note explains why any surface under about 90px tall gets the
            mark alone: the supplied plate is stacked, so at bar height its
            ACADEMY line would set about four pixels tall and read as a smudge.
            That rule is about the ARTWORK, and it still holds — the artwork here
            is still the monogram.

            What sits beside it is type, not artwork: the academy's name set in
            the body sans at the lockup tracking `globals.css` already defines
            for the hero, which is the same two-line AURA / ACADEMY the reference
            sets and is legible at any size because it is text. The mark and the
            two lines are separated by a hairline rule, so the pair reads as one
            plate rather than as a logo with a caption.

            `shrink-0` for the reason the site bar's note gives in full: every
            child of a flex row shrinks by default, and the one item that can
            give is the brand, which on a 390px screen gave all of it and
            rendered the academy's name as a vertical scratch. */}
        <Link href="/" aria-label={brand.full} className="flex shrink-0 items-center gap-3 md:gap-4">
          <Logo variant="mark" tone="dark" priority className="h-9 w-auto md:h-11" sizes="90px" />
          <span
            /* LTR in every language, including Arabic. The wordmark is Latin in
               all four locales because the brand is one brand in all four, and
               `dir` here is what stops the bidi algorithm reordering the two
               lines against the mark on the Arabic route. */
            dir="ltr"
            className="hidden border-s border-hair ps-3 leading-none md:block md:ps-4 lg:hidden xl:block"
          >
            <span className="block text-[0.9375rem] font-medium uppercase tracking-[0.34em] [text-indent:0.34em]">
              Aura
            </span>
            <span className="mt-1.5 block text-[0.5625rem] font-medium uppercase tracking-[0.42em] text-bronze-ink [text-indent:0.42em]">
              Academy
            </span>
          </span>
        </Link>

        {/* Five labels, and they only appear from lg. The site bar's arithmetic
            applies here too and is tighter, because this set is one longer: at
            1024 the shell leaves 896px, and five labels in French — the widest
            of the four locales — plus the lockup, the language control and a
            filled action come to roughly 860. It clears, and it does not clear
            at md, which is why the phone menu carries the set below 1024. */}
        <nav aria-label={brand.short} className="hidden items-center gap-7 lg:flex xl:gap-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={l.href === "/" ? "page" : undefined}
              /* Anchors on this page scroll; only HOME is the page itself. */
              className={`label relative whitespace-nowrap py-1 transition-opacity duration-300 hover:opacity-100 after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-[left] after:bg-current after:transition-transform after:duration-500 after:ease-[var(--ease-aura)] hover:after:scale-x-100 rtl:after:origin-[right] ${
                l.href === "/" ? "opacity-100 after:scale-x-100" : "opacity-70 after:scale-x-0"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-5 md:gap-6 lg:gap-7">
          <div className="hidden lg:block">
            <LocaleSwitcher tone="dark" />
          </div>

          {/* THE ENROL ACTION, AND THE ONE FILLED SHAPE ON THE FIRST SCREEN.

              The reference sets it in the muted bronze rather than in the
              site's espresso, and that is the correct reading of the
              composition: this screen already has a near-black block in it (the
              reserve button under the statement), and a second one in the bar
              would give the page two equally weighted primary actions above the
              fold. Bronze is the brand's metal and it is the register this
              masthead's action belongs in.

              It is `--aura-bronze` at full strength with ivory type on it, which
              measures 4.6:1 — AA for the 12px small-caps it carries, with the
              raw brand bronze rather than a text-safe derivative because here it
              is a GROUND and the ivory on top of it is the type.

              Below md the box comes off and it is bronze label type with a
              hairline under it, exactly the register the site bar uses at that
              width, so the two mastheads degrade the same way on a phone. */}
          <Link
            href="/contact"
            className="label relative inline-flex items-center justify-center whitespace-nowrap py-4 text-bronze-ink transition-colors duration-500 ease-[var(--ease-aura)] after:absolute after:inset-x-0 after:bottom-3 after:h-px after:bg-current after:opacity-40 active:translate-y-px md:bg-bronze md:px-7 md:py-3.5 md:text-ivory md:after:hidden md:hover:bg-espresso"
          >
            {copy.enroll}
          </Link>

          <button
            ref={opener}
            type="button"
            aria-expanded={open}
            aria-haspopup="dialog"
            onClick={() => setOpen(true)}
            className="label -me-2 px-2 py-4 lg:hidden"
          >
            {copy.nav.menu}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={copy.nav.menu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur.quick, ease: ease.aura }}
            className="fixed inset-0 z-50 bg-ivory text-espresso lg:hidden"
          >
            <div className={`${shell} flex h-[76px] items-center justify-between`}>
              <Logo variant="mark" tone="dark" className="h-9 w-auto" sizes="80px" />
              <button type="button" autoFocus onClick={() => setOpen(false)} className="label py-2">
                {copy.nav.close}
              </button>
            </div>

            {/* `m-auto` rather than `justify-center`, for the reason the site
                bar's menu documents: in a scrolling flex column a centred child
                overflows off the TOP, where a scrollbar cannot reach it, and the
                first entries become unreachable on a short handset. An auto
                margin centres while there is room and resolves to zero when
                there is not. */}
            <nav
              aria-label={brand.short}
              className={`${shell} flex h-[calc(100dvh-76px)] flex-col overflow-y-auto`}
            >
              <div className="m-auto grid w-full gap-1 py-10">
                {links.map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: dur.base,
                      delay: stagger.base + i * stagger.tight,
                      ease: ease.aura,
                    }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="display block py-2 text-[clamp(2rem,9vw,3.25rem)] transition-colors duration-300 hover:text-bronze-ink"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: dur.base,
                    delay: stagger.base + links.length * stagger.tight,
                    ease: ease.aura,
                  }}
                  className="mt-8 border-t border-hair pt-8"
                >
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="label inline-flex w-full items-center justify-center bg-bronze px-8 py-4 text-ivory transition-colors duration-500 ease-[var(--ease-aura)] hover:bg-espresso active:translate-y-px"
                  >
                    {copy.enroll}
                  </Link>
                  {/* Upward: this is the last thing in a column that scrolls, so
                      a menu opening downward would be laid out past the bottom
                      of its own scroll container. */}
                  <div className="mt-8">
                    <LocaleSwitcher tone="dark" side="up" />
                  </div>
                </motion.div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
