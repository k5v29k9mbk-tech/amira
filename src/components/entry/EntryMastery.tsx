import Image from "next/image";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/Reveal";
import { sectionPad, shell } from "@/lib/ui";
import { entryCopy, entryImages, romeImage, type EntryImage } from "@/lib/entry";

/**
 * "What you will master": the syllabus between two photographs.
 *
 * THE COMPOSITION IS THE REFERENCE'S, exactly — a frame, the list, a frame —
 * and the middle column is the one that carries the argument. Everything either
 * side of it is evidence.
 *
 * THE DESTINATION FRAME IS THE END COLUMN, AND IT IS WHERE ROME GOES. The
 * reference sets St Peter's there, and that is the correct place for it: the
 * city is a fact about this masterclass, not a mood, so it belongs beside the
 * syllabus rather than in a band of its own further down. The academy has not
 * supplied a photograph of Rome and the brief forbids inventing one, so until
 * one exists the frame holds a real training photograph instead and the row is
 * complete either way. The swap is one constant in `lib/entry.ts`; see the note
 * on `romeImage` there for what to do when the photograph arrives.
 */
export function EntryMastery({ locale }: { locale: string }) {
  const copy = entryCopy(locale);

  /**
   * The end frame: Rome if the academy has supplied it, and the mapping
   * photograph until then.
   *
   * The alt text has to follow the image rather than the slot, which is why it
   * is chosen here alongside it: a caption written for a basilica sitting under
   * a photograph of a student being taught is worse than no caption at all.
   */
  const destination: { image: EntryImage; alt: string } = romeImage
    ? { image: romeImage, alt: copy.info.place.title }
    : { image: entryImages.phibrowsTraining, alt: copy.mastery.captions.training };

  return (
    <section className={`${sectionPad} bg-paper`}>
      <div className={shell}>
        <Reveal className="flex flex-col items-center text-center">
          {/*
            `displaySection` is the site's rank for a numbered act, and this is
            one. It is set centred rather than ranged left, which is the only
            centred heading on the page: the reference centres it, and it is the
            one section whose content sits symmetrically either side of the
            heading, so a left-ranged title would be the only thing in the row
            that was not.
          */}
          <h2 className="display text-[clamp(1.75rem,3.6vw,3rem)] uppercase">
            {copy.mastery.title}
          </h2>
          {/* The same 88px bronze hairline the hero opens with, so the two
              sections are marked by one device rather than two. */}
          <div aria-hidden className="mt-7 h-px w-[88px] bg-bronze md:mt-9" />
        </Reveal>

        {/*
          THREE COLUMNS FROM lg, ONE BELOW IT, AND THE LIST GOES FIRST ON A PHONE.

          At a single column the reference's order — photograph, list, photograph
          — puts the syllabus in the middle of a 1,400px scroll with an image
          above and below it, so a reader on a handset meets two pictures before
          the thing the section is called after. `order-` puts the list first
          below lg and restores the reference's order at lg, which is the width
          the three-column composition actually exists at.

          `items-center` so the two frames sit centred against a list whose
          height they do not match; the alternative, stretching them to the row,
          would crop both to whatever the tallest locale's list happens to be.

          BETWEEN sm AND lg THE FRAMES PAIR UP AND THE LIST SPANS BOTH. Dropping
          straight from three columns to one put two 4:5 frames at the full width
          of the container, which on an 834px tablet is a pair of 1,040px-tall
          photographs stacked under the syllabus — about two and a half screens
          of images for a section whose subject is the list above them. Side by
          side they are half that and the section keeps its proportions at the
          width most tablets actually are.
        */}
        <div className="mt-14 grid gap-10 sm:grid-cols-2 md:mt-16 md:gap-12 lg:grid-cols-[1fr_minmax(0,26rem)_1fr] lg:items-center xl:gap-16">
          <Reveal className="order-2 lg:order-1">
            <Frame
              image={entryImages.browResult}
              alt={copy.mastery.captions.browResult}
              /*
                4:5 rather than the reference's landscape, and it is the brief's
                own instruction that decides it: the eyebrow photograph must be
                clearly visible and not over-cropped. The source is 620x830, so a
                landscape frame would throw away a third of its height and take
                one of the two brows with it. A portrait frame keeps the pair.
              */
              ratio="aspect-[4/5]"
            />
          </Reveal>

          {/*
            THE SYLLABUS. A `ul`, because it is a list and a screen reader should
            be told how many items are in it before it starts reading them.

            The rules between rows are `divide-y` for the reason the dark band
            gives: the utility knows which sibling is first, so the top row never
            carries a rule and nothing is special-cased.
          */}
          <Reveal className="order-1 sm:col-span-2 lg:order-2 lg:col-span-1">
            <ul className="grid divide-y divide-hair border-y border-hair">
              {copy.mastery.items.map((item) => (
                <li key={item} className="flex items-center gap-4 py-4 md:gap-5 md:py-[1.15rem]">
                  <Check
                    size={15}
                    weight="bold"
                    aria-hidden
                    className="shrink-0 text-bronze-ink"
                  />
                  <span className="text-[15px] leading-snug text-espresso md:text-[16px]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="order-3">
            <Frame image={destination.image} alt={destination.alt} ratio="aspect-[4/5]" />
          </Reveal>
        </div>

        {/*
          THE TWO REMAINING PHOTOGRAPHS THE ACADEMY SUPPLIED, AND WHY THEY ARE A
          SECOND ROW RATHER THAN A CAROUSEL OR A FOUR-UP.

          The brief names four real photographs for this section. Two of them are
          evidence of the TEACHING and two are evidence of the RESULT, and those
          are different claims: the result and the mapping belong beside the
          syllabus, where a reader is deciding what she will learn, and the live
          model and the certificates belong under it, where she is deciding
          whether it works. Four frames in one row would have made them one claim
          at a quarter of the size each.

          Two columns at every width from sm. On a phone they stack, which is the
          brief's own fallback, and at 320px a single 4:3 frame is still 288px
          wide — large enough that the certificates in it are legible as
          certificates, which is the only reason that photograph is on the page.
        */}
        <div className="mt-10 grid gap-10 sm:grid-cols-2 md:mt-14 md:gap-12">
          <Reveal>
            <Frame
              image={entryImages.guidance}
              alt={copy.mastery.captions.guidance}
              label={copy.mastery.items[0]}
              ratio="aspect-[4/3]"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <Frame
              image={entryImages.certificates}
              alt={copy.benefits[2].body}
              label={copy.benefits[2].title}
              ratio="aspect-[4/3]"
            />
          </Reveal>
        </div>

        {/* The three words that close the section, where a language supplies
            them. Centred and in the display serif, which is the same figure
            `EntryProgram` closes on, so the two sections end the same way. */}
        {copy.mastery.closing ? (
          <Reveal className="mt-14 flex flex-col items-center text-center md:mt-16">
            <p className="display text-[clamp(1.25rem,2vw,1.75rem)] uppercase leading-[1.35] text-espresso">
              {copy.mastery.closing.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

/**
 * One photograph in an intentional crop, with an optional tracked caption.
 *
 * `sizes` is the part that earns its place. Without it `next/image` assumes the
 * frame is the full viewport and serves a 3,840px file to a 400px column, which
 * on a page with six photographs is most of the payload. The value below is the
 * measured width of these frames: a third of the shell at lg and above, half at
 * sm, the full gutter-to-gutter width on a phone.
 *
 * `loading="lazy"` on every one of them, which is the default and is stated
 * anyway because it is the intent: nothing in this section is above the fold at
 * any width, so none of it should compete with the hero portrait for the first
 * connections.
 *
 * The hover is 3% over 700ms, which is `imageScale.hover` from `lib/motion.ts`
 * and is the same scale every frame on the site already uses. `overflow-hidden`
 * on the frame is what makes it a crop rather than a resize.
 */
function Frame({
  image,
  alt,
  ratio,
  label,
}: {
  image: EntryImage;
  alt: string;
  ratio: string;
  label?: string;
}) {
  return (
    <figure className="group/frame">
      <div className={`relative w-full overflow-hidden bg-ivory ${ratio}`}>
        <Image
          src={image.src}
          alt={alt}
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="media-fit transition-transform duration-700 ease-[var(--ease-aura)] group-hover/frame:scale-[1.03]"
          style={
            {
              "--obj": image.focus,
              "--obj-m": image.focusMobile,
            } as React.CSSProperties
          }
        />
      </div>
      {label ? (
        <figcaption className="label mt-5 text-bronze-ink">{label}</figcaption>
      ) : null}
    </figure>
  );
}
