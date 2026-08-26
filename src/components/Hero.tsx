import { getTranslations } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { arrow, btnSolid, displayHero, linkRule } from "@/lib/ui";
import { dur, heroBeat, stagger } from "@/lib/motion";
import { heroMedia } from "@/lib/media";
import { MediaFrame } from "./MediaFrame";
import { HeroBeat, HeroCopy } from "./HeroChoreography";
import { MaskReveal } from "./MaskReveal";
import { Magnetic } from "./Magnetic";

/**
 * The opening composition: Amira, and the case for learning from her.
 *
 * WHAT CHANGED, AND WHY IT IS A CHANGE OF SUBJECT RATHER THAN OF STYLE.
 *
 * This screen was the academy's classroom footage full bleed, with a centred
 * title card set on it: a statement, a line, two actions, symmetrical about the
 * middle of the frame. As a title card it worked. As the first screen of a
 * personal brand it answered the wrong question. A visitor arriving cold has
 * five in this order, and she has them in about three seconds:
 *
 *   who is this -> why should I believe her -> what does she teach ->
 *   how good is her work -> how do I learn from her
 *
 * A wide shot of a room answers the third and leaves the first unanswered,
 * because the person teaching is thirty pixels tall and facing a flipchart. The
 * screen now opens on her: a studio portrait at half the width of the display,
 * running the full height, with her name and her three titles set at its foot
 * the way a magazine credits the subject of a photograph. The first question is
 * answered before a word is read.
 *
 * THE COMPOSITION IS ASYMMETRIC, AND THAT IS THE POINT. The previous screen was
 * centred, and the reasoning for it was sound while the ground was footage with
 * no quiet side to hang type on. A portrait on a seamless sweep is the opposite
 * case: it has one subject, one direction of gaze, and a natural axis down the
 * middle of the frame. Type on one side and the person on the other is how a
 * fashion house opens, and it is the arrangement that lets both be large.
 *
 * The ground is ivory rather than near black. The portrait's own sweep is a
 * warm cream, so the page and the photograph share a ground and the frame reads
 * as a plate on the page rather than as a window cut into it. It also means the
 * type is espresso on ivory, which is the site's reading pair, at display size,
 * with no scrim between it and the eye.
 *
 * WHAT THE THREE FIGURES ARE DOING BACK ON THIS SCREEN. They were moved out to
 * a credentials band of their own, on the argument that a statistics table
 * inside a title card is a brochure. That argument holds for a table. It does
 * not hold for a masthead, which is what this is: a hairline, three figures on
 * one baseline, and one sentence under the third. The brief for this brand is
 * that a visitor should understand why to believe her within seconds, and the
 * evidence cannot be two screens further down for that to be true.
 *
 * The third figure carries the weight, deliberately. Eight years and a hundred
 * and fifty students are credentials any established academy could print; three
 * to four students to a class is the one that is a promise about what happens
 * in the room, and it is the reason the training costs what it costs. So it is
 * the only one set in bronze and the only one with a line under it, and the
 * line says the thing the number implies rather than the number again.
 *
 * MOTION. Unchanged in kind, and it is the site's own score: the bar, then the
 * headline line by line through apertures, then the supporting line, the
 * figures and the actions fading up, at the intervals in `heroBeat`. The
 * portrait settles from 1.03 over 1.4s, which is the same `settle` every
 * intentional crop on the site uses. Nothing here bounces, slides or parallaxes.
 *
 * THE ORDER IN THE DOCUMENT IS THE ORDER ON A PHONE, and the grid rearranges it
 * for the desktop rather than the other way round. Copy, portrait, figures: a
 * phone reads the statement, meets the action, then meets her, then the
 * evidence. From lg the portrait takes the whole inline end of the screen
 * across both rows and the figures sit under the copy, which is why the grid
 * declares two rows and the portrait spans them. There is one portrait element,
 * not a desktop copy and a mobile copy: a hidden `next/image` still resolves
 * its srcset and still downloads.
 */
