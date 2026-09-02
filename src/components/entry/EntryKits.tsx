import { Reveal } from "@/components/Reveal";
import { sectionPad, shell } from "@/lib/ui";
import type { EntrySections } from "@/lib/entry";

/**
 * The three kits, and the reason this section exists at all.
 *
 * THE SUPPORT DURATION IS A KIT FIGURE, NOT A MASTERCLASS FIGURE. The dark strip
 * under the hero used to promise six months of follow-up to everyone; it is two,
 * four or six depending on which kit an artist takes. So the strip now says
 * guided online support with no number on it, and the number lives here, beside
 * the tier it belongs to. One fact, in one place, correct.
 *
 * NO PRICE, AND NO "MOST POPULAR". The academy quotes privately -- the rule
 * `lib/programs.ts` records and `courses.test.ts` enforces -- so the three
 * columns compare what is IN a kit rather than what it costs, and none of them
 * is decorated to look like the one a reader should take. A highlighted middle
 * column is a pricing table's device, and this is not a pricing table.
 *
 * THE COLUMNS ARE DIVIDED RATHER THAN BOXED, which is the same construction the
 * dark strip and the information bar use: hairline rules between siblings on a
 * shared ground. Three cards would be the one shape `lib/ui.ts` opens by ruling
 * out.
 */
export function EntryKits({ copy }: { copy: EntrySections["kits"] }) {
  return (
    <section className={`${sectionPad} bg-paper`}>
      <div className={shell}>
        <Reveal className="flex flex-col items-center text-center">
          <h2 className="display text-[clamp(1.75rem,3.6vw,3rem)] uppercase">{copy.title}</h2>
          <div aria-hidden className="mt-7 h-px w-[88px] bg-bronze md:mt-9" />
        </Reveal>

        <div className="mt-12 grid divide-y divide-hair border-y border-hair md:mt-16 md:grid-cols-3 md:divide-x md:divide-y-0">
          {copy.tiers.map((tier, i) => (
            <Reveal
              key={tier.name}
              delay={i * 0.08}
              className="flex flex-col items-center px-0 py-10 text-center md:px-8 md:py-14"
            >
              <h3 className="entry-cap text-[0.8125rem] leading-snug text-espresso md:text-[0.875rem]">
                {tier.name}
              </h3>
              <p className="mt-5 text-[15px] leading-relaxed text-mute md:mt-6 md:text-[16px]">
                {tier.bonus}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-mute md:text-[16px]">
                {tier.support}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal
          as="p"
          className="mt-10 text-[15px] leading-relaxed text-mute md:mt-12 md:text-[16px]"
        >
          {copy.note}
        </Reveal>
      </div>
    </section>
  );
}
