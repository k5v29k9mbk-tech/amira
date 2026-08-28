"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";
import { brand } from "@/lib/studio";
import { btnSolid, shell } from "@/lib/ui";
import { dur, ease, stagger } from "@/lib/motion";

/**
 * Header.
 *
 * Over the homepage hero it is type on the film and nothing else: no bar, no
 * pill, no blur. It takes a ground and a hairline only once the hero is behind
 * the visitor. Every other route starts solid.
 *
 * The type does change colour, and it has to. The hero is now the academy's own
 * footage under a scrim rather than an ivory field, and espresso type on it is
 * not dim, it is gone. So the bar is set light while it is over the film and
 * espresso once it has a ground, and the two states cross-fade on the same
 * 500ms house curve as the ground itself, which is what keeps it one movement
 * rather than a bar that repaints. Everything in it turns together: the
 * monogram, the navigation, the language control and the booking action, each
 * through the tone its own component already had.
 *
 * The scrim is weighted at the top of the hero for exactly this, so the light
 * state is legible over the brightest frame of the film rather than only over
 * the average one.
 *
 * The phone menu is a full-screen ivory field with the navigation set at
 * display size, not a drawer.
 *
 * WHAT THE BAR CARRIES, PER WIDTH, and the rule behind it: a phone bar holds a
 * brand and one decision, and everything else belongs somewhere a reader has
 * asked to be. So below md it is the monogram, the booking action set as a
 * champagne rule rather than a filled block, and Menu. From md the action takes
 * a box; from lg the navigation and the language control arrive and Menu goes.
 *
 * THE WHATSAPP MARK IS NOT IN THE BAR ANY MORE, AT ANY WIDTH. It was the third
 * mark in the right-hand cluster from md up, a filled green-brand glyph sitting
 * between the language control and the booking action, and it was the one item
 * in a luxury bar that belonged to somebody else's design system. Nothing in the
 * bar should compete with the brand mark on the other side of it and with the
 * one action the bar exists to offer, and an icon does exactly that: it is the
 * only shape in the row, so it is read first.
 *
 * The channel is untouched everywhere it converts, which is the whole point of
 * removing it from here rather than from the site. It is in `StickyCta`, which
 * stands at the foot of the page from the moment the hero is behind the reader,
 * with the same prefilled message; it is a full-size action in the closing frame
 * of the homepage, the catalogue and every course page; and it is a row on
 * /contact and a line in the footer. What it no longer does is stand in the
 * masthead.
 *
 * THE NAVIGATION IS FOUR LABELS, and the fifth is gone rather than held back to
 * a width. It used to be five with the results link appearing only at xl, which
 * meant a bar that carried a different set of destinations depending on how wide
 * the laptop was, and the arithmetic that forced that is what says the bar had
 * one label too many. Programmes, the method, Amira, FAQ: what is taught, how it
 * is taught, who teaches it, and the answers. The results and the ladder of
 * levels are acts of the homepage with anchors of their own, and both are still
 * in the phone menu and in the footer, which is where they were reachable from
 * at every width below xl anyway.
 */
