import { getTranslations } from "next-intl/server";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { whatsappLink } from "@/lib/studio";

/**
 * Always-on WhatsApp channel. Deliberately a server component: it has no state,
 * so it ships zero JavaScript.
 *
 * Renders nothing until the academy supplies a number. WhatsApp is one of the
 * two booking channels the academy publishes, but the number itself is missing,
 * and a button that opens wa.me with a guessed number is worse than no button.
 *
 * Placed opposite StickyCta, which owns the bottom-end corner. On phones that
 * bar is full width, so this sits above it rather than beside it.
 *
 * Rendered in the brand gold rather than WhatsApp green: the glyph already
 * carries the recognition, and a green disc would be the only colour on the
 * site outside the palette.
 */
export async function FloatingWhatsapp() {
  if (!whatsappLink) return null;
  const t = await getTranslations("contact");

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noreferrer"
      aria-label={t("whatsapp")}
      className="no-print fixed bottom-24 end-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-ink shadow-[0_8px_28px_color-mix(in_srgb,var(--accent)_45%,transparent)] transition-transform duration-300 hover:scale-105 active:translate-y-px md:bottom-8 md:start-8 md:end-auto md:h-15 md:w-15"
    >
      <WhatsappLogo size={26} weight="fill" />
    </a>
  );
}
