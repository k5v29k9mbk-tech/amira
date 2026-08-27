import { getTranslations } from "next-intl/server";
import { displayRow } from "@/lib/ui";
import { Reveal } from "./Reveal";

/**
 * The two levels, side by side, answering the same five questions each.
 *
 * WHAT THIS REPLACED, AND WHY THE SHAPE CHANGED RATHER THAN THE COPY. The two
 * levels used to be two numbered list items, each carrying a forty-word
 * paragraph. Every claim in them was correct and approved, and the block still
 * did not work: a reader deciding which level was hers had to read both
 * paragraphs end to end and hold them in her head to compare, because the two
 * texts answered the same questions in a different order and with different
 * words. The one decision this section exists to help her make was the one it
 * made hardest.
 *
 * Five rows, asked of both levels in the same order, does the comparison in the
 * layout instead. She reads across a row rather than down a paragraph: "no
 * experience" against "an established practice", "build fundamentals" against
 * "refine technique". That is the whole change. The content is the same content
 * redistributed, which is also the rule the catalogue is held to: nothing here
 * is a claim the academy has not already approved and shipped.
 *
 * WHY IT IS NOT A CARD, ON A SITE THAT HAS NO CARDS. The brief asked for cards,
 * and a card here would be the first bordered, padded, filled box on the whole
 * site: the system's own note in `lib/ui.ts` is that nothing is a card, a pill
 * or a glow, and hierarchy is carried by type size, ground colour and one-pixel
 * hairlines. So the pair is built from what the system already owns. Each level
 * is a column under its own hairline, with a rule between them from the width
 * the columns actually sit side by side. It reads as two panels of one document
 * rather than two boxes on a page, and it is the same construction the key-
 * information strip above it uses, which is the point.
 *
 * THE ROW LABELS ARE THE COMPARISON, so they are set in the muted grade at label
 * size and repeat identically in both columns. A label that varied between the
 * two columns would break the horizontal read, which is the only thing this
 * layout is for.
 *
 * `md:` IS WHERE THE PAIR GOES SIDE BY SIDE, and below it the two levels stack
 * with the base level first. Stacked, the horizontal comparison is gone and the
 * labels are doing ordinary work again: they say what each line is, which is
 * what a phone needs from them. The divider is `md:` only for the same reason:
 * a vertical rule between two stacked columns is a line down the middle of
 * nothing.
 */
export async function LevelCards() {
  const t = await getTranslations("programs");

  /* The five questions, in the order a reader asks them. The array is the
     contract: both columns iterate it, so a row cannot exist on one level and
     not the other, and the horizontal read cannot silently break by someone
     adding a line to one column. */
  const rows = ["for", "experience", "goal", "practice", "outcome"] as const;
  const levels = [
    { key: "base", label: t("forWho.baseLabel") },
    { key: "advanced", label: t("forWho.advancedLabel") },
  ] as const;

  return (
    <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:gap-x-16">
      {levels.map((level, i) => (
        <Reveal
          key={level.key}
          delay={i * 0.08}
          /* The rule belongs to the second column and is drawn on its inline
             start, so there is no trailing divider after the last column and
             nothing to special-case. `ms-` rather than `ml-`, and `ps-` rather
             than `pl-`, so it lands on the correct side in Arabic. */
          className={
            i === 1
              ? "md:border-s md:border-hair md:ps-10 lg:ps-16"
              : undefined
          }
        >
          <div className="flex items-baseline gap-4">
            <span className="label font-mono text-bronze-ink">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className={displayRow}>{level.label}</h3>
          </div>

          {/* Label above value, under one hairline, the same construction as
              `KeyInfo`. No borders around the cells: a bordered grid of five
              facts is a spec table, and the same five under a single rule is
              the practical strip a printed prospectus sets. */}
          <dl className="mt-8 border-t border-hair pt-8">
            {rows.map((row) => (
              <div key={row} className="mt-6 first:mt-0">
                <dt className="label text-mute">{t(`levels.labels.${row}`)}</dt>
                <dd className="mt-2 max-w-[40ch] text-[16px] leading-relaxed text-espresso">
                  {t(`levels.${level.key}.${row}`)}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      ))}
    </div>
  );
}
