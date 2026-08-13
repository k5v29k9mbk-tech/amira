import { galleryFrames } from "@/lib/media";
import { FrameReveal } from "./FrameReveal";
import { MediaFrame } from "./MediaFrame";
import { Parallax } from "./Parallax";

/**
 * The room and the teaching, on a twelve column field: each frame carries its
 * own proportion, column span and vertical offset (all of it data, see
 * lib/media.ts). Frames drift a few pixels against each other on scroll, which
 * is the only thing separating them: no captions, no badges, no rounded tiles.
 *
 * On phones the composition collapses to full width, in the same order, because
 * an asymmetric grid at 360px is just a stack with worse crops.
 */
export function FrameGallery() {
  return (
    <div className="grid grid-cols-12 gap-5 md:gap-8">
      {galleryFrames.map((frame, i) => (
        <Parallax
          key={frame.posterSrc}
          distance={i % 2 === 0 ? 16 : -12}
          className={frame.span}
        >
          <FrameReveal delay={i * 0.08}>
            <div className="relative w-full" style={{ aspectRatio: frame.ratio }}>
              <MediaFrame
                media={frame}
                sizes={frame.sizes}
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </FrameReveal>
        </Parallax>
      ))}
    </div>
  );
}
