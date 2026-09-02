import { CalendarBlank, MapPin, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { shell } from "@/lib/ui";
import { entryCopy } from "@/lib/entry";

/**
 * The practical bar: when, where, how many, and the one action that closes the
 * page.
 *
 * IT IS THE LAST THING BEFORE THE FOOTER AND IT IS THE ONLY PLACE THE THREE
 * FACTS ARE STATED IN PROSE. The hero says the date and the city as a
 * standfirst and the seal stamps "2 days" over the photograph, but neither is
 * readable as a fact: one is set as display furniture and the other is
 * `aria-hidden` decoration. This is where a visitor who has read the page and
 * is deciding finds the three things she still needs, written plainly.
 *
 * THE ACTION IS PART OF THE ROW, NOT BELOW IT. The reference puts the enrol
 * block in the fourth cell of the same row, which is the arrangement that makes
 * the bar read as a booking line rather than as three facts with a button after
 * them. It keeps that position down to `sm`, where it becomes the full-width
 * final cell — still the end of the same object.
 *
 * NOTHING IN THIS COMPONENT INVENTS A FACT. The date, the city and the class
 * size come from `lib/entry.ts`, which the note there records as supplied copy;
 * the academy's own standing figure for class size lives in `lib/studio.ts` as
 * `academy.maxStudents` and is deliberately NOT restated here, because this bar
 * is about one masterclass and that constant is about the academy's courses in
 * general. Two numbers for one thing is how a site ends up contradicting itself.
 */
export function EntryInfoBar({ locale }: { locale: string }) {
  const copy = entryCopy(locale);

  const items = [
    { icon: CalendarBlank, ...copy.info.date },
    { icon: MapPin, ...copy.info.place },
    { icon: UsersThree, ...copy.info.seats },
  ] as const;

  return (
    <section className="border-y border-hair bg-ivory">
      <div className={shell}>
        {/*
          `divide-x` between cells and `divide-y` while they wrap, which is the
          same device the dark band uses and for the same reason: the utility
          knows which sibling is first, so no cell has to be special-cased out of
          a leading rule. Both are logical in Tailwind v4, so the rules land on
          the correct sides in Arabic.

          The fourth cell is the action and it is `sm:col-span-2 lg:col-span-1`:
          at the two-column width a half-width button beside a half-width fact
          would read as a fourth fact, so it takes the whole final row instead.
        */}
        <div className="grid divide-y divide-hair sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
          {items.map((item) => (
            <Reveal
              key={item.title}
              className="flex items-start gap-4 px-0 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 sm:first:ps-0 lg:last:pe-0"
            >
              <item.icon
                size={26}
                weight="light"
                aria-hidden
                className="mt-0.5 shrink-0 text-bronze-ink"
              />
              <div>
                <h3 className="entry-cap text-[0.75rem] leading-snug text-espresso md:text-[0.8125rem]">
                  {item.title}
                </h3>
                <p className="mt-2.5 max-w-[28ch] text-[14px] leading-relaxed text-mute md:text-[15px]">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}

          <Reveal
            delay={0.12}
            className="flex items-center py-8 sm:col-span-2 sm:px-6 sm:py-10 lg:col-span-1 lg:px-8 lg:py-12 lg:pe-0"
          >
            {/*
              A two-line action: the verb, and the reassurance under it. It is
              one link, so the whole block is the target rather than only the
              first line — 44px is the floor for a thumb and this is comfortably
              over it at every width.

              Bronze, matching the masthead's action, because these two are the
              same ask at the two ends of the page and the near-black is spoken
              for by the hero's reserve button. The sub-line is ivory at 75%,
              which is 3.6:1 on this ground — under AA for body text, and it is
              not body text: it is a 10px tracked label repeating the promise the
              line above it already makes, so it is presentational. The line that
              carries the meaning is at full ivory and 4.6:1.
            */}
            <Link
              href="/contact"
              className="group/btn inline-flex w-full flex-col items-center justify-center gap-1.5 bg-bronze px-8 py-5 text-center text-ivory transition-colors duration-500 ease-[var(--ease-aura)] hover:bg-espresso active:translate-y-px"
            >
              <span className="label">{copy.info.ctaTitle}</span>
              <span className="entry-cap text-[0.625rem] text-ivory/75 [--cap-track:0.2em]">
                {copy.info.ctaSub}
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
