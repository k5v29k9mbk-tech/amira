"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Monogram } from "./Wordmark";
import { brand } from "@/lib/studio";
import { btnPrimary, shell } from "@/lib/ui";

export function Nav() {
  const t = useTranslations("nav");
  // The header action is the booking action, same as the hero primary.
  const book = useTranslations("hero");
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const [section, setSection] = useState("");

  /**
   * Scroll spy. Watches the sections the nav points at and reports whichever
   * one owns the upper third of the viewport, so the menu tracks reading
   * position rather than only route.
   *
   * IntersectionObserver rather than a scroll handler: the browser does the
   * work off the main thread and nothing runs per frame.
   */
  useEffect(() => {
    if (pathname !== "/") return;
    const ids = ["method", "students", "gallery", "faq", "contact"];
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean) as Element[];
    if (!nodes.length) return;

    const seen = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.intersectionRatio));
        const best = [...seen.entries()]
          .filter(([, r]) => r > 0)
          .sort((a, b) => b[1] - a[1])[0];
        setSection(best ? best[0] : "");
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [pathname]);

  /**
   * Marks what the visitor is looking at. Whole routes match on pathname; the
   * in-page anchors match on the scroll spy. Only routes get aria-current,
   * since a section is not a separate location.
   */
  const isRoute = (href: string) =>
    href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href);

  const current = (href: string) =>
    href.includes("#") ? pathname === "/" && href.endsWith(`#${section}`) : isRoute(href);

  // Motivated: the bar earns a background only once it overlaps content.
  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 24));

  const links = [
    { href: "/", label: t("home") },
    { href: "/courses", label: t("courses") },
    { href: "/about", label: t("about") },
    { href: "/#method", label: t("method") },
    { href: "/#students", label: t("students") },
    { href: "/#gallery", label: t("gallery") },
    { href: "/#faq", label: t("faq") },
    { href: "/#contact", label: t("contact") },
  ] as const;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-line bg-ink/85 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className={`${shell} flex h-16 items-center justify-between gap-6 md:h-[72px]`}>
        <Link
          href="/"
          onClick={() => setOpen(false)}
          aria-label={brand.full}
          className="flex items-center gap-3"
        >
          {/* text-bone, not the gold: the bar sits over the hero photograph
              before it goes solid, and gold on ivory skin tones is ~2.4:1. */}
          <Monogram className="text-[26px] text-bone" />
          <span className="display text-[15px] tracking-[0.24em] text-bone uppercase">
            {brand.short}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isRoute(l.href) ? "page" : undefined}
              // Gold hairline draws in from the inline start on hover and stays
              // drawn on the section being read.
              className={`relative py-1 text-[11px] font-medium tracking-[0.18em] uppercase transition-colors duration-300 hover:text-accent-hi after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-[left] after:bg-accent after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:scale-x-100 rtl:after:origin-[right] ${
                current(l.href)
                  ? "text-accent-hi after:scale-x-100"
                  : "text-muted after:scale-x-0"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 xl:flex">
          <LocaleSwitcher />
          <Link
            href="/#contact"
            className={`${btnPrimary} px-6 py-3 shadow-[0_10px_26px_-12px_color-mix(in_srgb,var(--accent)_70%,transparent)]`}
          >
            {book("secondary")}
          </Link>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-label={t("menu")}
          onClick={() => setOpen((v) => !v)}
          className="p-2 text-bone xl:hidden"
        >
          {open ? <X size={22} weight="light" /> : <List size={22} weight="light" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-ink xl:hidden"
          >
            <div className={`${shell} flex flex-col gap-1 py-6`}>
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={isRoute(l.href) ? "page" : undefined}
                  className={`display border-b border-line py-3.5 text-xl ${
                    current(l.href) ? "text-accent-hi" : "text-bone"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-5 flex items-center gap-3">
                <Link
                  href="/#contact"
                  onClick={() => setOpen(false)}
                  className={`${btnPrimary} flex-1`}
                >
                  {book("secondary")}
                </Link>
                <LocaleSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
