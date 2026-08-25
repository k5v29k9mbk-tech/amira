import { getTranslations } from "next-intl/server";
import { displaySection, shell } from "@/lib/ui";
import { stagger } from "@/lib/motion";
import { MaskReveal } from "./MaskReveal";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

/**
 * The credentials band, and the first thing on the page that is checkable.
 *
 * WHY IT IS HERE AND NOT IN THE HERO. These four figures used to sit inside the
 * opening composition, between the supporting line and the two actions. That
 * put the whole argument for the academy on the first screen, which sounds like
 * a strength and reads as a brochure: a title card with a statistics table in
 * it is not a title card. The hero now carries a statement, a line and one
 * decision, and the evidence stands directly under it as a section of its own.
 *
 * Nothing about the figures changed in the move except the namespace they are
 * read from. `hero.facts.*` is still in the catalogues, still translated, and is
 * listed in `courses.test.ts` for exactly the reason that file gives: a key that
 * rots while unused is the regression the list exists to catch.
 *
 * WHAT MAY BE PRINTED HERE, WHICH IS THE ONLY RULE THIS FILE HAS. Every value
 * is quoted from the academy's own document and none is rounded up: eight years
 * and more in the industry, more than a hundred and fifty students trained,
 * three to four to a class, training held across Italy. The line under them
 * says Amira studies in international masterclasses, which is what her own
 * story says (`about.story.p3`) and is a claim about what she attends, never
 * about what she runs. If a future edit cannot point at the source document for
 * a figure, the figure does not belong in this section.
 *
 * THE GROUND, AND THE RHYTHM EITHER SIDE OF IT. Near-black, continuing the hero
 * and the signature above it, so the opening of the page is one dark movement in
 * three parts: the film, the name, the proof. The manifesto's ivory is then the
 * first change of ground on the page, and it falls on a change of subject.
 *
 * The head is the measure the manifesto used to carry directly under the
 * signature (64px at desktop), because this section is what now follows the
 * signature and the pair still has to read as one movement. The tail is the full
 * section rhythm, so the drop onto ivory is 176px: more than the 112 of a join
 * inside a pair, less than the 224 of a break between two acts, which is exactly
 * what this edge is. The dark opening ends here.
 */
const facts = ["years", "students", "classes", "reach"] as const;

export async function AuthorityStrip() {
  const t = await getTranslations("authority");
  const s = await getTranslations("sections");

  return (
    <section id="standard" className="scroll-mt-20 bg-espresso pt-10 pb-16 text-ivory md:pt-12 md:pb-20 lg:pt-16 lg:pb-28">
      <div className={shell}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-6">
            <MaskReveal>
              <SectionLabel n={1} tone="light">
                {s("authority")}
              </SectionLabel>
            </MaskReveal>
            <MaskReveal delay={stagger.base} className="mt-8">
              <h2 className={`${displaySection} max-w-[16ch]`}>{t("title")}</h2>
            </MaskReveal>
          </div>
          <Reveal delay={stagger.line} className="lg:col-span-5 lg:col-start-8 lg:pb-3">
            <p className="max-w-[48ch] text-[17px] leading-relaxed text-mute-dark">
              {t("sub")}
            </p>
          </Reveal>
        </div>

        {/* Four figures on one baseline, closed top and bottom by a hairline.
            The masthead device: a rule above and a rule below and no sides,
            which is how a magazine sets a row of figures and is the opposite of
            four cards.

            Two columns on a phone rather than four. At 390px a quarter of the
            field is 78px, and "Years in the industry" set in tracked small caps
            does not fit it in any of the four languages; halved, each figure has
            168px and the row holds from 320 up. `text-balance` on the labels is
            what keeps the four breaking evenly rather than one of them dropping
            a single word onto a second line. */}
        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 border-y border-hair-dark py-10 md:mt-16 md:grid-cols-4 md:gap-x-10 md:py-12">
          {facts.map((k, i) => (
            <Reveal key={k} delay={i * 0.06} className="flex flex-col gap-2.5">
              <dt className="display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-none text-ivory">
                {t(`items.${k}.value`)}
              </dt>
              <dd className="label text-balance leading-[1.5] text-mute-dark">
                {t(`items.${k}.label`)}
              </dd>
            </Reveal>
          ))}
        </dl>

        {/* The one sentence under the band, held to a reading measure and set
            in the muted grade: it qualifies the figures rather than adding a
            fifth. */}
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-[58ch] text-[15px] leading-relaxed text-mute-dark md:mt-10">
            {t("note")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
