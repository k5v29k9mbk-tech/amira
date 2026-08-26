import { getTranslations } from "next-intl/server";
import { displaySection, shell } from "@/lib/ui";
import { stagger } from "@/lib/motion";
import { MaskReveal } from "./MaskReveal";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

/**
 * The credibility act: why this teaching is worth trusting, in words.
 *
 * THE FIGURES HAVE GONE BACK TO THE HERO, AND THIS SECTION IS WHAT IS LEFT.
 * Four figures used to stand here under a hairline. The opening screen is now
 * an editorial split with a masthead band in it, carrying the three the academy
 * leads with, so printing them again one screen later added nothing and read as
 * a page repeating itself.
 *
 * What is left is the half the hero cannot carry: the claim that this is taught
 * from inside a working practice, and the sentence about where the protocols
 * come from. Both are qualitative, both are checkable, and neither is a number.
 *
 * THIS IS AN INTERIM SHAPE. The credibility section is its own step in the
 * redesign and has not been rebuilt yet; what happened here was the removal of
 * a duplication the new hero created, not a redesign of the act. When it is
 * rebuilt, the thing to add is evidence the hero has no room for: her training,
 * the institute behind the academy, and the standards the teaching is held to.
 *
 * WHAT MAY BE PRINTED HERE, WHICH IS THE ONLY RULE THIS FILE HAS. Every claim
 * is quoted from the academy's own document. The line about international
 * masterclasses is what her own story says (`about.story.p3`) and is a claim
 * about what she attends, never about what she runs. If a future edit cannot
 * point at the source document, it does not belong in this section.
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

        {/* The sentence that used to qualify the figures now carries the
            section, so it is set at reading size against a hairline rather than
            as small print under a band. */}
        <Reveal delay={0.12}>
          <p className="mt-12 max-w-[64ch] border-t border-hair-dark pt-8 text-[16px] leading-relaxed text-mute-dark md:mt-16 md:pt-10 md:text-[17px]">
            {t("note")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
