import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { courses } from "@/lib/courses";
import {
  academy,
  instagramLink,
  legal,
  studio,
  tiktokLink,
  whatsappLinkWith,
} from "@/lib/studio";
import { bodySmall, shell } from "@/lib/ui";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";

/**
 * Near black, so the page ends on the same ground the closing frame sits on.
 *
 * FOUR EQUAL QUARTERS: the brand, the catalogue, the site, the company. It was
 * 4/3/2/3 of twelve, which read as four columns of four different widths and
 * put the legal block, the one column whose content cannot be reflowed or
 * shortened, in the second narrowest of them. At 834px that column was 159px
 * wide and "REA TE-221017" broke across two lines mid-number. Equal quarters
 * are 298px each at 1440 and the address, the company name and both registry
 * numbers each hold one line.
 *
 * WHY THE SPLIT ENGAGES AT lg AND NOT AT md. Four columns at 768 is 159px a
 * column, which is not a footer, it is four lists of wrapped fragments. Between
 * 640 and 1023 it is two columns of roughly 350px, which is the shape that band
 * actually wants, and the four-up starts at 1024 where there is room for it.
 *
 * THE HEADINGS NAME WHAT IS UNDER THEM. The third column used to be a single
 * list headed "Contatti" carrying Amira, Risultati, Domande, Contatti,
 * WhatsApp, Instagram and TikTok: four site pages filed under a heading that
 * describes the three channels beneath them. It is two groups, so it is two
 * headings and two nav landmarks.
 *
 * The VAT and REA numbers are not decoration: an Italian registered business
 * has to publish them, which is why they are here rather than on a page nobody
 * opens. Every value in that column comes from `lib/studio`, so nothing in it
 * is typed twice or guessed.
 */
