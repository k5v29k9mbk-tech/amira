import { getTranslations } from "next-intl/server";
import type { Program } from "@/lib/programs";
import { Reveal } from "./Reveal";

/**
 * What you will master: the outcome lines a programme publishes.
 *
 * Gated exactly like the curriculum, and for the same reason. The academy has
 * supplied no per-discipline outcomes, so `program.masters` is undefined for all
 * six and this renders nothing. Set the count in `programs.ts` and add
 * `programs.masters.<slug>.0` upward to the four catalogues, and the section
 * appears.
 *
 * WHY IT IS A COUNT RATHER THAN AN ARRAY OF STRINGS HERE. The strings belong in
 * the message catalogues, where they are translated and where the test suite can
 * see them; if they lived in `programs.ts` they would exist in one language and
 * the other three would be a job somebody remembered to do. The count is the
 * contract between the two files.
 *
 * The shape is a numbered list at reading size, two columns from md. Outcomes
 * are short lines and a single column of them down a 1600px field is a very
 * thin ribbon of text.
 */
export async function Mastery({ program }: { program: Program }) {
  if (!program.masters) return null;

  const t = await getTranslations("programs");

  return (
    <ol className="mt-12 grid border-t border-hair md:mt-16 md:grid-cols-2 md:gap-x-16 lg:gap-x-24">
      {Array.from({ length: program.masters }, (_, i) => (
        <Reveal
          as="li"
          key={i}
          delay={i * 0.04}
          className="flex items-baseline gap-5 border-b border-hair py-5 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0"
        >
          <span className="label shrink-0 font-mono text-bronze-ink">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-[16px] leading-relaxed text-espresso">
            {t(`masters.${program.slug}.${i}`)}
          </span>
        </Reveal>
      ))}
    </ol>
  );
}
