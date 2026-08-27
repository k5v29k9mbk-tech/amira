"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { WhatsappLogo } from "@phosphor-icons/react";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";
import { brand, whatsappLinkWith } from "@/lib/studio";
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
 * monogram, the navigation, the WhatsApp mark, the language control and the
 * booking action, each through the tone its own component already had.
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
 * asked to be. So below md it is the monogram, the availability action set as a
 * champagne rule rather than a filled block, and Menu. From md the WhatsApp mark
 * returns and the action takes its box back; from lg the navigation and the
 * language control arrive and Menu goes.
 *
 * That is a reduction from what the phone used to carry, and the two things it
 * lost are both still on the phone. The WhatsApp mark is in `StickyCta`, which
 * stands at the foot of the page from the moment the hero is behind the reader,
 * with the same line and the same prefilled message; the hero's own second
 * action opens the same conversation at full size. The availability request is
 * in the bar at every width above 359px, in the menu overlay, and in the
 * standing bar beside WhatsApp.
 *
 * The reason for the reduction is in the arithmetic. Three marks and a monogram
 * inside 342 gutter-to-gutter pixels is not a bar with a lot in it, it is a bar
 * with more in it than fits, and what it did was crush the logo to five pixels.
 * A luxury house's phone header is the one surface where restraint is not a
 * style: it is the only way the brand mark gets to be the largest thing in it.
 */
