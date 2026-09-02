"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales } from "@/i18n/routing";
import { usePageText } from "@/lib/content/client";

/** Two letters, not a flag and not a boxed control. */
const short: Record<string, string> = { en: "EN", it: "IT", fr: "FR", ar: "AR" };
/** The endonym, always. A language is named in itself or it is named wrongly. */
const full: Record<string, string> = {
  en: "English",
  it: "Italiano",
  fr: "Français",
  ar: "العربية",
};

/**
 * The language control.
 *
 * WHAT IT WAS, AND WHY IT IS NOT THAT ANY MORE. This was a native `<select>`
 * whose closed state printed the selected option, which meant the bar carried
 * "IT · Italiano" — a code, a middot and a language name, set beside four
 * navigation labels and a booking action. Two of those three tokens are the same
 * fact stated twice, and the widest of the four locales made it the second
 * longest item in a bar whose whole job is to be quiet. A native select also has
 * no closed-state styling worth the name: the control could not be tuned to sit
 * in this bar without fighting the platform for it.
 *
 * The trigger is now the two-letter code and a caret, and the names live in the
 * menu, where a name is what a reader actually needs. Everything the select gave
 * away for free has had to be written out below, and the list is the reason this
 * component is fifty lines longer than it was: focus moves into the menu on
 * open, the arrow keys and Home and End walk it, Escape closes it and puts focus
 * back on the trigger, Tab closes it, a pointer anywhere outside closes it, and
 * the current language is announced as the checked item of a radio group rather
 * than left for a sighted reader to spot. A custom menu that does less than this
 * is a regression on a native select, whatever it looks like.
 *
 * ESCAPE STOPS PROPAGATING, AND THAT IS LOAD BEARING. On a phone this control
 * renders inside the header's full-screen menu, which closes itself on Escape
 * through a listener on `window`. Both handlers would otherwise fire on one
 * press and a reader who opened the language menu, changed her mind and pressed
 * Escape would lose the navigation overlay as well. This listener is on
 * `document`, which the event reaches first, so stopping propagation there keeps
 * the two dialogs independent: one press, one thing closes.
 *
 * THE ROUTE SURVIVES THE SWITCH. `router.replace` is handed the current
 * `pathname` and the current dynamic `params` rather than a locale root, so a
 * reader on /it/courses/microblading lands on /en/courses/microblading and not
 * on the English homepage. `replace` rather than `push`, so the back button
 * returns her to the page she came from rather than to the same page in the
 * language she just left.
 */