export async function Hero() {
  const t = await getTranslations("hero");
  const inst = await getTranslations("instructor");

  /* The three marks the academy can prove, in the order a visitor weighs them.
     Values are quoted from the client's document and never rounded up here. */
  const facts = ["years", "students", "classes"] as const;

  return (
    <section className="hero relative isolate overflow-hidden bg-ivory">
      <div className="mx-auto grid w-full max-w-[1920px] lg:min-h-[100svh] lg:grid-cols-[1.1fr_0.9fr] lg:grid-rows-[1fr_auto]">
        {/* THE COPY.
            Bottom aligned on a phone so the block sits against the portrait
            beneath it rather than floating in the middle of a tall screen, and
            optically centred from lg where it shares the height with the
            photograph. The top padding clears the fixed bar at every width. */}
        <HeroCopy className="flex flex-col justify-end px-6 pt-[clamp(7rem,17vh,9rem)] pb-[var(--hero-air-md)] md:px-10 lg:col-start-1 lg:row-start-1 lg:justify-center lg:pb-0 lg:pe-12 lg:ps-16 xl:pe-16 xl:ps-24">
          {/* The academy, what it does, where. Three facts on one line, balanced
              so a phone breaks it into two even lines rather than one full line
              and an orphan. */}
          <MaskReveal onMount delay={heroBeat.bar} duration={dur.base}>
            <p className="label text-balance leading-[1.7] text-bronze-ink">
              {t("eyebrow")}
            </p>
          </MaskReveal>

          {/* Two blocks, two apertures, one beat apart. The statement is set as
              the two lines the academy wrote separately, so nothing is split by
              code and nothing can split differently in Italian, French or
              Arabic. The measure is the guard against a display line running
              the width of a laptop. */}
          <h1
            /* 19ch clears "Build your career." and its three translations on
               one line; the size cap in `displayHero` is what actually holds
               them there, and this only stops the statement running the full
               width of a very wide column. */
            className={`${displayHero} hero-statement mt-[var(--hero-air-sm)] max-w-[19ch] text-balance`}
          >
            <MaskReveal onMount delay={heroBeat.headline} duration={dur.slow}>
              <span className="block">{t("titleA")}</span>
            </MaskReveal>
            {/* A real space between the two blocks. They are siblings with no
                whitespace between them, so anything that reads the document
                rather than paints it, a screen reader, a crawler, a share
                preview, would otherwise receive the two sentences as one token. */}{" "}
            <MaskReveal
              onMount
              delay={heroBeat.headline + stagger.line}
              duration={dur.slow}
            >
              <span className="block">{t("titleB")}</span>
            </MaskReveal>
          </h1>

          {/* The supporting line, and it is the one piece of copy on this screen
              that has a job beyond tone: it names her, and it says what the
              student actually gets. A visitor who reads the headline and this
              line knows she would be taught permanent makeup by Amira Bechini
              herself. Held to a measure visibly inside the headline's, so it
              reads as subordinate rather than as a paragraph stuck to it. */}
          <HeroBeat delay={heroBeat.sub}>
            <p className="mt-[var(--hero-air-md)] max-w-[46ch] text-[16px] leading-[1.75] text-mute md:text-[17px]">
              {t("sub")}
            </p>
          </HeroBeat>

          {/* Two actions, one decision. The catalogue is the filled button
              because it is what a visitor who is already interested wants; her
              story is the text link beside it, for the visitor who is not
              convinced yet and should be given the person before the price
              list. Neither is a WhatsApp thread: the bar carries that at every
              width above md and the standing bar carries it on a phone.

              The primary takes the full width on a phone, where a 230px button
              floated against the edge of a 390px screen reads as an
              afterthought, and the pair sit inline from sm. */}
          <HeroBeat delay={heroBeat.actions}>
            <div className="mt-[var(--hero-air-lg)] flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-9">
              {/* The one control on the first screen that leans. Spending the
                  gesture once, on the primary, is what keeps it a detail rather
                  than a behaviour every button on the site performs. */}
              <Magnetic className="w-full sm:w-auto">
                <Link href="/courses" className={`${btnSolid} w-full sm:w-auto`}>
                  {t("primary")}
                </Link>
              </Magnetic>
              <Link href="/about" className={linkRule}>
                {t("meetAmira")}
                <ArrowRight size={14} weight="light" className={`flip-x ${arrow}`} />
              </Link>
            </div>
          </HeroBeat>
        </HeroCopy>

        {/* THE PORTRAIT.
            Full bleed to the inline end of the screen and the full height of
            the composition from lg; a plate under the copy below it.

            EVERY FRAME BELOW lg IS PORTRAIT OR SQUARE, AND THAT IS A HARD RULE
            RATHER THAN A PREFERENCE. The photograph is square, so a frame that
            is taller than it is wide crops the width and loses beige, while a
            frame that is wider than it is tall crops the height and takes the
            top of her head with it. This carried `sm:aspect-[3/2]` for a moment
            and the arithmetic is worth recording: at 768px that frame is 768 by
            512, `cover` scales the square to 768, and 128px comes off the top,
            which is source pixel 171 downward. Her head starts at pixel 55. The
            entire head was cut on every tablet.

            So: 4:5 on a phone, square from sm, where the whole photograph
            clears the frame with nothing cropped at all, and free from lg where
            the frame is a tall column and the crop is horizontal again.

            THE 76px INSET AT lg IS THE HEIGHT OF THE FIXED BAR, AND IT BUYS TWO
            THINGS. Her head starts about five percent down the source, so in a
            frame that runs to the top of the screen her hair sits under the
            navigation and the booking button: type over the subject, which is
            the one thing this composition was asked not to do. Starting the
            frame at the foot of the bar clears her by a comfortable margin and
            leaves a clean band of the page's own ivory for the bar to sit on.

            It also loosens the crop, which is the part worth knowing. A shorter
            frame at the same width is closer to square, so `cover` scales the
            photograph down less and takes less off the sides: at 1440 by 900 the
            inset drops the horizontal crop from about 250 pixels to about 175,
            and what comes back is the beige around her shoulders.

            The aspect is dropped entirely at lg (`lg:aspect-auto lg:h-full`) so
            the frame takes whatever height the copy column settles at, which is
            what makes the photograph run edge to edge top and bottom.

            NOTHING IS PAINTED OVER THIS PHOTOGRAPH. It carried a scrim and her
            name at its foot, which is the conventional way to credit a hero
            image and was the wrong thing here twice over: the gradient put a
            dark band across the warm beige the picture is built on, and the
            credit printed her name and titles a second time within a screen of
            the section that exists to carry them. The name is now the
            `Signature` band directly below, where it is the first and only
            place her name is set. The photograph is clean. */}
        {/* Two elements, and the outer one is not decorative. `MediaFrame`
            renders a `fill` image, which is absolutely positioned against the
            padding box of its nearest positioned ancestor: padding on that
            ancestor is inside the box the image fills, so it does nothing at
            all. The inset has to be on a wrapper that is NOT the positioned
            element, which is what this is. */}
        <div className="w-full lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-full lg:pt-[76px]">
          <div className="relative aspect-[4/5] w-full sm:aspect-square lg:aspect-auto lg:h-full">
            <MediaFrame
              media={{ ...heroMedia, alt: inst("portrait") }}
              priority
              eager
              sizes="(max-width: 1024px) 100vw, 50vw"
              imageClassName="settle"
            />
          </div>
        </div>

        {/* THE PROOF.
            A masthead band rather than a table: one hairline over three
            figures, no rules between them and no box around any of them. The
            three hang from the top of the band rather than sitting on a common
            baseline, because the third is set a size larger than its neighbours
            and aligning the baselines instead would push its label out of the
            row. Three columns from 320px up, because set inline the three
            pairs are about 520px of type against 342 of gutter and they break
            one to a line, which turns a masthead into a list.

            The labels are set smaller and tighter than the house label below md
            (`.hero .fact-label` in globals.css) for a reason that is arithmetic
            rather than taste: at 320px a column is 82px and "EXPERIENCE" alone
            is 86 at house tracking, so the longest word in the row could not fit
            the column it was given. */}
        <HeroBeat
          delay={heroBeat.facts}
          className="px-6 pt-[var(--hero-air-lg)] pb-[var(--hero-air-xl)] md:px-10 lg:col-start-1 lg:row-start-2 lg:pt-0 lg:pb-[clamp(2.5rem,6vh,4.5rem)] lg:pe-12 lg:ps-16 xl:pe-16 xl:ps-24"
        >
          <dl className="grid grid-cols-3 items-start gap-x-4 border-t border-hair pt-[var(--hero-air-md)] sm:gap-x-8">
            {facts.map((k) => {
              /* THE THIRD FIGURE IS NOT THE SAME KIND OF THING AS THE OTHER
                 TWO, and the typography says so.

                 Eight years and a hundred and fifty students are records: they
                 say what has already happened, and any established academy
                 could print a version of them. Three to four to a class is a
                 constraint the academy accepts on every course it runs, which
                 is the only one of the three that tells a visitor what will
                 happen to her, in the room, on the day.

                 It gets three marks and no box: bronze rather than espresso, a
                 step up in size, and a hairline of its own above the figure
                 that the other two do not have. Three quiet differences read as
                 emphasis; one loud one, a rule around it or a fill behind it,
                 would read as a card, which is the thing this band exists to
                 not be. */
              const lead = k === "classes";
              return (
                <div
                  key={k}
                  className="relative flex flex-col gap-[var(--hero-air-xs)]"
                >
                  {/* The band's hairline, turned bronze for the width of this
                      column and nothing else.

                      Absolutely positioned onto the rule rather than added as a
                      border on the cell, and that is the whole of the fix: a
                      `border-t` with padding under it made the third column a
                      taller box than its neighbours, so its figure sat lower
                      than the other two and the shared baseline the row is
                      built on was gone. The offset is the band's own top
                      padding plus the rule, so the mark lands exactly on the
                      hairline at every breakpoint the clamp moves it to. */}
                  {lead ? (
                    <span
                      aria-hidden
                      style={{ top: "calc((var(--hero-air-md) + 1px) * -1)" }}
                      className="absolute inset-x-0 h-px bg-bronze"
                    />
                  ) : null}
                  <dt
                    className={`display leading-none ${
                      lead
                        ? "text-[2rem] text-bronze-ink md:text-[2.75rem]"
                        : "text-[1.75rem] text-espresso md:text-[2.25rem]"
                    }`}
                  >
                    {t(`facts.${k}.value`)}
                  </dt>
                  <dd
                    className={`label fact-label text-balance leading-[1.45] ${
                      lead ? "text-espresso" : "text-mute"
                    }`}
                  >
                    {t(`facts.${k}.label`)}
                  </dd>
                </div>
              );
            })}
          </dl>

          {/* The sentence the third figure implies, said once, and tied to it
              rather than to the band: a short bronze rule on the inline start,
              the same colour as the figure it belongs to, so the eye connects
              the two without the note having to sit inside a narrow column and
              break the shared baseline the row is built on. */}
          <p className="mt-[var(--hero-air-md)] flex max-w-[46ch] items-baseline gap-3 text-[14px] leading-relaxed text-mute md:text-[15px]">
            <span aria-hidden className="mt-2 h-px w-6 shrink-0 bg-bronze" />
            {t("classesNote")}
          </p>
        </HeroBeat>
      </div>
    </section>
  );
}
