import { getTranslations } from "next-intl/server";
import { Reveal } from "./Reveal";

/**
 * What every student leaves with, as a plain list of eight.
 *
 * EVERY LINE IS QUOTED, NOT COMPOSED. The brief for this section suggested ten
 * items and four of them would have been inventions: course materials, updated
 * protocols, portfolio-ready work and a generic "professional guidance" are not
 * things the academy has told us it provides. What is here is what the official
 * document states, in its own terms: the class cap, the live model where the
 * course schedules one, correction and feedback from Amira, the certificate on
 * completion, support after the course, professional guidance once it has
 * ended, the kit on request, and the business teaching that runs alongside the
 * technique (`about.beyond`, which lists its eight subjects at length on
 * /about).
 *
 * The eighth is the one worth defending. It is the single largest thing that
 * separates this academy from a technique course and it was buried on an inner
 * page; naming it here, in one line, is the difference between "we teach a
 * treatment" and "we teach a profession", which is the whole repositioning in a
 * sentence.
 *
 * WHY THERE IS NO FEE ROW. The academy quotes privately. `courses.test.ts`
 * enforces that against all four catalogues, and a line reading "price on
 * request" would take up space to say what `catalog.privateNote` already says
 * properly two sections away.
 *
 * THE SHAPE. Two columns of hairline-separated rows, each row a rule and a
 * line: a checklist without checkmarks. Ticks and icons are what a features
 * table looks like, and this is a list of what is true.
 */
/**
 * Six rows, not the eight the strings hold, and the two that went were both
 * saying something the reader had already been told.
 *
 * `small` repeated the class size for the fourth time on the page: the hero
 * states it as a figure, the hero note explains why, and act 04 is built on it.
 * `guidance` and `support` were a near pair - professional guidance after the
 * course, and support after the course - and a list whose whole promise is that
 * nothing here is padding cannot afford two rows that answer the same question.
 * `support` carries it alone.
 *
 * Six also sets the list straight: the grid is two columns from md, so an even
 * count fills both and the last row does not leave a hole.
 *
 * Both strings stay in all four catalogues. This array is the only thing that
 * decides what renders.
 */
const items = [
  "model",
  "feedback",
  "certificate",
  "support",
  "kit",
  "business",
] as const;

export async function StudentReceives() {
  const t = await getTranslations("receive");

  return (
    <ul className="mt-12 grid border-t border-hair md:mt-16 md:grid-cols-2 md:gap-x-16 lg:gap-x-24">
      {items.map((k, i) => (
        <Reveal
          as="li"
          key={k}
          delay={i * 0.04}
          /* The hairline under the last row of each column would otherwise
             double up against the section's own edge on desktop, and on a phone
             the single column has one genuine last row. Both are handled by the
             border being on the item and the last item in each track dropping
             it, which `md:[&:nth-last-child(-n+2)]` does without needing to know
             the count. */
          className="flex items-baseline gap-5 border-b border-hair py-5 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0"
        >
          <span className="label shrink-0 font-mono text-bronze-ink">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-[16px] leading-relaxed text-espresso">
            {t(`items.${k}`)}
          </span>
        </Reveal>
      ))}
    </ul>
  );
}
