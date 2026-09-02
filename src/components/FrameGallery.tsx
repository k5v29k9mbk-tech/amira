import { galleryFrames } from "@/lib/media";
import { FrameReveal } from "./FrameReveal";
import { MediaFrame } from "./MediaFrame";
import { Parallax } from "./Parallax";
import { pageText } from "@/lib/content/server";

/**
 * The room and the teaching, on a twelve column field: each frame carries its
 * own proportion, column span and vertical offset (all of it data, see
 * lib/media.ts). Frames drift a few pixels against each other on scroll, which
 * separates them in depth: no badges, no rounded tiles.
 *
 * On phones the composition collapses to full width, in the same order, because
 * an asymmetric grid at 360px is just a stack with worse crops.
 *
 * CAPTIONS. Each frame is now named under it, in small caps over a hairline.
 * The words are not new: the section's own standfirst used to read "Moments from
 * the courses: the lesson, the mapping drawn by hand, the demonstration on the
 * model", three clauses listed above three photographs, and a reader had to work
 * out for herself which clause went with which frame. Split apart and set under
 * the frame each one describes, the same sentence stops being a promise and
 * starts being a label, which is the difference between a gallery and a spread.
 *
 * This is the one set of frames on the site that carries them. The results in
 * the work section are photographs of clients and stay uncaptioned: see the note
 * on `captionKey` in lib/media.ts. A frame with no key simply renders without
 * one, so the academy can send a fourth photograph and caption it or not.
 */
export async function FrameGallery() {
  const t = await pageText("home", "students.captions");

  return (
    <div className="grid grid-cols-12 gap-5 md:gap-8">
      {galleryFrames.map((frame, i) => (
        <Parallax
          key={frame.posterSrc}
          distance={i % 2 === 0 ? 16 : -12}
          className={frame.span}
        >
          <FrameReveal delay={i * 0.08}>
            {/* Same three percent over 1.4s the work section and the course
                rows use. It was the one set of frames on the site that did
                nothing at all under a pointer. */}
            <div
              className="group relative w-full overflow-hidden"
              style={{ aspectRatio: frame.ratio }}
            >
              <MediaFrame
                media={frame}
                sizes={frame.sizes}
                imageClassName="transition-transform duration-[1400ms] ease-[var(--ease-aura)] group-hover:scale-[1.03]"
              />
            </div>

            {frame.captionKey ? (
              <p className="label mt-4 border-t border-hair pt-3 leading-[1.6] text-mute">
                {t(frame.captionKey)}
              </p>
            ) : null}
          </FrameReveal>
        </Parallax>
      ))}
    </div>
  );
}
