"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { btnPrimary, shell } from "@/lib/ui";

export function Nav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { scrollY } = useScroll();

  // Motivated: the bar earns a background only once it overlaps content.
  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 24));

  const links = [
    { href: "/courses", label: t("courses") },
    { href: "/#method", label: t("method") },
    { href: "/#results", label: t("results") },
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
        <Link href="/" onClick={() => setOpen(false)} aria-label="Amira Bechini Masterclass">
          <span className="display text-[15px] tracking-[0.24em] text-bone uppercase">
            Amira Bechini
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[11px] font-medium tracking-[0.18em] text-muted uppercase transition-colors hover:text-accent-hi"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LocaleSwitcher />
          <Link
            href="/dashboard"
            className="text-[11px] font-medium tracking-[0.18em] text-muted uppercase hover:text-accent-hi"
          >
            {t("signIn")}
          </Link>
          <Link href="/courses" className={`${btnPrimary} px-5 py-2.5`}>
            {t("cta")}
          </Link>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-label={t("menu")}
          onClick={() => setOpen((v) => !v)}
          className="p-2 text-bone lg:hidden"
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
            className="overflow-hidden border-t border-line bg-ink lg:hidden"
          >
            <div className={`${shell} flex flex-col gap-1 py-6`}>
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="display border-b border-line py-3.5 text-xl text-bone"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="display border-b border-line py-3.5 text-xl text-bone"
              >
                {t("signIn")}
              </Link>
              <div className="mt-5 flex items-center gap-3">
                <Link
                  href="/courses"
                  onClick={() => setOpen(false)}
                  className={`${btnPrimary} flex-1`}
                >
                  {t("cta")}
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
