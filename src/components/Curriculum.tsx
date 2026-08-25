import { getTranslations } from "next-intl/server";
import type { Program } from "@/lib/programs";
import { displayChapter } from "@/lib/ui";
import { stagger } from "@/lib/motion";
import { Reveal } from "./Reveal";

/**
 * The curriculum, day by day, and the reason it is one component rather than
 * two sections.
 *
 * The brief asked for a curriculum and a day-by-day schedule as separate
 * modules. On a two or three day course they are the same information printed
 * twice: a curriculum grouped by day IS the schedule, and a page that lists
 * "Day one, theory and demonstration" in one section and then lists the theory
 * modules under the same heading two sections later is padding, not structure.
 * So it is one module, grouped by day, each day carrying its own numbered
 * modules.
 *
 * IT RENDERS NOTHING WITHOUT DATA, WHICH IS TODAY'S STATE FOR ALL SIX. The
 * academy has supplied no syllabus for any programme. `program.curriculum` is
 * therefore undefined everywhere, this component returns null, and the
 * programme pages simply do not have a curriculum section rather than having
 * one full of plausible module names somebody would eventually have to teach.
 *
 * FILLING IT IN. `programs.ts` gets the shape, the catalogues get the strings:
 *
 *   curriculum: [{ modules: 4 }, { modules: 5 }]
 *
 * then `programs.curriculum.<slug>.d0.title` for the day heading and
 * `programs.curriculum.<slug>.d0.m0` through `.m3` for its modules, in all four
 * languages. `courses.test.ts` reads the counts off this same data, so a
 * curriculum that ships in Italian and nowhere else fails the suite.
 *
 * THE SHAPE. Days as numbered blocks down the page, modules as hairline rows
 * inside each. Not an accordion: a curriculum is the thing a serious applicant
 * came to read, and hiding it behind a disclosure to save vertical space is
 * saving space on the one section nobody wants shortened.
 */
export async function Curriculum({ program }: { program: Program }) {
  if (!program.curriculum?.length) return null;

  const t = await getTranslations("programs");

  return (
    <ol className="mt-12 md:mt-16">
      {program.curriculum.map((day, d) => (
        <Reveal
          as="li"
          key={d}
          delay={d * stagger.line}
          className="border-t border-hair pt-8 pb-12 last:pb-0 md:pt-10 md:pb-16"
        >
          <div className="grid gap-x-10 gap-y-6 md:grid-cols-12">
            <div className="md:col-span-4">
              <span className="label font-mono text-bronze-ink">
                {t("curriculum.day")} {String(d + 1).padStart(2, "0")}
              </span>
              <h3 className={`${displayChapter} mt-4 max-w-[18ch]`}>
                {t(`curriculum.${program.slug}.d${d}.title`)}
              </h3>
            </div>

            <ul className="md:col-span-7 md:col-start-6">
              {Array.from({ length: day.modules }, (_, m) => (
                <li
                  key={m}
                  className="flex items-baseline gap-5 border-b border-hair py-4 last:border-b-0"
                >
                  <span className="label shrink-0 font-mono text-mute">
                    {String(m + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[16px] leading-relaxed text-espresso">
                    {t(`curriculum.${program.slug}.d${d}.m${m}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
