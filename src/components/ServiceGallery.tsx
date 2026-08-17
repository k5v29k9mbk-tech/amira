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
 * WHAT IT RENDERS TODAY. The academy has supplied one aligned pair, which the
 * homepage carries; nobody has yet said which brow technique produced it, so no
 * discipline claims it here. Every slot below is therefore a plate printing the
 * filename it expects. That is deliberate and it is the honest state of the
 * page: an empty gallery says the academy has no results, and a fabricated one
 * would say something worse. A plate says a photograph is coming and names it.
 *
 * The moment `ready` is set on a pair in lib/service-gallery.ts, the plates
 * become photographs and nothing else on the page moves: the frames already
 * hold their ratio, so there is no layout shift when the images land.
 */
export function ServiceGallery({ slug, name }: { slug: string; name: string }) {
  const t = useTranslations("catalog.gallery");
  const pairs = serviceGallery[slug];
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
                  {pair.ready ? (
                    <Image
                      src={src}
                      alt={`${name}, ${label}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 45vw"
                      className="object-cover"
                    />
                  ) : (
                    /* The plate. A hairline, the slot's own filename in the
                       mono face the page already uses for figures, and the
                       word the frame will carry when it is filled. It is
                       deliberately quiet: a placeholder that shouts is one
                       that ships to production by accident. */
                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 border border-hair px-4 text-center">
                      <span className="label text-mute">{label}</span>
                      <span className="font-mono text-[11px] leading-relaxed tracking-[0.08em] text-taupe">
                        {src.replace(/^\//, "")}
                      </span>
                      <span className="label text-[10px] text-taupe">{t("pending")}</span>
                    </span>
                  )}
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
