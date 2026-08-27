import { getTranslations } from "next-intl/server";
import { displayRow } from "@/lib/ui";
import { mentorshipMedia } from "@/lib/media";
import { MediaFrame } from "./MediaFrame";
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
 * THE SHAPE. The four claims sit under one hairline with no rules between them,
 * so they read as one block rather than as four boxes competing with the
 * photographs above. They used to run across all twelve columns in a single row;
 * they are a two-by-two block in the inline-end half now, because the
 * student-guidance photograph took the other half. Four one-line claims across
 * six columns are unreadable at any width, and two columns is what a phone
 * always gave them anyway, where four would leave each about eighty pixels of
 * measure.
 */
/**
 * Three claims, not the four the strings hold.
 *
 * `groups` - "da tre a quattro allieve" - was the fourth, and by the time a
 * reader reaches it the page has said the same thing twice already: the hero
 * carries it as a figure with a note under it, and this section's own
 * standfirst opens on "classe ristretta". A third statement of it, set as a
 * numbered claim beside three claims about what happens to your hands, read as
 * padding and pushed the one that matters - your work being corrected while you
 * do it - off the first row.
 *
 * `experience.items.groups.*` stays in all four catalogues. Nothing renders it
 * today; put it back in this array and it returns.
 */
const items = ["demo", "practice", "correction"] as const;

export async function LearningExperience() {
  const t = await getTranslations("experience");

  return (
    <div className="mt-16 border-t border-hair pt-10 md:mt-20 md:pt-12">
      {/* THE PHOTOGRAPH SITS BESIDE THE FOUR CLAIMS RATHER THAN ABOVE THEM.

          These four lines are the academy's promise about supervision: a class
          of three to four, a demonstration first, guided practice, and your own
          hand corrected. The photograph is that promise happening, and it is the
          only frame on the site where the student is the subject and Amira is
          the person watching. Beside the list it is evidence; above it, it would
          be a header.

          The list drops from four columns to two to make room. Four one-line
          claims across a six-column half are unreadable at any width, and the
          2x2 block against a landscape plate is the better composition anyway:
          the picture and the grid are close to the same height, so the row reads
          as one object.

          Landscape here, and the third distinct ratio on the page: square in act
          01, 4:5 in the method, 3:2 against the room. The crop is pulled up
          rather than centred because both faces sit in the top half of a square
          original; the numbers are at `mentorshipMedia`. On a phone it opens to
          4:3, which is the same crop with less height spent, so nothing that
          matters leaves the frame at any width. */}
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <Reveal className="lg:col-span-5">
          <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-[3/2]">
            <MediaFrame
              media={mentorshipMedia}
              alt={t("guidanceAlt")}
              sizes="(min-width: 1600px) 620px, (min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </Reveal>

        <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-6 lg:col-start-7 lg:gap-x-10">
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
    </div>
  );
}
