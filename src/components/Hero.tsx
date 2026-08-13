import { getTranslations } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { btnSolid, displayHero, linkRule, shell } from "@/lib/ui";
import { HeroPortrait } from "./HeroPortrait";
import { Stagger, StaggerItem } from "./Stagger";

/**
 * The three marks the academy can prove, in the order a visitor weighs them:
 * how long she has done this, how many she has taught, how many are in the
 * room. Values are quoted from the client's document, never rounded up here.
 */
const facts = ["years", "students", "classes"] as const;

/**
 * Opening composition.
 *
 * Two columns on a warm ivory field: the statement on the left, Amira in the
 * arch on the right, and a lot of air around both. The grid is bottom aligned,
 * so the primary action and the base of the frame sit on the same line, which
 * is what holds the two halves together.
 *
 * The first screen has to answer four questions before anything is scrolled:
 * who teaches, what is taught, on what evidence, and what to do next. The
 * eyebrow carries the name and the country, the portrait carries its own
 * caption so the face has a name attached to it, and one hairline-ruled line of
 * figures sits between the promise and the action. Nothing here is a card or a
 * badge: the figures are set in the display serif and their labels in the same
 * small caps as every other label on the site, so the row reads as a masthead
 * rather than as statistics.
 *
 * 100svh, not 100vh: the small viewport unit is the one that does not jump when
 * the mobile address bar collapses. It is a floor rather than a cap, so a long
 * translation lengthens the section instead of overflowing it.
 *
 * On phones the portrait leads and the copy follows, because the portrait is
 * the argument: this is a person, and she teaches what she practises.
 */
export async function Hero() {
  const t = await getTranslations("hero");
  const inst = await getTranslations("instructor");

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ivory pt-[68px] pb-16 md:pt-[76px] md:pb-20">
      {/* Ground. A soft beige wash across the upper field and a barely-there
          warm pool low on the inline end, so the ivory has depth rather than
          reading as flat paper. Decorative, never behind text at strength. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70%] bg-[linear-gradient(to_bottom,var(--aura-paper),transparent)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -end-[12%] top-[8%] -z-10 aspect-square w-[52%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--aura-bronze)_9%,transparent),transparent)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -start-[18%] bottom-[-10%] -z-10 aspect-square w-[42%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--aura-taupe)_18%,transparent),transparent)]"
      />

      <div
        className={`${shell} grid w-full items-end gap-7 py-8 sm:gap-10 md:py-10 lg:grid-cols-12 lg:gap-10 lg:py-0`}
      >
        <Stagger className="order-2 max-w-[42rem] lg:order-1 lg:col-span-6 lg:pb-2">
          <StaggerItem>
            {/* Three facts, one line: the academy, what it does, where. Wraps
                to two lines on a phone, so it carries its own leading. */}
            <p className="label leading-[1.8] text-bronze-ink">{t("eyebrow")}</p>
          </StaggerItem>

          <StaggerItem>
            <h1 className={`${displayHero} mt-6 max-w-[15ch] text-balance md:mt-8`}>
              <span className="block">{t("titleA")}</span>
              <span className="block">{t("titleB")}</span>
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-mute md:mt-8 md:text-[19px]">
              {t("sub")}
            </p>
          </StaggerItem>

          {/* Proof, on one line. A hairline above it and nothing around it: the
              figures are the evidence for the sentence above and the reason to
              press the button below, so they sit between the two. */}
          <StaggerItem>
            <dl className="mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-hair pt-6 md:mt-10 md:gap-x-10">
              {facts.map((k) => (
                <div key={k} className="flex items-baseline gap-2.5">
                  <dt className="display text-[1.375rem] leading-none text-espresso md:text-[1.5rem]">
                    {t(`facts.${k}.value`)}
                  </dt>
                  <dd className="label text-mute">{t(`facts.${k}.label`)}</dd>
                </div>
              ))}
            </dl>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
              <Link href="/courses" className={btnSolid}>
                {t("primary")}
              </Link>
              <Link href="/about" className={linkRule}>
                {t("meetAmira")}
                <ArrowRight size={14} weight="light" className="flip-x" />
              </Link>
            </div>
          </StaggerItem>
        </Stagger>

        {/* The columns stay even; the asymmetry is in where the frame sits
            inside its half, not in how many columns each half owns. Taking a
            column off the statement only forced the figures below onto two
            lines, and a masthead that wraps is worse than a symmetrical grid.
            On the widest screens the column is allowed to eat the page gutter,
            so the frame runs past the margin the rest of the page keeps. The
            margin is logical, so in Arabic the frame leans on the left edge
            exactly as it leans on the right in the other three. */}
        <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7 xl:-me-6 2xl:-me-12">
          <HeroPortrait alt={inst("portrait")} caption={t("founder")} />
        </div>
      </div>

      {/* Scroll cue: a hairline that fills and empties. No word, no icon. */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-1/2 hidden h-12 w-px -translate-x-1/2 overflow-hidden bg-espresso/15 lg:block"
      >
        <span className="block h-full w-full origin-top bg-espresso/60 motion-safe:animate-[aura-cue_3s_ease-in-out_infinite]" />
      </span>
    </section>
  );
}
