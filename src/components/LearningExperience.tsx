import { getTranslations } from "next-intl/server";
import { displayRow } from "@/lib/ui";
import { Reveal } from "./Reveal";

/**
 * What the room is like, in four claims, set under the photographs of it.
 *
 * THE PAIRING IS THE POINT. This is not a section of its own: it sits directly
 * beneath `FrameGallery`, which is the lesson, the mapping drawn by hand and
 * the demonstration on the model. The photographs show the room and these four
 * lines say what happens in it, and the two are worth much more together than
 * either is apart. A list of claims with no picture is a brochure; three
 * pictures with no claim is a mood board.
 *
 * WHY THESE FOUR AND NOT THE SEVEN THE BRIEF LISTED. Every one of them is
 * traceable: the class cap is the academy's own stated 3 to 4, the demonstration
 * and the guided practice are two of the four method stages, and the correction
 * is what `about.different.items.support` promises in the academy's own words
 * ("practical feedback, correction of your work"). "Professional environment"
 * and "technical feedback" were dropped as restatements of the other four
 * rather than as additional facts: four claims a reader can check beat seven
 * that overlap.
 *
 * THE SHAPE. A four-column band under one hairline, no rules between, so it
 * reads as one row of small print under the photographs rather than as four
 * boxes competing with them. Two columns on a phone, where four would give each
 * claim about eighty pixels of measure.
 */
const items = ["groups", "demo", "practice", "correction"] as const;

export async function LearningExperience() {
  const t = await getTranslations("experience");

  return (
    <div className="mt-16 border-t border-hair pt-10 md:mt-20 md:pt-12">
      <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
        {items.map((k, i) => (
          <Reveal as="li" key={k} delay={i * 0.06}>
            <span className="label font-mono text-bronze-ink">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className={`${displayRow} mt-4`}>{t(`items.${k}.title`)}</h3>
            <p className="mt-3 max-w-[38ch] text-[15px] leading-relaxed text-mute">
              {t(`items.${k}.body`)}
            </p>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