export function Header() {
  const t = useTranslations("nav");
  const cta = useTranslations("cta");
  const contact = useTranslations("contact");
  const whatsappHref = whatsappLinkWith(contact("whatsappMessage"));
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
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
   * Five labels, and the fifth is conditional on there being room for it.
   *
   * The results were missing from the bar entirely, which is the wrong thing to
   * omit: they are the section that proves the training, and a visitor could
   * only reach them from the phone menu or the footer. They are in the bar now.
   *
   * But the arithmetic that kept them out is real. At 1024px the shell leaves
   * 896px, and the logo, the WhatsApp mark, the language control and the
   * availability button take about 470 of it before a single label is set;
   * five labels in French do not fit what is left. So the results link is held
   * back to xl, where there are 256px more. Between lg and xl the bar carries
   * the same four it always did, and the section stays reachable from the phone
   * menu and the footer, which is where it was reachable from before.
   */
  const links = [
    { href: "/courses", label: t("courses"), wide: false },
    { href: "/#method", label: t("method"), wide: false },
    { href: "/about", label: t("about"), wide: false },
    { href: "/#work", label: t("work"), wide: true },
    { href: "/faq", label: t("faq"), wide: false },
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
        className={`${shell} flex h-[72px] items-center justify-between gap-5 transition-colors duration-500 ease-[var(--ease-aura)] md:h-[76px] md:gap-8 ${
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

        {/* gap-6 at lg, gap-9 from xl. The wider gutter is right on a 1440px
            screen and is 108px the French labels do not have at 1024. */}
        <nav aria-label={brand.short} className="hidden items-center gap-6 lg:flex xl:gap-9">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isCurrent(l.href) ? "page" : undefined}
              className={`label relative py-1 transition-opacity duration-300 hover:opacity-100 after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-[left] after:bg-current after:transition-transform after:duration-500 after:ease-[var(--ease-aura)] hover:after:scale-x-100 rtl:after:origin-[right] ${
                l.wide ? "hidden xl:block" : ""
              } ${
                isCurrent(l.href) ? "opacity-100 after:scale-x-100" : "opacity-70 after:scale-x-0"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-6 md:gap-5 lg:gap-6">
          {/* Icon alone, at the same hairline weight as the arrows: a labelled
              button here would be a second call to action competing with the
              one beside it, and on a phone there is no room for two. The name
              is carried for assistive tech rather than printed.

              FROM md, AND NOT BEFORE. The reasoning that put this in the bar is
              recorded at the top of this file and was right about the problem:
              on a phone the header offered no action at all, and the first one a
              reader could reach was twenty screens down. It is the wrong fix. A
              phone bar has room for a brand and one decision, and this made
              three marks compete inside 342 pixels — a monogram, a glyph and a
              button — which is exactly the congestion a luxury bar is defined by
              not having. The gap it was filling is now filled properly, by
              `StickyCta`, which carries the same mark and the same prefilled
              message and appears once the hero is behind the reader; and the
              hero's own second action is a WhatsApp link at full size. Nothing
              was lost from the phone but the clutter. */}
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className={`-m-2.5 hidden p-2.5 transition-colors duration-300 md:block ${
                onFilm ? "hover:text-bronze-hi" : "text-espresso hover:text-bronze-ink"
              }`}
            >
              <WhatsappLogo size={21} weight="light" aria-hidden />
              <span className="sr-only">{contact("whatsapp")}</span>
            </a>
          ) : null}

          <div className="hidden items-center gap-6 lg:flex">
            <LocaleSwitcher tone={onFilm ? "light" : "dark"} />
          </div>

          {/* The booking action, in two registers on one element.
              From md it is the filled bar-scale button it has always been, in
              the ground pair that matches whatever is behind the bar. Below md
              it is the same words with the box taken off: label type in
              champagne with a hairline under it, carrying nothing but its own
              tracking.

              WHY THE BOX COMES OFF, AND WHY THE WORDS DO NOT. On a phone this
              rendered as a 212px slab of solid ivory sitting eight pixels from
              the top of the film — the brightest, heaviest, most saturated shape
              on the opening screen, above a headline set in 40px of Cormorant
              that it comfortably out-shouted. A luxury bar does not put its
              loudest object next to its brand mark. As a rule in champagne it
              still reads as the one thing in the bar that is an action rather
              than a destination, which is all it has to do here: the hero
              carries the same ask forty pixels below at full size, and the
              standing bar carries it for the rest of the page.

              WHY IT IS GATED AT 360 AND NOT AT ZERO. Measured, not guessed. The
              label is 162px in English and 178 in Italian at the house tracking,
              and a 320px screen has 272 between its gutters; with a 40px mark and
              a 40px Menu that leaves eleven pixels of gap in Italian. The action
              is not dropped there, it moves — the menu overlay closes on it and
              the standing bar carries it — which is the same arrangement the
              phone had before, one width narrower.

              The tone classes below md are the mobile register and every md:
              class is the button; a media variant sorts after its base in the
              generated sheet, so the desktop pair wins at md without either
              needing !important. What is deliberately absent is a second
              unprefixed display utility. `btnCompact` opens with `inline-flex`,
              and pairing it with a bare `hidden` is not the documented
              `hidden md:flex` idiom, it is two same-specificity display rules
              whose winner is decided by Tailwind's own emit order rather than by
              anything in this file: `inline-flex` came last, so `hidden` lost and
              this button rendered on every phone the site has ever been opened
              on. That is what crushed the logo. The shape is spelled out here
              rather than imported for exactly that reason. */}
          <Link
            href="/contact"
            className={`label group/btn relative hidden items-center justify-center gap-3 whitespace-nowrap py-4 transition-colors duration-500 ease-[var(--ease-aura)] after:absolute after:inset-x-0 after:bottom-3 after:h-px after:bg-current after:opacity-40 active:translate-y-px min-[360px]:inline-flex md:border md:px-5 md:py-3 md:after:hidden ${
              onFilm
                ? "text-bronze-hi md:border-ivory md:bg-ivory md:text-espresso md:hover:border-bronze-hi md:hover:bg-bronze-hi"
                : "text-bronze-ink md:border-espresso md:bg-espresso md:text-ivory md:hover:border-bronze-ink md:hover:bg-bronze-ink"
            }`}
          >
            {cta("consultation")}
          </Link>

          {/* 45px of hit area rather than 33, and the horizontal padding is
              pulled back off as negative margin so the word still sits flush to
              the page gutter. `-me-2` is the logical property, so the pull is on
              the correct side in Arabic. */}
          <button
            type="button"
            aria-expanded={open}
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
                  <div className="mt-8">
                    <LocaleSwitcher tone="dark" />
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
