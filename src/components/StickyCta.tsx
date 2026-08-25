"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { WhatsappLogo } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { whatsappLink } from "@/lib/studio";
import { btnCompact } from "@/lib/ui";

/**
 * The phone's standing action, and the reason it exists.
 *
 * On a laptop the two actions are never further than a glance away: the bar at
 * the top of the screen carries the availability button and the WhatsApp mark
 * on every section of every page. On a phone that bar carries a logo, a menu
 * word and an icon, and the buttons live in the hero — which means that from
 * the moment a reader scrolls past the first screen until she reaches the foot
 * of the page, seven acts later, there is nothing to press. The one visitor the
 * page is written for, the one who reads all of it, is the one it strands.
 *
 * TWO ACTIONS, NOT ONE, AND IN THIS ORDER. WhatsApp is the mark alone, on the
 * inline start; the request for a place takes the rest of the bar. That is the
 * site's CTA hierarchy in miniature and in the right order: the conversation is
 * the smaller commitment and is offered as an icon, the request is the larger
 * one and is offered as the button.
 *
 * THE VERB. "Request a seat", not "Book now" and not "Buy". There is no price
 * anywhere on this site, the class is capped at three or four, and Amira quotes
 * and confirms in a conversation. Asking for a place is what actually happens,
 * and it is also the more selective ask: a request can be declined, which is
 * what makes it read as an application to a school rather than a checkout.
 *
 * WHY IT IS NOT THERE FROM THE FIRST PIXEL. The hero already carries both
 * actions at full size. A bar that duplicates them over the top of the opening
 * composition is the single most template-like thing a premium site can do, and
 * on a 740px phone it would be covering the film. It appears after 120svh —
 * once the hero is behind the reader and the argument has started — and it
 * fades rather than slides, because a bar that flies in from the bottom edge is
 * an app pattern and this is a campaign.
 *
 * It hides itself again at the foot of the page: the closing act is an
 * invitation with its own actions, and a floating bar over a section that is
 * already asking the same question is one ask too many. `100svh` from the
 * bottom of the document is the trigger, which is the closing frame's own
 * height.
 *
 * Below md only. From md the header's own button is always on screen.
 *
 * Renders nothing while the academy has no number on file, exactly like every
 * other WhatsApp affordance on the site; the availability button stands alone
 * in that case rather than the bar disappearing, because the date is the ask
 * that does not depend on a channel.
 */
export function StickyCta() {
  const t = useTranslations("cta");
  const contact = useTranslations("contact");
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const sync = () => {
      const y = window.scrollY;
      const past = y > window.innerHeight * 1.2;
      const atFoot =
        y + window.innerHeight > document.documentElement.scrollHeight - window.innerHeight;
      setShown(past && !atFoot);
    };
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  return (
    <div
      className={`no-print pointer-events-none fixed inset-x-0 bottom-0 z-40 p-4 transition-opacity duration-700 ease-[var(--ease-aura)] md:hidden ${
        shown ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden={!shown}
    >
      <div
        className={`flex items-stretch gap-3 ${shown ? "pointer-events-auto" : ""}`}
      >
        {whatsappLink ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            tabIndex={shown ? 0 : -1}
            className="flex items-center justify-center border border-espresso bg-ivory px-4 text-espresso transition-colors duration-300 hover:bg-espresso hover:text-ivory"
          >
            <WhatsappLogo size={22} weight="light" aria-hidden />
            <span className="sr-only">{contact("whatsapp")}</span>
          </a>
        ) : null}

        <Link
          href="/contact"
          tabIndex={shown ? 0 : -1}
          className={`${btnCompact} flex-1 bg-espresso text-ivory hover:bg-bronze-ink`}
        >
          {t("requestSeat")}
        </Link>
      </div>
    </div>
  );
}
