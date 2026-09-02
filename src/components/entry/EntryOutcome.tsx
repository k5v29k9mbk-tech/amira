import { Check } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/Reveal";
import { sectionPad, shell } from "@/lib/ui";
import type { EntrySections } from "@/lib/entry";

/**
 * What an artist leaves with: four sentences, then the list of what is in the
 * hand rather than in the head.
 *
 * THE TWO HALVES ARE DIFFERENT KINDS OF THING AND ARE SET DIFFERENTLY. The four
 * lines are the outcome and are set in the display serif, because they are the
 * page's own summary of its argument. The eight items under them are inventory
 * -- a kit, a certificate, a logo -- and are set in the tracked caps this page
 * uses for a fact. Setting inventory in the serif would have been the page
 * congratulating itself for handing over a folder.
 *
 * NOTHING IS LISTED HERE THAT THE ACADEMY HAS NOT CONFIRMED. The list is the
 * confirmed one, and the three items that were proposed alongside it and are not
 * part of this package are absent rather than softened.
 */
export function EntryOutcome({ copy }: { copy: EntrySections["outcome"] }) {
  return (
    <section className={`${sectionPad} bg-ivory`}>
      <div className={shell}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <h2 className="display text-[clamp(1.75rem,3.6vw,3rem)] uppercase">{copy.title}</h2>
            <div aria-hidden className="mt-7 h-px w-[88px] bg-bronze md:mt-9" />
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            {copy.lines.map((line, i) => (
              <Reveal
                as="p"
                key={line}
                delay={i * 0.06}
                className={`display max-w-[30ch] text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.35] text-espresso ${
                  i > 0 ? "mt-4" : ""
                }`}
              >
                {line}
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-14 border-t border-hair pt-10 md:mt-16 md:pt-12">
          <p className="label text-bronze-ink">{copy.itemsLabel}</p>
        </Reveal>

        <ul className="mt-8 grid gap-x-12 gap-y-0 sm:grid-cols-2 md:mt-10 lg:grid-cols-4">
          {copy.items.map((item, i) => (
            <Reveal
              as="li"
              key={item}
              delay={i * 0.04}
              className="flex items-center gap-4 border-b border-hair py-4 md:py-[1.15rem]"
            >
              <Check size={15} weight="bold" aria-hidden className="shrink-0 text-bronze-ink" />
              <span className="text-[15px] leading-snug text-espresso md:text-[16px]">{item}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
