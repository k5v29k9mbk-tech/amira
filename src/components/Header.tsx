"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";
import { brand } from "@/lib/studio";
import { shell } from "@/lib/ui";

/**
 * Header.
 *
 * Over the homepage hero it is type on the ivory field and nothing else: no
 * bar, no pill, no blur. It takes a ground and a hairline only once the hero is
 * behind the visitor. The type stays espresso throughout, because the hero is
 * a light composition rather than a dark photograph, so nothing has to change
 * colour mid-transition. Every other route starts solid.
 *
 * The phone menu is a full-screen ivory field with the navigation set at
 * display size, not a drawer.
 */
export function Header() {
  const t = useTranslations("nav");
  const cta = useTranslations("hero");
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
  const links = [
    { href: "/courses", label: t("courses") },
    { href: "/#method", label: t("method") },
    { href: "/about", label: t("about") },
    { href: "/faq", label: t("faq") },
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

        <nav aria-label={brand.short} className="hidden items-center gap-9 lg:flex">
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

        <div className="hidden items-center gap-6 lg:flex">
          <LocaleSwitcher tone="dark" />
          <Link
            href="/contact"
            className="label border border-espresso bg-espresso px-6 py-3 text-ivory transition-colors duration-500 ease-[var(--ease-aura)] hover:border-bronze-ink hover:bg-bronze-ink"
          >
            {cta("secondary")}
          </Link>
        </div>

        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="label py-2 lg:hidden"
        >
          {t("menu")}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
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

            <nav
              aria-label={brand.short}
              className={`${shell} flex h-[calc(100dvh-68px)] flex-col justify-center gap-2 pb-16`}
            >
              {[{ href: "/", label: t("home") }, ...links, { href: "/contact", label: t("contact") }].map(
                (l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.08 + i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="display block py-2 text-[clamp(2.25rem,11vw,3.75rem)]"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ),
              )}
              <div className="mt-10 border-t border-hair pt-8">
                <LocaleSwitcher tone="dark" />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
