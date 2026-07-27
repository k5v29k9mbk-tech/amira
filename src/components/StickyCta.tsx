"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CalendarCheck } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";

/**
 * Always-available seat booking. Appears once the hero is behind you and steps
 * aside over the contact section, so it never covers the form it points at.
 * Full-width bar on phones, floating pill from md up.
 */
export function StickyCta() {
  const t = useTranslations("hero");
  const reduce = useReducedMotion();
  const [past, setPast] = useState(false);
  const [atTarget, setAtTarget] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("sticky-cta-after");
    const target = document.getElementById("contact");

    // IntersectionObserver rather than a scroll listener: no work per frame.
    const watch = (el: Element | null, set: (v: boolean) => void, showWhenGone = false) => {
      if (!el) return () => {};
      const io = new IntersectionObserver(
        ([entry]) => set(showWhenGone ? !entry.isIntersecting : entry.isIntersecting),
        { rootMargin: "0px 0px -20% 0px" },
      );
      io.observe(el);
      return () => io.disconnect();
    };

    const stop1 = watch(sentinel, setPast, true);
    const stop2 = watch(target, setAtTarget);
    return () => {
      stop1();
      stop2();
    };
  }, []);

  const visible = past && !atTarget;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="no-print fixed inset-x-0 bottom-0 z-40 md:inset-x-auto md:bottom-8 md:end-8"
        >
          <Link
            href="/#contact"
            className="flex items-center justify-center gap-3 border-t border-accent bg-bone px-7 py-4 text-[13px] font-medium tracking-[0.12em] text-ink uppercase shadow-[0_10px_40px_rgba(0,0,0,0.18)] transition-colors hover:bg-accent-hi hover:text-accent-ink md:rounded-[2px] md:border md:py-3.5"
          >
            <CalendarCheck size={18} weight="light" />
            {t("secondary")}
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
