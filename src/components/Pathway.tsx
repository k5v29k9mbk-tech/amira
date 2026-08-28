import { getTranslations } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { publishedTiers } from "@/lib/pathway";
import { arrow, bodySmall, displayChapter, linkRule } from "@/lib/ui";
import { stagger } from "@/lib/motion";
import { Reveal } from "./Reveal";

/**
 * The educational path: the levels a student moves between, drawn once.
 *
 * WHAT THIS SECTION IS ARGUING. The academy teaches six disciplines and teaches
 * each of them twice, at base and at advanced level. That was stated in the FAQ
 * and nowhere else, so a visitor met six names and had no way to see that each
 * is entered at one of two heights, or to work out which height was hers. A
 * catalogue answers "what is taught"; this answers "where do I come in", which
 * is the question an artist who already works actually arrives with.
 *
 * IT RENDERS WHAT `pathway.ts` PUBLISHES, AND NOTHING ELSE. The list comes from
 * `publishedTiers`, which is the filtered export: a tier the academy has not
 * confirmed cannot reach this component at all, so there is no state in which a
 * hidden tier is one CSS mistake away from being visible. Two are live today.
 * If Amira confirms the masterclass or the private training, the boolean in
 * that file flips and this section grows a row with its copy already
 * translated, which is why the layout below is written for a variable count
 * rather than for two.
 *
 * THE SHAPE. Numbered rows under one hairline, not cards. A ladder is a
 * sequence and cards are a menu: the whole point of the section is that these
 * are heights of the same thing in order, and four boxes side by side say the
 * opposite. Each row is name, level, who it is for, and what it holds, set
 * across the field so the eye reads down the names and across only when it
 * stops at one.
 *
 * `grid-cols-12` with explicit starts rather than a three-column track: the
 * name needs a short measure and the body a long one, and a 4/8 split with the
 * level tucked under the name is what keeps the two from setting to the same
 * width and reading as two paragraphs.
 */
export async function Pathway() {
  const t = await getTranslations("pathway");
  const c = await getTranslations("cta");

  return (
    <ol className="mt-12 border-t border-hair md:mt-16">
      {publishedTiers.map((tier, i) => (
        <Reveal
          as="li"
          key={tier.key}
          delay={i * stagger.tight}
          className="grid gap-x-10 gap-y-5 border-b border-hair py-10 md:grid-cols-12 md:py-14"
        >
          {/* The figure files the tier; the level qualifies it. Both are small
              caps, so neither competes with the name under them. */}
          <div className="md:col-span-4">
            <div className="flex items-baseline gap-4">
              <span className="label font-mono text-bronze-ink">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="label text-mute">
                {t("levelLabel")} · {t(`tiers.${tier.key}.level`)}
              </span>
            </div>

            {/* The tier names are the one place on this page where an English
                product name is printed inside an Italian, French or Arabic
                sentence, and that is deliberate: "Aura Foundations" is a name
                rather than a phrase, and a name that translates is a different
                product in every market. The Arabic catalogue keeps the Latin
                setting for the two Aura tiers and translates the private one,
                which is a description rather than a name. */}
            <h3 className={`${displayChapter} mt-4`}>{t(`tiers.${tier.key}.name`)}</h3>

            <p className={`mt-3 max-w-[34ch] ${bodySmall} text-espresso`}>
              {t(`tiers.${tier.key}.for`)}
            </p>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <p className="max-w-[56ch] text-[16px] leading-relaxed text-mute">
              {t(`tiers.${tier.key}.body`)}
            </p>
            {/* THE ACTION IS GONE FROM THE TWO PUBLISHED TIERS, and it is the
                page's order that took it rather than a change of mind about
                the ladder.

                Both of them carried "scopri i corsi" pointing at /courses. That
                was right while this block sat four screens above the catalogue;
                it is noise now that the catalogue is the very next act, because
                the reader met the same words twice inside one screen, sending
                her to a page she was about to arrive at by scrolling. Two links
                to the place you are already going is not a choice, it is a
                stutter.

                A tier that points somewhere the next act does not go keeps its
                action, which is why this is a condition rather than a deletion:
                the masterclass and the private path are built and switched off
                in `lib/pathway.ts`, they lead to /contact, and the day either is
                published the enquiry is the only way into it. `cta.info` is the
                house label for that intention, and it is the one this row wanted
                all along. */}
            {tier.href === "/courses" ? null : (
              <Link href={tier.href} className={`${linkRule} mt-6`}>
                {c("info")}
                <ArrowRight size={14} weight="light" className={`flip-x ${arrow}`} />
              </Link>
            )}
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
