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
 * Below md only. From md the header's own button is always on screen, so there
 * is no floating bar on a tablet or a laptop at all and nothing can be covered
 * by one: `md:hidden` is the whole of that guarantee, and it is measured rather
 * than assumed at 768, 900, 1024, 1180, 1280 and 1440.
 *
 * ITS HEIGHT IS TUNED AGAINST THE SITE'S OWN RHYTHM, which is the thing that
 * stops it covering anything on a phone either. Every section on the site closes
 * on `py-16`, 64px, at mobile. A bar taller than that will always have something
 * sitting under it when a section comes to rest at the bottom of the screen. At
 * 16px of vertical padding around a 45px control the bar was 77px, comfortably
 * over that line, and photographs were being clipped by it. At 8px it is 61,
 * which is inside the 64 the sections already reserve, so the clearance is the
 * layout's own and no section needs a special case for it.
 *
 * The control keeps its 45px height through all of that. The padding came off
 * the container, never off the button: 44px is the floor for a thumb and the
 * request is the one thing on a phone the whole page is asking a reader to
 * press. `items-stretch` keeps the WhatsApp square exactly as tall as it, so the
 * pair still reads as one object.
 *
 * `env(safe-area-inset-bottom)` is added to the bottom padding rather than to a
 * wrapper, so on a notched phone the bar sits above the home indicator instead
 * of under it, and on every other device the term resolves to zero and nothing
 * moves.
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

  /**
   * NOT RENDERED AT ALL FROM 768, rather than merely hidden there.
   *
   * `md:hidden` already took it off tablet and desktop and was measured doing
   * so: at 768, 1024 and 1440 the only fixed elements on the page are the header
   * and this, and this one computes to `display: none` at a box of 0x0. So it
   * covered nothing.
   *
   * It is unmounted as well because "hidden" and "not there" are different
   * promises, and only the second one is checkable by looking at the DOM. A node
   * that exists with `display: none` still answers a query, still shows up in an
   * accessibility tree walk, still appears in a screenshot diff tool's element
   * list, and still leaves a reader who has been told it is gone with something
   * to point at. Above 768 there is now no element.
   *
   * The check runs in an effect rather than during render, which is the rule the
   * whole motion layer is built on: the server has no viewport, so a width read
   * while rendering is a hydration mismatch. The first client render matches the
   * server exactly, and the bar is `display: none` and `opacity: 0` at that
   * moment anyway, so the removal is invisible.
   */
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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

  // After the hooks, never before: an early return above them would change the
  // hook order between the two renders and React would throw.
  if (wide) return null;

  return (
    <div
      className={`no-print pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] transition-opacity duration-700 ease-[var(--ease-aura)] md:hidden ${
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
          {t("consultation")}
        </Link>
      </div>
    </div>
  );
}
