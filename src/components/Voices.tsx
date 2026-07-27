"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { shell, sectionTitle } from "@/lib/ui";

const keys = ["one", "two", "three", "four"] as const;

export function Voices() {
  const t = useTranslations("voices");
  const track = useRef<HTMLUListElement>(null);

  const nudge = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section id="voices" className="border-t border-line py-24 md:py-32">
      <div className={`${shell} flex flex-wrap items-end justify-between gap-6`}>
        <h2 className={sectionTitle}>{t("title")}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label={t("title")}
            className="rounded-full border border-accent/50 p-3.5 text-bone transition-colors hover:border-accent hover:bg-surface-2 hover:text-accent-hi"
          >
            <ArrowLeft size={18} weight="light" className="flip-x" />
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label={t("title")}
            className="rounded-full border border-accent/50 p-3.5 text-bone transition-colors hover:border-accent hover:bg-surface-2 hover:text-accent-hi"
          >
            <ArrowRight size={18} weight="light" className="flip-x" />
          </button>
        </div>
      </div>

      <ul
        ref={track}
        className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {keys.map((k) => (
          <li
            key={k}
            className="flex min-w-[85%] shrink-0 snap-start flex-col justify-between gap-8 rounded-[2px] border border-line bg-surface p-8 sm:min-w-[420px] md:p-10"
          >
            <p className="display text-xl leading-snug text-bone md:text-2xl">
              {`“${t(`items.${k}.quote`)}”`}
            </p>
            <div>
              <p className="text-sm font-medium tracking-[0.14em] text-bone uppercase">
                {t(`items.${k}.name`)}
              </p>
              <p className="mt-1.5 text-sm text-muted">{t(`items.${k}.role`)}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
