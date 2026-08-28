import {
  serviceGallery,
  beforeSrc,
  afterSrc,
  galleryRatio,
  bandPosition,
  bandDefault,
} from "@/lib/service-gallery";
import { BeforeAfter } from "./BeforeAfter";
import { Reveal } from "./Reveal";
import { stagger } from "@/lib/motion";

/**
 * One discipline's before/after results, as sliders.
 *
 * THE INTERACTION IS THE SITE'S, NOT THIS COMPONENT'S. Every before/after on
 * the site is now the same object: `BeforeAfter`, the slider the homepage
 * results section carries. Drag the handle, or use the range input from a
 * keyboard, and the frame wipes between the starting point and the healed
 * result. The opening sweep, the house easing curve, the reduced-motion
 * behaviour, the `dir="ltr"` pin that keeps the wipe and the handle agreeing in
 * Arabic, and the touch handling on a phone are all that component's, and this
 * file inherits every one of them by not reimplementing any of them.
 *
 * WHAT THIS USED TO BE, AND WHY IT CHANGED. This rendered its pairs as two
 * static frames side by side, on the reasoning that a slider is right for one
 * hero result and side-by-side is right for scanning several. That argument is
 * defensible in isolation and wrong across a site: it meant the same evidence
 * behaved in two different ways on two pages, so a visitor who learned to drag
 * the comparison on the homepage met a pair on the catalogue that did not
 * move. A comparison a reader operates is stronger evidence than one she is
 * shown, and there is no reason the catalogue should offer the weaker of the
 * two. One interaction, everywhere.
 *
 * WHAT IT RENDERS. Only pairs whose two files exist, which is what `ready`
 * marks in lib/service-gallery.ts. A discipline with no ready pairs renders
 * nothing at all rather than an empty frame, which is the house rule every
 * conditional surface on this site follows.
 *
 * THE TWO WORDS INSIDE THE FRAME come from `success.before` and `success.after`,
 * which is where every before/after on the site reads them. This component used
 * to carry a second copy of the same two words under `catalog.gallery`, for
 * itself alone; that namespace is gone, and the words now have one source in
 * all four languages.
 *
 * THE LAYOUT FOLLOWS THE COUNT, and it is the homepage's rule for the same
 * reason. One pair is held to the width of its own source files, because the
 * frames are 900px wide and anything wider is an upscale of the one image on
 * the page that has to survive close reading. From two, they take the full
 * field in a two-column set from lg, because two comparisons of half the width
 * are more evidence than one of full width. Below lg they stack, where a phone
 * gives each of them more pixels than the desktop set does anyway.
 */
export function ServiceGallery({ slug, name }: { slug: string; name: string }) {
  const pairs = serviceGallery[slug]?.filter((pair) => pair.ready);
  if (!pairs?.length) return null;

  const many = pairs.length > 1;

  return (
    <ul
      className={`mt-10 grid gap-y-12 md:mt-12 ${
        many ? "w-full gap-x-8 lg:grid-cols-2 lg:gap-x-10" : "w-full max-w-[900px]"
      }`}
    >
      {pairs.map((pair, i) => (
        /* The pairs arrive one after the other rather than together, at the
           interval the headlines on this site are set to, so a second frame
           reads as the next line of the same sentence and not as a grid
           loading. */
        <Reveal as="li" key={pair.id} delay={i * stagger.line}>
          <BeforeAfter
            pair={{
              before: beforeSrc(pair.id),
              after: afterSrc(pair.id),
              /* The accessible name for the slider and the alt text for both
                 frames. It is the discipline, not the slot id: "Microblading"
                 is what a screen reader should announce, and `name` is already
                 the localised course name the calling page printed above it. */
              label: name,
            }}
            /* THE BROW BAND. The figure is cut to the strip the result is
               actually in, and each frame is given its own measured position
               inside it, so the eyes hold still under the handle and what moves
               is the brow. Both values come from lib/service-gallery.ts, where
               they are recorded against the photograph they were measured off;
               a pair that has not been measured yet falls back to the centre of
               the frame rather than to another pair's numbers. */
            ratio={galleryRatio}
            focus={{
              before: bandPosition(pair.band?.before ?? bandDefault),
              after: bandPosition(pair.band?.after ?? bandDefault),
            }}
            sizes={
              many
                ? "(max-width: 1024px) 100vw, 46vw"
                : "(max-width: 900px) 100vw, 900px"
            }
          />
        </Reveal>
      ))}
    </ul>
  );
}
