import { getTranslations } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { heroMedia } from "@/lib/media";
import { btnSolidLight, displayHero, linkRuleLight, shell } from "@/lib/ui";
import { MediaFrame } from "./MediaFrame";
import { Stagger, StaggerItem } from "./Stagger";

/**
 * Full-bleed opening frame.
 *
 * The composition is cinematic rather than centred: media edge to edge, copy in
 * the lower third, one primary action. Two scrims do the legibility work, a
 * light one at the top for the header and a deeper one at the bottom for the
 * copy, so no dark card is ever needed behind the type.
 *
 * 100svh, not 100vh: the small viewport unit is the one that does not jump when
 * the mobile address bar collapses.
 */
export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative h-[100svh] min-h-[34rem] w-full overflow-hidden bg-night">
      <MediaFrame
        media={heroMedia}
        priority
        sizes="100vw"
        className="absolute inset-0 h-full w-full"
        imageClassName="settle"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-night/55 to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-night/80 via-night/40 to-transparent"
      />

      <div
        className={`${shell} relative flex h-full flex-col justify-end pb-24 text-ivory md:pb-28`}
      >
        <Stagger className="max-w-[52rem]">
          <StaggerItem>
            <p className="label text-ivory/75">{t("eyebrow")}</p>
          </StaggerItem>

          <StaggerItem>
            <h1 className={`${displayHero} mt-7 max-w-[20ch] text-balance`}>
              <span className="block">{t("titleA")}</span>
              <span className="block">{t("titleB")}</span>
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-8 max-w-[46ch] text-[17px] leading-relaxed text-ivory/85 md:text-[19px]">
              {t("sub")}
            </p>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
              <Link href="/courses" className={btnSolidLight}>
                {t("primary")}
              </Link>
              <Link href="/about" className={linkRuleLight}>
                {t("meetAmira")}
                <ArrowRight size={14} weight="light" className="flip-x" />
              </Link>
            </div>
          </StaggerItem>
        </Stagger>
      </div>

      {/* Scroll cue: a hairline that fills and empties. No word, no icon. */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-1/2 hidden h-12 w-px -translate-x-1/2 overflow-hidden bg-ivory/25 md:block"
      >
        <span className="block h-full w-full origin-top bg-ivory motion-safe:animate-[aura-cue_3s_ease-in-out_infinite]" />
      </span>
    </section>
  );
}
