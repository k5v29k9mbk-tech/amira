import { Reveal } from "@/components/Reveal";
import { sectionPad, shell } from "@/lib/ui";
import type { EntrySections } from "@/lib/entry";

/**
 * The two days, side by side.
 *
 * WHY TWO COLUMNS AND NOT ONE TIMELINE. The masterclass is not a schedule with
 * hours against it -- the academy does not publish one, and inventing one would
 * be inventing a fact -- it is two days with a different job each: the first
 * builds the foundation, the second puts it into practice. Two columns say that
 * in the layout itself, and they say it without claiming a single time.
 *
 * THE ROWS ARE THE SYLLABUS SECTION'S ROWS. Hairline `divide-y` between items,
 * the same 15/16px espresso, the same rhythm as `EntryMastery`'s list -- because
 * this IS that list, split into the order it is taught in. Two different row
 * treatments for the same kind of line would have read as two different pages.
 *
 * THE CLOSING COUPLET IS CENTRED, which is the one composition device this page
 * already uses for a line that belongs to the whole section rather than to a
 * column: the syllabus heading is centred for the same reason.
 */
export function EntryProgram({ copy }: { copy: EntrySections["program"] }) {
  return (
    <section id="programme" className={`${sectionPad} scroll-mt-[76px] bg-ivory md:scroll-mt-[88px]`}>
      <div className={shell}>
        <Reveal className="flex flex-col items-center text-center">
          <h2 className="display text-[clamp(1.75rem,3.6vw,3rem)] uppercase">{copy.title}</h2>
          <div aria-hidden className="mt-7 h-px w-[88px] bg-bronze md:mt-9" />
        </Reveal>

        <div className="mt-14 grid gap-12 md:mt-16 md:gap-16 lg:grid-cols-2 lg:gap-20">
          {copy.days.map((day, i) => (
            <Reveal key={day.label} delay={i * 0.08}>
              <p className="label text-bronze-ink">{day.label}</p>
              <h3 className="display mt-5 text-[clamp(1.5rem,2.4vw,2.25rem)] uppercase">
                {day.title}
              </h3>

              <ul className="mt-8 grid divide-y divide-hair border-y border-hair md:mt-10">
                {day.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-5 py-4 md:py-[1.15rem]"
                  >
                    {/* The bronze hairline dash the site uses between two facts,
                        at list scale: a bullet glyph is the one piece of
                        furniture `lib/ui.ts` rules out by name. */}
                    <span aria-hidden className="h-px w-4 shrink-0 translate-y-[-0.3em] bg-bronze/60" />
                    <span className="text-[15px] leading-snug text-espresso md:text-[16px]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 flex flex-col items-center text-center md:mt-16">
          <p className="display max-w-[34ch] text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.35] text-espresso">
            {copy.closing.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
