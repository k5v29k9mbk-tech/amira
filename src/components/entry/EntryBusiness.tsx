import { Reveal } from "@/components/Reveal";
import { sectionPad, shell } from "@/lib/ui";
import type { EntrySections } from "@/lib/entry";

/**
 * The professional half: what is taught beside the needle.
 *
 * IT IS ON THE NIGHT GROUND BECAUSE IT IS THE PAGE'S SECOND CLAIM. The dark
 * strip under the hero is the first -- four things this masterclass is -- and
 * this is the second: that the training does not stop at technique. Everything
 * between them is description on ivory and paper. Three dark bands would be a
 * pattern; two are a pair of claims with the argument set between them.
 *
 * IT IS GUIDANCE AND IT SAYS SO. The heading of the list is Amira's own framing
 * -- professional guidance shared during the masterclass -- rather than a
 * promise of a business programme, because a business programme is not what the
 * two days are. `EntryOutcome` names the same thing in the included list, in the
 * same words: business & positioning guidance. Nothing on this page upgrades it
 * to a course.
 *
 * THE LIST IS TWO COLUMNS OF TRACKED CAPS rather than sentences: these are the
 * subjects of the guidance, and the page already sets a subject as a tracked
 * line (the strip, the information bar, the kits). Sentences here would have
 * competed with the paragraph above them.
 */
export function EntryBusiness({ copy }: { copy: EntrySections["business"] }) {
  return (
    <section className={`${sectionPad} bg-night text-ivory`}>
      <div className={shell}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <h2 className="display text-[clamp(1.75rem,3.6vw,3rem)] uppercase leading-[1.06]">
              {copy.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <div aria-hidden className="mt-7 h-px w-[88px] bg-bronze-hi md:mt-9" />
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal
              as="p"
              className="max-w-[46ch] text-[15px] leading-relaxed text-mute-dark md:text-[16px]"
            >
              {copy.lede}
            </Reveal>
            <Reveal
              as="p"
              delay={0.06}
              className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-mute-dark md:text-[16px]"
            >
              {copy.itemsLede}
            </Reveal>
          </div>
        </div>

        <ul className="mt-12 grid gap-x-12 gap-y-0 border-t border-hair-dark md:mt-16 md:grid-cols-2">
          {copy.items.map((item, i) => (
            <Reveal
              as="li"
              key={item}
              delay={i * 0.04}
              className="border-b border-hair-dark py-5 md:py-6"
            >
              <span className="entry-cap text-[0.75rem] leading-[1.6] text-ivory md:text-[0.8125rem]">
                {item}
              </span>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-14 md:mt-16">
          {/* A wide measure, because the couplet is two complete sentences and
              each one has to hold its own line: at a narrow measure the first
              broke after "you a" and the pair stopped reading as a pair. */}
          <p className="display max-w-[52ch] text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.35]">
            {copy.closing.map((line, i) => (
              <span key={line} className={i === 1 ? "block text-bronze-hi" : "block"}>
                {line}
              </span>
            ))}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