export function Header() {
  const t = useTranslations("nav");
  const cta = useTranslations("cta");
  const pathname = usePathname();
  const overHero = pathname === "/";

  const [open, setOpen] = useState(false);
  const [past, setPast] = useState(false);
  const { scrollY } = useScroll();

  /**
   * THE BAR TAKES ITS GROUND ON THE FIRST SCROLL, ON EVERY ROUTE.
   *
   * The homepage used to hold the transparent state for almost a whole
   * viewport (`innerHeight - 90`), because the hero was a full-screen film and
   * a bar with a ground on it would have been a strip across the footage.
   *
   * That threshold is unsafe against the hero this site has now. The opening is
   * a studio portrait, and on a phone the composition is taller than the screen:
   * the copy, then the photograph, then the figures. Scroll a few hundred pixels
   * and what passes under a transparent bar is the dark half of the portrait,
   * her hair and a black blazer, with espresso type sitting on it. The
   * navigation and the booking action were unreadable for most of a screen, and
   * that is exactly the region a phone visitor scrolls through first.
   *
   * 16px everywhere. At rest the bar is still type on the hero's own ivory with
   * no rule under it, which is the state that matters; the moment the page
   * moves it takes its ground, so nothing dark ever passes beneath it. The
   * special case is gone rather than retuned, because any number here is a
   * guess about a composition's height and this one had already been wrong once.
   */
  useMotionValueEvent(scrollY, "change", (y) => {
    setPast(y > 16);
  });

  // Close on route change, so the overlay never survives a navigation.
  useEffect(() => setOpen(false), [pathname]);

  /**
   * The panel this ref is on is the whole overlay, and it is what makes the
   * menu a dialog rather than a div that says it is one.
   */
  const panel = useRef<HTMLDivElement>(null);
  /**
   * The control that opened it. A dialog that does not put focus back where it
   * came from leaves a keyboard reader at the top of the document, and on this
   * site that means tabbing through the whole bar again to get to where she
   * already was.
   */
  const opener = useRef<HTMLButtonElement>(null);

  /**
   * WHAT THE OVERLAY OWES A KEYBOARD, BEYOND ESCAPE AND A GROUND.
   *
   * It already announced itself correctly (`role="dialog"`, `aria-modal`, a
   * label), took focus on open through `autoFocus` on the close control, closed
   * on Escape and locked the scroll. Two things were missing, and they are the
   * two a modal is actually judged on.
   *
   * TAB DID NOT STAY IN IT. `aria-modal` tells a screen reader the rest of the
   * document is inert; it does not tell the browser, and the browser is what
   * moves focus. So the third Tab left the panel and walked the navigation,
   * the WhatsApp link and the booking button underneath it, all of them behind
   * a full-screen opaque layer. Focus was on controls the reader could not see,
   * and to a sighted keyboard user the focus ring simply vanished. The wrap
   * below reads the panel's own tabbable set each time rather than caching it,
   * because the set is not fixed: the WhatsApp row renders only when a number
   * is on file, and the language control renders a button per locale.
   *
   * FOCUS DID NOT COME BACK. Closing left the activeElement on a button that
   * had just been unmounted, which drops focus to `body`. The restore is in
   * the cleanup so it runs on every close path there is: Escape, the close
   * control, a link, and the route change effect above.
   *
   * `preventScroll` on the restore, because the bar is fixed and focusing it
   * would otherwise scroll the page to the top behind the closing overlay.
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

      // Shift+Tab off the first control wraps to the last, and Tab off the
      // last wraps to the first. The `!panel.contains` arm catches the case
      // where focus has already escaped, which is what happens on the very
      // first Tab if the browser has put focus on the document rather than on
      // the autofocused control.
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

  const solid = past || !overHero;

  /**
   * THE LIGHT STATE IS BACK ON, BECAUSE THE HERO IS FOOTAGE AGAIN.
   *
   * This was `!solid` for as long as the first screen was the academy's film,
   * then a hard `false` for as long as it was a studio portrait on ivory: ivory
   * type on an ivory hero is invisible, so the light state had to be switched
   * off when the ground changed, and the constant was deliberately kept rather
   * than inlined so that a future dark hero could turn it back on in one line.
   * That is what this is. The hero is the pigment film under a scrim again, and
   * espresso navigation over it was unreadable: measured on the restored screen,
   * every label in the bar disappeared into the footage and only the filled
   * button survived.
   *
   * So the bar is ivory while it is transparent over the hero, and espresso the
   * moment it takes its own ivory ground, which is 16px of scroll. If the first
   * screen is ever put back on a light ground, this goes back to `false` and
   * nothing else in the file has to change: every tone pair here reads it.
   */
  const onFilm = !solid;

  /**
   * Four labels, at every width the bar is shown at.
   *
   * The set used to be five with `/#work` appearing only from xl, because at
   * 1024px the shell leaves 896 and the logo, the WhatsApp mark, the language
   * control and a "Prenota una consulenza" button took about 470 of it before a
   * single label was set. Two of those three costs are gone: the mark is off the
   * bar and the action is one word. What is left is a set that fits the same at
   * 1024 as it does at 1600, so the bar carries the same four destinations on a
   * laptop as on a large desktop, which is the part that was actually wrong with
   * the old arrangement.
   */
  const links = [
    { href: "/courses", label: t("courses") },
    { href: "/#method", label: t("method") },
    { href: "/about", label: t("about") },
    { href: "/faq", label: t("faq") },
  ] as const;

  /**
   * The phone menu, and it carries one more than the bar does.
   *
   * `/#path` is the ladder of levels, which is the section that answers "where
   * do I come in" and the one a returning visitor is most likely to want to
   * reach directly. It is in the menu and not in the bar for the same
   * arithmetic reason the results link is held back to xl: at 1024px there is
   * no room for a sixth label in French, and a menu is a screen rather than a
   * strip.
   *
   * It sits directly after the programmes, because the two are one question:
   * what is taught, and at what level.
   */
  const menuLinks = [
    { href: "/", label: t("home") },
    { href: "/courses", label: t("courses") },
    { href: "/#path", label: t("pathway") },
    { href: "/#method", label: t("method") },
    { href: "/#work", label: t("work") },
    { href: "/about", label: t("about") },
    { href: "/faq", label: t("faq") },
    { href: "/contact", label: t("contact") },
  ] as const;

  const isCurrent = (href: string) =>
    !href.includes("#") && (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`no-print fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-[var(--ease-aura)] ${
        solid ? "border-b border-hair bg-ivory" : "border-b border-transparent"
      }`}
    >
      <div
        className={`${shell} flex h-[72px] items-center justify-between gap-5 transition-colors duration-500 ease-[var(--ease-aura)] md:h-[76px] md:gap-10 ${
          onFilm ? "text-ivory" : "text-espresso"
        }`}
      >
        {/* The monogram, not the full plate: the supplied lockup is stacked,
            and a 76px bar would set its ACADEMY line four pixels tall.

            `shrink-0` is the whole reason the mark is legible on a phone, and
            its absence was not a subtle bug. The bar is a flex row and every
            child in it shrinks by default; below md it was carrying a WhatsApp
            glyph, a 212px filled button and the word Menu, which is 293px of
            unshrinkable content — `whitespace-nowrap` on the button, an icon
            with an intrinsic box — inside 342px of gutter-to-gutter at 390.
            The one item in the row that *could* give was the logo, so it gave
            all of it: measured at 5 pixels wide by 36 tall on a 390px screen,
            the brand rendered as a vertical scratch. The button is now a text
            link and the glyph is gone, and the mark is pinned besides, so no
            future addition to the bar can take the academy's name again.

            40px rather than 36 on a phone. It is the only brand element left in
            the mobile bar and it should read as the reason the bar exists;
            desktop is untouched, where the navigation carries that weight. */}
        <Link href="/" aria-label={brand.full} className="shrink-0">
          <Logo
            variant="mark"
            tone={onFilm ? "light" : "dark"}
            priority
            className="h-10 w-auto"
            sizes="80px"
          />
        </Link>

        {/* gap-8 at lg, gap-11 from xl. Both are a step wider than the bar
            carried while it held five labels and a glyph, and the air is the
            point rather than a side effect of the room: four labels set close
            together read as a strip of options, and the same four with a real
            gutter between them read as a masthead. The arithmetic still clears
            at 1024 in French, which is the widest of the four locales. */}
        <nav aria-label={brand.short} className="hidden items-center gap-8 lg:flex xl:gap-11">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isCurrent(l.href) ? "page" : undefined}
              className={`label relative py-1 transition-opacity duration-300 hover:opacity-100 after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-[left] after:bg-current after:transition-transform after:duration-500 after:ease-[var(--ease-aura)] hover:after:scale-x-100 rtl:after:origin-[right] ${
                isCurrent(l.href) ? "opacity-100 after:scale-x-100" : "opacity-70 after:scale-x-0"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Two items where there were three, and the gutter grew rather than
            the row closing up. Removing the glyph left about 45px of slack;
            spending it on the space between the language control and the action
            is what stops the two reading as one cluster of controls, and is why
            the bar does not look like something was taken out of it. */}
        <div className="flex shrink-0 items-center gap-6 md:gap-7 lg:gap-8">
          <div className="hidden lg:block">
            <LocaleSwitcher tone={onFilm ? "light" : "dark"} />
          </div>

          {/* The booking action, in two registers on one element.

              ONE WORD, NOT FOUR. It reads `nav.book` here and `cta.consultation`
              everywhere else, and that is a label for a bar rather than a fifth
              verb: "Prenota", "Book", "Réserver". The four asks the site is
              allowed to make are unchanged and this is still one of them, going
              to the same /contact the hero's neighbours, the phone menu, the
              standing bar and every closing frame go to. What has changed is
              that the bar no longer sets a four-word sentence in small caps
              beside the brand mark. At the house tracking "Prenota una
              consulenza" is 178px; "Prenota" is 62, and the 116px difference is
              most of the reason the navigation now fits at 1024 and the phone
              bar has room to breathe.

              FROM A SLAB TO A HAIRLINE. From md this was a filled block, in
              solid ivory over the film: the brightest, heaviest, most saturated
              shape on the opening screen, sitting above a headline it
              comfortably out-shouted. It is now the outline of the same shape,
              in the site's own secondary register (`btnLine` and `btnLineLight`
              are the borders it borrows), and it fills on hover. An outlined
              control beside a wordmark is still unmistakably the one thing in
              the bar that is an action rather than a destination; it simply is
              not the loudest object on the academy's first screen any more.

              Below md the box comes off entirely and it is label type in
              champagne with a hairline under it. The 360px gate that used to sit
              on this is gone with the long label that needed it: at 320px the
              gutters leave 272, and a 40px mark, 62px of action and a 40px Menu
              fit inside it with 90 to spare, so the smallest phone the site
              supports now carries the action in the bar like every other width.

              The tone classes below md are the mobile register and every md:
              class is the button; a media variant sorts after its base in the
              generated sheet, so the desktop pair wins at md without either
              needing !important. What is deliberately absent is a second
              unprefixed display utility: `inline-flex` here and a bare `hidden`
              would be two same-specificity display rules whose winner Tailwind's
              emit order decides rather than this file. */}
          <Link
            href="/contact"
            className={`label group/btn relative inline-flex items-center justify-center gap-3 whitespace-nowrap py-4 transition-colors duration-500 ease-[var(--ease-aura)] after:absolute after:inset-x-0 after:bottom-3 after:h-px after:bg-current after:opacity-40 active:translate-y-px md:border md:px-6 md:py-3 md:after:hidden ${
              onFilm
                ? "text-bronze-hi md:border-ivory/45 md:text-ivory md:hover:border-ivory md:hover:bg-ivory md:hover:text-espresso"
                : "text-bronze-ink md:border-espresso/35 md:text-espresso md:hover:border-espresso md:hover:bg-espresso md:hover:text-ivory"
            }`}
          >
            {t("book")}
          </Link>

          {/* 45px of hit area rather than 33, and the horizontal padding is
              pulled back off as negative margin so the word still sits flush to
              the page gutter. `-me-2` is the logical property, so the pull is on
              the correct side in Arabic. */}
          <button
            ref={opener}
            type="button"
            aria-expanded={open}
            aria-haspopup="dialog"
            onClick={() => setOpen(true)}
            className="label -me-2 px-2 py-4 lg:hidden"
          >
            {t("menu")}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={t("menu")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur.quick, ease: ease.aura }}
            className="fixed inset-0 z-50 bg-ivory text-espresso lg:hidden"
          >
            <div className={`${shell} flex h-[72px] items-center justify-between`}>
              <Logo variant="mark" tone="dark" className="h-9 w-auto" sizes="80px" />
              <button
                type="button"
                autoFocus
                onClick={() => setOpen(false)}
                className="label py-2"
              >
                {t("close")}
              </button>
            </div>

            {/* Centred when it fits, scrollable when it does not, and the two
                are not the same rule. Eight display-size lines and the action
                beneath them come to about 730px, and a 667px handset has 599
                once the bar is off it, so on most phones this list is now
                taller than the screen it is on rather than only on the
                smallest. `justify-center` in a
                scrolling flex column is the trap here: the overflow goes off
                the *top*, where a scrollbar cannot reach it, and the first two
                items become unreachable. An `m-auto` child centres while there
                is room and resolves to zero when there is not, which is the
                behaviour this actually wants. */}
            <nav
              aria-label={brand.short}
              className={`${shell} flex h-[calc(100dvh-72px)] flex-col overflow-y-auto`}
            >
              <div className="m-auto grid w-full gap-1 py-10">
                {menuLinks.map((l, i) => (
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
                      className="display block py-2 text-[clamp(2rem,10vw,3.5rem)] transition-colors duration-300 hover:text-bronze-ink"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
                {/* The action the bar cannot hold on a phone. It closes the
                    menu rather than sitting in it silently, so the one screen a
                    phone visitor opens deliberately always ends in something to
                    do. Full width, because a menu is not a toolbar. */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: dur.base,
                    delay: stagger.base + menuLinks.length * stagger.tight,
                    ease: ease.aura,
                  }}
                  className="mt-8 border-t border-hair pt-8"
                >
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className={`${btnSolid} w-full`}
                  >
                    {cta("consultation")}
                  </Link>
                  {/* Upward, because this is the last thing in a column that
                      scrolls: a menu opening downward from here would be laid
                      out past the bottom of its own scroll container on any
                      handset where the list is already taller than the screen. */}
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
