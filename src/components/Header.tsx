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
 * The WhatsApp mark is the one thing in the bar that is not navigation, and it
 * is here because of what the phone layout used to be: the booking button is
 * `lg:flex`, so below that width the header offered a logo and the word Menu
 * and nothing else. The homepage runs to about twenty phone screens, and the
 * first action a reader could reach without opening the menu was in the closing
 * frame, at the bottom of all of it. One glyph at hairline weight fixes that
 * without becoming a floating button or a bar of chrome: it is the same mark,
 * the same line and the same prefilled message as every other WhatsApp action
 * on the site, and it disappears with them when no number is on file.
 */
export function Header() {
  const t = useTranslations("nav");
  const cta = useTranslations("hero");
  const contact = useTranslations("contact");
  const whatsappHref = whatsappLinkWith(contact("whatsappMessage"));
  const pathname = usePathname();
  const overHero = pathname === "/";

  const [open, setOpen] = useState(false);
  const [past, setPast] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setPast(y > (overHero ? window.innerHeight - 90 : 16));
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
   * The bar carries four. It is not an arbitrary four: at 1024px the shell
   * leaves 896px, and in French the four labels, the logo, the WhatsApp mark,
   * the language control and "Réservez votre place" already come to within a
   * few pixels of it. A fifth would push the bar into a wrap on the one
   * breakpoint where the desktop navigation first appears.
   *
   * The work is the fifth, and it goes where there is room for it: the phone
   * menu, which is a full screen, and the footer, which is a column. So the
   * page that proves the training is reachable from the navigation on a phone
   * and from the foot of every page, and the bar stays a bar.
   */
  const links = [
    { href: "/courses", label: t("courses") },
    { href: "/#method", label: t("method") },
    { href: "/about", label: t("about") },
    { href: "/faq", label: t("faq") },
  ] as const;

  const menuLinks = [
    { href: "/", label: t("home") },
    { href: "/courses", label: t("courses") },
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
        className={`${shell} flex h-[68px] items-center justify-between gap-8 text-espresso md:h-[76px]`}
      >
        {/* The monogram, not the full plate: the supplied lockup is stacked,
            and a 76px bar would set its ACADEMY line four pixels tall. */}
        <Link href="/" aria-label={brand.full}>
          <Logo variant="mark" tone="dark" priority className="h-9 w-auto md:h-10" sizes="80px" />
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
                isCurrent(l.href) ? "opacity-100 after:scale-x-100" : "opacity-70 after:scale-x-0"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 sm:gap-5 lg:gap-6">
          {/* Icon alone, at the same hairline weight as the arrows: a labelled
              button here would be a second call to action competing with the
              one beside it, and on a phone there is no room for two. The name
              is carried for assistive tech rather than printed. */}
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="-m-2.5 p-2.5 text-espresso transition-colors duration-300 hover:text-bronze-ink"
            >
              <WhatsappLogo size={21} weight="light" aria-hidden />
              <span className="sr-only">{contact("whatsapp")}</span>
            </a>
          ) : null}

          <div className="hidden items-center gap-6 lg:flex">
            <LocaleSwitcher tone="dark" />
          </div>

          {/* The booking action, from md rather than from lg.
              It used to appear only at lg, on the reasoning that a phone has no
              room for two actions beside the menu. That is true of a phone and
              was never true of a tablet, where the bar carries a logo, an icon
              and a menu word across 768px and had space for this all along.
              Below md it is not dropped, it moves: the menu overlay now closes
              on it, which is the one place a phone does have room. */}
          <Link
            href="/contact"
            className="label hidden border border-espresso bg-espresso px-5 py-3 text-ivory transition-colors duration-500 ease-[var(--ease-aura)] hover:border-bronze-ink hover:bg-bronze-ink md:inline-flex xl:px-6"
          >
            {cta("secondary")}
          </Link>

          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="label py-2 lg:hidden"
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
            <div className={`${shell} flex h-[68px] items-center justify-between`}>
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
                are not the same rule. Seven display-size lines and the action
                beneath them come to about 660px, and a 667px handset has 599
                once the bar is off it, so on the smallest phones this list is
                taller than the screen it is on. `justify-center` in a
                scrolling flex column is the trap here: the overflow goes off
                the *top*, where a scrollbar cannot reach it, and the first two
                items become unreachable. An `m-auto` child centres while there
                is room and resolves to zero when there is not, which is the
                behaviour this actually wants. */}
            <nav
              aria-label={brand.short}
              className={`${shell} flex h-[calc(100dvh-68px)] flex-col overflow-y-auto`}
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
                    {cta("secondary")}
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
