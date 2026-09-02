import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { btnSolidLight, sectionPad, shell } from "@/lib/ui";
import type { EntrySections } from "@/lib/entry";

/**
 * The close: the decision, then the ask.
 *
 * ONE SECTION RATHER THAN TWO, because they are one movement -- what these two
 * days are worth, and the single thing to do about it -- and a ground change
 * between them would have put a chapter mark inside a sentence. The hairline
 * between the halves is the same rule the information bar draws between facts.
 *
 * IT GOES TO /contact LIKE EVERY OTHER ACTION ON THIS PAGE. The academy takes
 * bookings in conversation and quotes privately; there is no checkout to send
 * anyone to, and the button says what happens next rather than pretending a
 * seat can be bought in a click.
 *
 * NO COUNTDOWN AND NO SEAT COUNTER. "Limited seats" is a fact the academy
 * states, and it is stated once, in the same words the information bar uses. A
 * number ticking down would be pressure rather than information, which is the
 * line the masterclass route's own note draws.
 */
export function EntryClose({ copy }: { copy: EntrySections["close"] }) {
  return (
    <section className={`${sectionPad} bg-night text-ivory`}>
      <div className={shell}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <h2 className="display text-[clamp(1.75rem,3.6vw,3rem)] uppercase leading-[1.06]">
              {copy.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <div aria-hidden className="mt-7 h-px w-[88px] bg-bronze-hi md:mt-9" />
          </Reveal>

          <div className="lg:col-span-6">
            {copy.body.map((line, i) => (
              <Reveal
                as="p"
                key={line}
                delay={i * 0.06}
                className={`max-w-[46ch] text-[15px] leading-relaxed text-mute-dark md:text-[16px] ${
                  i > 0 ? "mt-6" : ""
                }`}
              >
                {line}
              </Reveal>
            ))}

            {/* The place and the dates, restated as the last fact before the
                ask, in the display serif the hero states them in. */}
            <Reveal className="mt-10 md:mt-12">
              <p className="display text-[clamp(1.5rem,2.4vw,2.25rem)] uppercase leading-[1.1] text-bronze-hi">
                {copy.place.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </Reveal>

            <Reveal className="mt-8 flex flex-wrap gap-x-8 gap-y-3 md:mt-10">
              {copy.marks.map((mark) => (
                <span
                  key={mark}
                  className="entry-cap text-[0.6875rem] leading-none text-ivory md:text-[0.75rem]"
                >
                  {mark}
                </span>
              ))}
            </Reveal>
          </div>
        </div>

        <div className="mt-14 grid gap-10 border-t border-hair-dark pt-12 md:mt-16 md:pt-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <p className="display max-w-[18ch] text-[clamp(1.75rem,3.6vw,3rem)] uppercase leading-[1.06]">
              {copy.ctaTitle}
            </p>
          </Reveal>

          <div className="lg:col-span-6">
            {copy.ctaLines.map((line, i) => (
              <Reveal
                as="p"
                key={line}
                delay={i * 0.06}
                className={`max-w-[38ch] text-[15px] leading-relaxed text-mute-dark md:text-[16px] ${
                  i > 0 ? "mt-3" : ""
                }`}
              >
                {line}
              </Reveal>
            ))}

            <Reveal className="mt-10">
              <Link href="/contact" className={btnSolidLight}>
                {copy.cta}
              </Link>
              <p className="mt-5 max-w-[34ch] text-[14px] leading-relaxed text-mute-dark">
                {copy.ctaNote}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
