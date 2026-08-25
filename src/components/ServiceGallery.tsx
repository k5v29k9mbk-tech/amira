import Image from "next/image";
import { useTranslations } from "next-intl";
import { galleryRatio, serviceGallery, beforeSrc, afterSrc } from "@/lib/service-gallery";
import { Reveal } from "./Reveal";
import { stagger } from "@/lib/motion";

/**
 * One discipline's before/after gallery: pairs, side by side, equal and aligned.
 *
 * SIDE BY SIDE RATHER THAN A WIPE, and the two are not interchangeable. The
 * slider on the homepage is one pair a visitor operates: she drags it, and the
 * comparison happens in her hand. That is the right shape for a single hero
 * result and the wrong one for a gallery of them, where the point is to scan
 * several outcomes of the same technique quickly. Set side by side, a pair is
 * read in one glance and two pairs are read in two.
 *
 * Both frames of a pair sit in the same grid row at the same ratio, so they are
 * the same size at every width by construction rather than by matching two
 * numbers. Below sm they stack, still as a pair, still labelled — a 390px phone
 * cannot show two 900px-wide faces beside each other and pretending otherwise
 * is how a before/after becomes two thumbnails nobody can read.
 *
 * WHAT IT RENDERS TODAY: NOTHING, AND THAT IS A CHANGE WORTH EXPLAINING.
 *
 * The academy has supplied one aligned pair, which the homepage carries; nobody
 * has yet said which brow technique produced it, so no discipline claims it
 * here. No pair in `lib/service-gallery.ts` is `ready`, so this component
 * returns null and the catalogue closes up around it.
 *
 * It used to render a plate per empty slot, printing the exact filename that
 * slot was waiting for. The reasoning was good and is preserved where it
 * belongs: a placeholder reading "image here" tells the person filling it
 * nothing, and one reading `microblading-02-before-01.jpg` is simultaneously
 * the instruction, the filename and the sort order, so a folder of shoot
 * photographs can be renamed against the page itself.
 *
 * What that argument does not survive is the page being public. Six
 * disciplines, two pairs each, two frames a pair is twenty four empty boxes on
 * the catalogue, each printing an internal file path, on the page a visitor
 * reaches immediately after being told this is a premium professional
 * education. It does not read as a site awaiting photography. It reads as an
 * unfinished site, and it is the single loudest thing on the route.
 *
 * The authoring aid was also solving the wrong half of the problem. The slot
 * names are useful to whoever is renaming files; they are not useful to a
 * prospective student, and she is who the page is for. They now live in
 * `lib/service-gallery.ts`, which is where someone renaming files is already
 * working, and the README's "Still missing from the academy" section points at
 * them.
 *
 * This also puts the component back in line with every other conditional
 * surface on the site: `Testimonial` renders nothing without consented quotes,
 * the before/after list renders nothing without a pair, every WhatsApp
 * affordance renders nothing without a number, and `posterOffHome` stands a
 * frame down rather than printing an empty one. Absent until real is the
 * house rule; this was the one place that broke it.
 *
 * Set `ready: true` on a pair once both files are in `public/brand/services/`
 * and that pair appears here. Nothing else changes: the frames hold their own
 * ratio, so the images land with no layout shift.
 */
export function ServiceGallery({ slug, name }: { slug: string; name: string }) {
  const t = useTranslations("catalog.gallery");
  // Only pairs whose two files actually exist. An unready pair is not rendered
  // in any form, and a discipline with no ready pairs contributes nothing.
  const pairs = serviceGallery[slug]?.filter((pair) => pair.ready);
  if (!pairs?.length) return null;

  return (
    <div className="mt-10 md:mt-12">
      <ul className="grid gap-x-5 gap-y-8 sm:grid-cols-2 md:gap-x-8">
        {pairs.map((pair, i) => (
          <Reveal as="li" key={pair.id} delay={i * stagger.tight} className="contents">
            {/* `contents` on the list item, so the two frames of a pair are
                direct children of the grid and land in the same row as the
                other pair's. The pair is still one list item semantically. */}
            {(
              [
                ["before", t("before"), beforeSrc(pair.id)],
                ["after", t("after"), afterSrc(pair.id)],
              ] as const
            ).map(([kind, label, src]) => (
              <figure key={kind}>
                <div
                  className="relative w-full overflow-hidden bg-paper"
                  style={{ aspectRatio: galleryRatio }}
                >
                  <Image
                    src={src}
                    alt={`${name}, ${label}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="label mt-3 text-mute">{label}</figcaption>
              </figure>
            ))}
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