export function LocaleSwitcher({
  tone = "dark",
  /**
   * Which way the menu opens. In the bar there is a whole page below the
   * trigger; in the phone menu the control is the last thing in a scrolling
   * column, and a menu opening downwards there would be laid out below the
   * bottom of its own scroll container.
   */
  side = "down",
  className = "",
}: {
  tone?: "dark" | "light";
  side?: "down" | "up";
  className?: string;
}) {
  const locale = useLocale();
  const t = usePageText("common", "nav");
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const box = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const items = useRef<Array<HTMLButtonElement | null>>([]);

  const light = tone === "light";

  /**
   * Focus lands on the language already in use rather than on the top of the
   * list, so the first arrow press moves relative to where the reader is.
   */
  useEffect(() => {
    if (!open) return;
    const i = locales.indexOf(locale as (typeof locales)[number]);
    items.current[i < 0 ? 0 : i]?.focus();
  }, [open, locale]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      setOpen(false);
      trigger.current?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // A navigation closes it, so the menu never survives the switch it started.
  useEffect(() => setOpen(false), [pathname, locale]);

  const choose = (next: string) => {
    setOpen(false);
    if (next === locale) {
      trigger.current?.focus();
      return;
    }
    startTransition(() => {
      router.replace(
        // @ts-expect-error dynamic params are passed through unchanged
        { pathname, params },
        { locale: next },
      );
    });
  };

  /** Arrow keys wrap, Home and End jump, Tab leaves and closes behind it. */
  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const n = locales.length;
    const from = items.current.findIndex((el) => el === document.activeElement);
    const to =
      e.key === "ArrowDown"
        ? (from + 1 + n) % n
        : e.key === "ArrowUp"
          ? (from - 1 + n) % n
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : null;

    if (to !== null) {
      e.preventDefault();
      items.current[to]?.focus();
      return;
    }
    if (e.key === "Tab") setOpen(false);
  };

  return (
    <div ref={box} className={`relative ${className}`}>
      <button
        ref={trigger}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t("language")}: ${full[locale]}`}
        disabled={pending}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
          e.preventDefault();
          setOpen(true);
        }}
        /* min-h-11 keeps it a 44px tap target inside a 72px bar. */
        className={`label inline-flex min-h-11 items-center gap-2 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100 ${
          light ? "text-ivory" : "text-espresso"
        } ${open ? "opacity-100" : light ? "opacity-80" : "opacity-70"}`}
      >
        {short[locale]}
        {/* THE CARET IS DRAWN, NOT SET, and that is a correction rather than a
            preference. It was "▾" (U+25BE), which is the glyph the brief writes
            and the obvious thing to reach for. Neither of this site's two faces
            carries it, so it came out of a system fallback at whatever size that
            fallback drew it, and next to an 11px label at 0.2em it rendered as a
            small filled dot: on a site whose entire copy convention is words
            joined by middots, the one control that opens something looked like
            punctuation. Two strokes at hairline weight are unmistakably a caret,
            are identical in every browser, and are the same weight as the rules
            under the navigation beside them.

            It turns over rather than swapping glyph: one transform on the house
            curve, and it is the only movement this control makes. */}
        <svg
          aria-hidden
          viewBox="0 0 10 6"
          className={`h-[6px] w-[10px] overflow-visible opacity-70 transition-transform duration-300 ease-[var(--ease-aura)] ${
            open ? "-scale-y-100" : ""
          }`}
        >
          <path
            d="M1 1L5 5L9 1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="square"
          />
        </svg>
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={t("language")}
          onKeyDown={onMenuKeyDown}
          /* Square, hairline, flat: the house has no cards, pills or glows, and
             a dropdown is not the place to introduce the first one. The panel
             takes the ground it is standing on rather than one ground for both
             states, because over the film an ivory rectangle is a hole cut in
             the footage and on the bar's own ivory a black one is a slab. */
          /* THE PANEL HANGS OFF THE EDGE THE TRIGGER CAN SPARE, and which edge
             that is follows from where the control sits rather than from a
             second prop. In the bar the wrapper shrinks to the trigger and the
             trigger is the last thing before the page gutter, so the panel is
             pinned to its inline end and opens inwards; anchored the other way
             it would hang 130px off the side of the page. In the phone menu the
             wrapper is a full-width row and the trigger sits at the inline
             start, so the panel is pinned to the start and stands directly over
             the control that opened it. Both are logical properties, so Arabic
             mirrors without a second rule. */
          className={`absolute z-50 min-w-[11rem] border ${
            side === "up" ? "bottom-full mb-3 start-0" : "top-full mt-3 end-0"
          } ${light ? "border-hair-dark bg-night" : "border-hair bg-ivory"}`}
        >
          {locales.map((l, i) => {
            const current = l === locale;
            return (
              <button
                key={l}
                ref={(el) => {
                  items.current[i] = el;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={current}
                onClick={() => choose(l)}
                className={`flex w-full items-center gap-4 px-4 py-3 text-start transition-colors duration-300 focus:outline-none ${
                  light
                    ? `text-ivory hover:bg-white/[0.07] focus:bg-white/[0.07] ${
                        current ? "text-bronze-hi" : ""
                      }`
                    : `text-espresso hover:bg-espresso/[0.05] focus:bg-espresso/[0.05] ${
                        current ? "text-bronze-ink" : ""
                      }`
                }`}
              >
                {/* The code holds a fixed column so the four names start on one
                    line, which is what makes the list read as a table of
                    languages rather than as four unrelated rows. It keeps the
                    house small-caps; the name beside it deliberately does not,
                    and `.locale-name` in globals.css says why. */}
                <span className={`label w-7 shrink-0 ${current ? "" : "opacity-55"}`}>
                  {short[l]}
                </span>
                {/* `lang` is on the name and not on the row: it is the only part
                    of the row written in that language, and on the Arabic row it
                    is what hands the string to the Naskh face. Put on the button
                    it would also pull the Latin code into the Arabic label
                    tracking and set one of the four codes tighter than the
                    other three. */}
                <span lang={l} className="locale-name">
                  {full[l]}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
