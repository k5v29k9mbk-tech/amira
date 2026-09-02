import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { shell } from "@/lib/ui";
import { entryCopy, entryImages } from "@/lib/entry";

/**
 * The founder panel: her name on ivory, her work in the middle, her words on
 * near-black.
 *
 * THREE PANELS EDGE TO EDGE, NOT THREE COLUMNS IN A CONTAINER. The reference
 * runs this band the full width of the page with no gutter between the panels,
 * so the ivory, the photograph and the near-black meet on two hard vertical
 * seams. That is the whole effect: the grounds are the composition, and the
 * shell's 64px gutter between them would turn a triptych into three cards.
 *
 * So the section itself has no `shell` — the panels take the full width and each
 * one carries its own padding. The middle panel is the photograph, full bleed
 * top to bottom, which is what makes the two type panels read as mounted either
 * side of it.
 *
 * THE ROLE LINE IS EXACT AND IS NOT DERIVED. "Founder & Master Educator of Aura
 * Academy" is written out per locale in `lib/entry.ts` and is never assembled
 * from `brand.short` plus a translated noun. It would be one interpolation away
 * from naming the wrong business — the brief rules one particular alternative
 * out by name — the first time somebody edited the brand constant, and a string
 * that has been specified to the word should be stored as that word.
 *
 * The forbidden wording is deliberately not quoted anywhere in this repository,
 * so that grepping for it returns nothing rather than returning this comment.
 */
export function EntryFounder({ locale }: { locale: string }) {
  const copy = entryCopy(locale);

  return (
    <section className="grid lg:grid-cols-[1fr_minmax(0,34%)_1fr] lg:items-stretch">
      {/*
        PANEL ONE: the name.

        `py` is generous and the type is ranged to the inline start, which puts
        the name on the same optical line as the quote three panels over. On a
        phone this panel is the full width and the padding closes to the page
        gutter, so the name never sits further in than the heading of any other
        section.
      */}
      <Reveal className="flex flex-col justify-center bg-ivory px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24 xl:px-16">
        <p className="label text-bronze-ink">{copy.founder.eyebrow}</p>

        {/* Two display lines rather than one wrapped one, so the break falls
            between the given name and the family name at every width instead of
            wherever the column happens to run out. */}
        <h2 className="display mt-6 text-[clamp(2rem,4vw,3.5rem)] uppercase leading-[1.04] md:mt-7">
          <span className="block">{copy.founder.nameTop}</span>
          <span className="block">{copy.founder.nameBottom}</span>
        </h2>

        {/*
          THE SIGNATURE, SET IN THE DISPLAY SERIF IN ITALIC RATHER THAN IN A
          SCRIPT FACE.

          The reference sets a handwritten signature here, and the brief calls it
          optional. A true script face is a fifth webfont on a site that ships
          three and has a note in the layout explaining that the script face the
          previous design used was removed along with its request — so adding one
          back for two words on one page would undo a decision this codebase made
          deliberately, and cost a font request above the fold on the page most
          likely to be a visitor's first.

          Cormorant's italic at this size, tracked open, reads as a signature
          without pretending to be handwriting, which is the more honest of the
          two anyway: it is a typeset name, and it does not imply Amira signed
          the page.

          `aria-hidden`, because it repeats the `h2` directly above it verbatim.
        */}
        {copy.founder.signature ? (
          <p
            aria-hidden
            className="display mt-6 text-[clamp(1.25rem,2vw,1.75rem)] italic text-bronze-ink"
          >
            {copy.founder.signature}
          </p>
        ) : null}

        <div aria-hidden className="mt-8 h-px w-[64px] bg-bronze" />

        <p className="mt-8 max-w-[30ch] text-[15px] leading-relaxed text-mute md:text-[16px]">
          {copy.founder.role}
        </p>

        {/*
          WHAT SHE TEACHES, UNDER WHO SHE IS.

          The role line is a title and answers nothing on its own; these two
          sentences are the claim this panel is actually making -- that the
          teaching covers how to work and how to present the work, not only how
          to hold the tool -- and they belong beside her name rather than in a
          section of their own. Same ink and same measure as the role, so the
          three read as one block.
        */}
        {copy.founder.body?.map((line) => (
          <p
            key={line}
            className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-mute md:text-[16px]"
          >
            {line}
          </p>
        ))}

        {/* The four marks, in the page's tracked caps: the same four words the
            sections either side of this panel are about, stated once. */}
        {copy.founder.marks ? (
          <p className="mt-8 grid gap-y-2">
            {copy.founder.marks.map((mark) => (
              <span
                key={mark}
                className="entry-cap block text-[0.6875rem] leading-none text-bronze-ink md:text-[0.75rem]"
              >
                {mark}
              </span>
            ))}
          </p>
        ) : null}
      </Reveal>

      {/*
        PANEL TWO: the photograph.

        `min-h` rather than an aspect ratio, because this panel has to match the
        height of whichever type panel is taller and that height is a function of
        the locale. An aspect ratio would leave a strip of ground under the
        photograph in Arabic and crop it in French. On a phone it takes a 4:5
        frame of its own, which is the ratio that keeps her hands and the model
        both in shot.
      */}
      <div className="relative min-h-[420px] w-full lg:min-h-full">
        <Image
          src={entryImages.liveDemo.src}
          alt={copy.founder.portraitAlt}
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 34vw, 100vw"
          className="media-fit"
          style={{ "--obj": entryImages.liveDemo.focus } as React.CSSProperties}
        />
      </div>

      {/*
        PANEL THREE: the quote, on the near-black the page's footer also sits on.

        A `blockquote` with a `cite` under it, because it is an attributed
        quotation and that is the element pair for one. The quotation marks are
        typographic and are inside the string's own punctuation rather than
        drawn as an ornament: a 120px serif quote glyph is the single most
        common way a testimonial block stops looking editorial.
      */}
      <Reveal className="flex flex-col justify-center bg-night px-6 py-16 text-ivory md:px-10 md:py-20 lg:px-12 lg:py-24 xl:px-16">
        <blockquote>
          <p className="display text-[clamp(1.375rem,2.4vw,2rem)] leading-[1.35]">
            &ldquo;{copy.founder.quote}&rdquo;
          </p>
        </blockquote>

        <p
          className="display mt-10 text-[clamp(1.125rem,1.7vw,1.5rem)] italic text-bronze-hi"
        >
          {/* `cite` is the element for the source of a quotation, and the
              browser's default italic on it is the register this line wants
              anyway. */}
          <cite className="not-italic">
            <span className="italic">
              {copy.founder.nameTop} {copy.founder.nameBottom}
            </span>
          </cite>
        </p>
      </Reveal>
    </section>
  );
}
