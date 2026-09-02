import { Reveal } from "@/components/Reveal";
import { sectionPad, shell } from "@/lib/ui";

/**
 * A written statement, in the page's own two-column shape.
 *
 * ONE COMPONENT FOR THREE SECTIONS, BECAUSE THEY ARE ONE SHAPE. What this page
 * gained is three short pieces of argument -- what the masterclass is beyond a
 * technique course, who it is open to, and what PhiBrows actually is -- and all
 * three are a heading and two or three sentences. Written as three files they
 * would have been three slightly different sets of measurements for the same
 * object, which is how a page stops looking designed; written once they are the
 * same block three times, on three grounds.
 *
 * THE HEADING IS THE SYLLABUS SECTION'S, TO THE PIXEL: the same display clamp,
 * uppercase, over the same 88px bronze hairline the hero opens with and
 * `EntryMastery` repeats. Nothing here introduces a size, a colour or a rule the
 * page did not already carry.
 *
 * THE GROUND IS THE ONLY VARIABLE, and it is what paces the page: ivory carries
 * the argument, paper marks a turn, night is reserved for the two places the
 * page makes a claim rather than a description. `text-mute` on the light grounds
 * and `text-mute-dark` on the dark one are the site's own body inks for each,
 * at 5.6:1 and 6.2:1.
 */
export function EntryStatement({
  ground,
  title,
  lead,
  body,
}: {
  ground: "ivory" | "paper" | "night";
  title: string;
  lead?: string;
  body: string[];
}) {
  const dark = ground === "night";
  const grounds = {
    ivory: "bg-ivory",
    paper: "bg-paper",
    night: "bg-night text-ivory",
  } as const;

  return (
    <section className={`${sectionPad} ${grounds[ground]}`}>
      <div className={`${shell} grid gap-10 lg:grid-cols-12 lg:gap-16`}>
        <Reveal className="lg:col-span-5">
          <h2 className="display text-[clamp(1.75rem,3.6vw,3rem)] uppercase">{title}</h2>
          <div
            aria-hidden
            className={`mt-7 h-px w-[88px] md:mt-9 ${dark ? "bg-bronze-hi" : "bg-bronze"}`}
          />
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          {/* The lead is the one line a reader has to leave with, so it is set
              in the tracked caps the page uses for a fact rather than as the
              first sentence of a paragraph. */}
          {lead ? (
            <Reveal
              as="p"
              className={`entry-cap text-[0.8125rem] leading-[1.6] md:text-[0.875rem] ${
                dark ? "text-bronze-hi" : "text-bronze-ink"
              }`}
            >
              {lead}
            </Reveal>
          ) : null}

          {body.map((line, i) => (
            <Reveal
              as="p"
              key={line}
              delay={i * 0.06}
              className={`max-w-[46ch] text-[15px] leading-relaxed md:text-[16px] ${
                lead || i > 0 ? "mt-6" : ""
              } ${dark ? "text-mute-dark" : "text-mute"}`}
            >
              {line}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
