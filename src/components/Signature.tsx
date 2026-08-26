import { getTranslations } from "next-intl/server";
import { displayChapter, shell } from "@/lib/ui";
import { stagger } from "@/lib/motion";
import { MaskReveal } from "./MaskReveal";
import { Reveal } from "./Reveal";

/**
 * The signature: the hand-off from the opening screen to her story.
 *
 * WHAT IT IS FOR, AND WHY IT IS NOT A SECOND HERO. The photograph above carries
 * no type at all: no scrim, no caption, no credit. That was deliberate, because
 * a dark band across a warm beige portrait to make room for two lines of text
 * costs the picture more than the lines are worth. So her name is set here
 * instead, on the ivory the hero already stands on, immediately under it.
 *
 * That makes this the first and only place on the homepage where her name is
 * typeset, which is what stops it reading as a repeat. It is the caption to the
 * photograph, moved off the photograph.
 *
 * AND IT IS A TRANSITION RATHER THAN A PLAQUE, which is a different thing and
 * turns on one line of copy. A name and a role under a portrait is a museum
 * label: correct, closed, and it tells a reader she has finished. The line
 * beside it is `instructor.mission`, the academy's own statement of what Amira
 * is for, and it was in all four catalogues without being rendered anywhere.
 * It moves the reader from who she is to what she does, which is the question
 * the rest of the page answers.
 *
 * THE SHAPE. One hairline across the field, her name at chapter size on the
 * inline start, the mission set small in the muted grade across the field from
 * it. Nothing is centred and nothing is boxed: an asymmetric pair under a rule
 * is how an editorial page signs a plate, and it is the quietest possible way
 * to change subject.
 *
 * THE RHYTHM. A short head and a long tail, and the head is not optional. With
 * no top padding this section's hairline lands within a pixel or two of the
 * hero's bottom edge, where the photograph ends: two horizontal lines at the
 * same height read as one thick seam rather than as the end of one thing and
 * the start of another. 64px at desktop is enough for the rule to be its own
 * object. The tail is the full section measure, because what follows is the
 * credentials act on the near-black ground and that change of ground has to
 * read as a chapter mark rather than as a collision.
 */
export async function Signature() {
  const inst = await getTranslations("instructor");
  const t = await getTranslations("hero");

  return (
    <section className="bg-ivory pt-10 pb-16 md:pt-12 md:pb-20 lg:pt-16 lg:pb-28">
      <div className={shell}>
        <div className="grid gap-x-10 gap-y-6 border-t border-hair pt-8 md:pt-10 lg:grid-cols-12 lg:items-baseline">
          <div className="lg:col-span-5">
            <MaskReveal>
              <p className={`${displayChapter} leading-none`}>{inst("title")}</p>
            </MaskReveal>
            <Reveal delay={stagger.line}>
              <p className="label mt-4 leading-[1.6] text-bronze-ink">
                {t("founderRole")}
              </p>
            </Reveal>
          </div>

          <Reveal delay={stagger.base} className="lg:col-span-6 lg:col-start-7">
            <p className="max-w-[54ch] text-[16px] leading-relaxed text-mute md:text-[17px]">
              {inst("mission")}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