export async function Footer() {
  const t = await getTranslations();
  const whatsappHref = whatsappLinkWith(t("contact.whatsappMessage"));
  const year = new Date().getFullYear();
  const link = "text-[15px] text-mute-dark transition-colors duration-300 hover:text-ivory";
  const heading = "label text-mute-dark";

  return (
    <footer className="no-print bg-night text-ivory">
      {/* The tail is shorter than the head, and deliberately. A footer opens
          against the section above it and closes against the bottom bar, which
          carries its own 28px and a hairline: 96 top and 96 bottom put 124px of
          empty ground under the last link and read as the page having stopped
          rather than ended. 80 closes it without crowding. The phone keeps the
          safe-area inset on top of its own measure, so a handset with a home
          indicator still clears it. */}
      <div
        className={`${shell} grid gap-12 pt-20 pb-[calc(4rem+env(safe-area-inset-bottom))] sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:pt-24 lg:pb-20`}
      >
        {/* THE BRAND, AND THE THREE PLACES YOU REACH IT.

            The channels sit under the mark rather than under the site links,
            and the reason is the shape of the block rather than taxonomy.
            Stacked under the navigation they made one 388px column against
            three of about 210, so the bottom right of the footer was empty
            ground and the eye read the void rather than the columns. Here the
            four quarters run roughly 345 / 250 / 215 / 205, which is a stair
            rather than a spike, and the quarter that was carrying a mark and
            two lines of type now carries its share.

            It is also the arrangement this kind of footer is usually set in:
            the mark, the one line that says what the business is, and how to
            speak to it. */}
        <div>
          {/* The monogram here too. The full plate is reserved for the two
              moments that are only the brand: the opening film and the wait
              between routes. */}
          <Logo variant="mark" tone="gold" className="h-14 w-auto" sizes="120px" />
          <p className={`mt-8 max-w-[32ch] ${bodySmall} text-mute-dark`}>
            {t("footer.tagline")}
          </p>

          <nav aria-label={t("footer.studio")} className="mt-10">
            <h2 className={heading}>{t("footer.studio")}</h2>
            <ul className="mt-6 grid gap-3">
              {whatsappHref && (
                <li>
                  <a href={whatsappHref} target="_blank" rel="noreferrer" className={link}>
                    {t("contact.whatsapp")}
                  </a>
                </li>
              )}
              <li>
                <a href={instagramLink} target="_blank" rel="noreferrer" className={link}>
                  {t("contact.instagram")}
                </a>
              </li>
              <li>
                <a href={tiktokLink} target="_blank" rel="noreferrer" className={link}>
                  {t("contact.tiktok")}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <nav aria-label={t("footer.explore")}>
          <h2 className={heading}>{t("footer.explore")}</h2>
          <ul className="mt-6 grid gap-3">
            {courses.map((c) => (
              <li key={c.slug}>
                {/* Each discipline's own page, not an anchor on the index.
                    The footer carries all six on every route, so these are the
                    site's most repeated internal links and the ones a crawler
                    follows most often: pointing them at six real pages rather
                    than six fragments of one is most of what makes the new
                    routes findable. */}
                <Link href={`/courses/${c.slug}`} className={link}>
                  {t(`catalog.courses.${c.slug}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* THE PAGES. Five site routes under the heading that describes them.

            This column used to be headed "Contatti" and carried Amira,
            Risultati, Domande, Contatti, WhatsApp, Instagram and TikTok: four
            pages of the site filed under a word that describes only the three
            channels at the bottom of the list. The channels are with the brand
            now and the heading names what is left.

            `/#method` and `/#work` are anchors on the homepage and resolve from
            any route: the bar has no room for both at 1024px, so the footer and
            the phone menu are how a reader who is not on the homepage reaches
            the method and the results. */}
        <nav aria-label={t("footer.nav")}>
          <h2 className={heading}>{t("footer.nav")}</h2>
          <ul className="mt-6 grid gap-3">
            <li>
              <Link href="/about" className={link}>
                {t("nav.about")}
              </Link>
            </li>
            <li>
              <Link href="/#method" className={link}>
                {t("nav.method")}
              </Link>
            </li>
            <li>
              <Link href="/#work" className={link}>
                {t("nav.work")}
              </Link>
            </li>
            <li>
              {/* `footer.faq` rather than `nav.faq`. The bar is tight enough
                  that its label has to be one word; a footer list is where the
                  question can be asked in full. */}
              <Link href="/faq" className={link}>
                {t("footer.faq")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className={link}>
                {t("nav.contact")}
              </Link>
            </li>
          </ul>
        </nav>

        {/* THE COMPANY, SET AS AN ADDRESS RATHER THAN AS A SENTENCE.

            The street and the town are two lines because that is how an address
            is written, and the two registry numbers are two lines because a
            single "P. IVA nnn · REA nnn" run is a 39-character string in a
            298px column: it fitted at 1440 and broke mid-number at 834, which
            is the one thing a published registry number may never do.

            Grouped rather than six flat rows: the pair of address lines and the
            pair of numbers each read as one item, so the block has four
            intervals instead of six and still prints the six lines. */}
        <div>
          <h2 className={heading}>{t("footer.legal")}</h2>
          <ul className={`mt-6 grid gap-3 ${bodySmall} text-mute-dark`}>
            <li className="text-ivory">{legal.company}</li>
            {/* `bdi` rather than a bare span, and it is for the Arabic route.
                A postal address is left-to-right content, so on an RTL page the
                bidi algorithm reorders a line that opens with a postcode and
                sets "64021 Giulianova (TE)" as "Giulianova (TE) 64021", which
                is not the address. `bdi` isolates the run and resolves its
                direction from its own first strong character, so the line reads
                correctly; unlike `dir="ltr"` it does not also drag the block to
                the left edge of a right-aligned column. On the Italian route it
                renders identically to the span it replaced. */}
            <li>
              <span className="block">
                <bdi>{academy.street}</bdi>
              </span>
              <span className="block">
                <bdi>
                  {academy.postcode} {academy.city} ({academy.province})
                </bdi>
              </span>
            </li>
            <li>
              <span className="block">
                {t("footer.vat")} <span dir="ltr">{legal.vat}</span>
              </span>
              <span className="block">
                {t("footer.rea")} <span dir="ltr">{legal.rea}</span>
              </span>
            </li>
            <li>
              <a href={`mailto:${studio.pec}`} className={`${link} break-all`}>
                <span dir="ltr">{studio.pec}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        className={`${shell} flex flex-col gap-4 border-t border-hair-dark py-7 text-[13px] text-mute-dark sm:flex-row sm:items-center sm:justify-between`}
      >
        <p>
          {year} {legal.company}. {t("footer.rights")}
        </p>
        <LocaleSwitcher tone="light" />
      </div>
    </footer>
  );
}
