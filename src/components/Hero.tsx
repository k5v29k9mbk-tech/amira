import { getTranslations } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { btnSolid, displayHero, linkRule, shell } from "@/lib/ui";
import { HeroPortrait } from "./HeroPortrait";
import { Stagger, StaggerItem } from "./Stagger";

/**
 * Opening composition.
 *
 * Two columns on a warm ivory field: the statement on the left, Amira in the
 * arch on the right, and a lot of air around both. The grid is bottom aligned,
 * so the primary action and the base of the frame sit on the same line, which
 * is what holds the two halves together.
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
        className={`${shell} grid w-full items-end gap-12 py-10 lg:grid-cols-12 lg:gap-10 lg:py-0`}
      >
        <Stagger className="order-2 max-w-[38rem] lg:order-1 lg:col-span-6 lg:pb-2">
          <StaggerItem>
            <p className="label text-bronze-ink">{t("eyebrow")}</p>
          </StaggerItem>

          <StaggerItem>
            <h1 className={`${displayHero} mt-8 max-w-[13ch] text-balance`}>
              <span className="block">{t("titleA")}</span>
              <span className="block">{t("titleB")}</span>
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-8 max-w-[44ch] text-[17px] leading-relaxed text-mute md:text-[19px]">
              {t("sub")}
            </p>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
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

        <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
          <HeroPortrait alt={inst("portrait")} />
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
