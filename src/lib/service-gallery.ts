/**
 * The before/after slots for each discipline, and the file each one is waiting
 * for.
 *
 * WHAT THIS IS. Each entry is a slot: a named place for a pair of photographs,
 * under the exact filenames it expects. Drop both files into
 * `public/brand/services/`, set `ready: true`, and the pair appears as a slider
 * with no other change anywhere. A slot that is not ready renders nothing at
 * all: `ServiceGallery` filters on the flag, so a discipline with no results
 * shows no results rather than an empty frame.
 *
 * ATTRIBUTION IS THE WHOLE POINT OF THIS FILE, AND IT IS NOT AUTOMATIC. A
 * gallery that files a client's result under the wrong discipline is worse than
 * one that shows nothing, and the site cannot tell from a photograph which
 * technique produced it: microblading and powder brows both produce a brow, and
 * brow lamination is not permanent makeup at all. `lib/programs.ts` records at
 * length why a per-discipline set derived from the general results was built
 * and then removed. So a pair may only be filed here when the academy has said
 * which treatment it is. The one ready pair below carries that provenance in
 * its own comment; anything added later must carry the same.
 *
 * The brow pair in the homepage results section is still unattributed and still
 * lives in `lib/studio.ts`, because nobody has said which of the three brow
 * techniques produced it.
 *
 * WHY THE PATH IS THE LABEL. The slot name is simultaneously the instruction,
 * the filename and the sort order, so a folder of forty photographs from a
 * shoot can be renamed against this file rather than against a list in
 * someone's notes.
 *
 * THE RULES THIS FILE ENFORCES.
 *
 *   - A pair is a pair. Before and after are one entry, so a gallery cannot
 *     ship with three befores and two afters, and the two are always rendered
 *     at the same size beside each other.
 *   - No discipline borrows another's photographs. The slots are keyed by
 *     course slug and the page reads them by slug, so a lip result cannot
 *     appear in a brow gallery by editing a layout file.
 *   - Two pairs per discipline. With the hero frame above them that is five
 *     photographs per service, which is the ceiling worth showing: a visitor
 *     comparing techniques reads two comparisons and skims a third.
 *
 * ALIGNMENT. Every pair gets the same treatment: `scripts/align-pair.swift`
 * maps both frames onto the shared 900x620 canvas so the eyes sit on the same
 * pixels in both. Under a wipe that is not a nicety, it is the whole effect:
 * two frames at different scales or angles read as two photographs of two
 * people, and the slider stops being a comparison.
 *
 * The script takes the framing from the faces themselves and applies one
 * similarity transform, so a pair is rotated, scaled and moved but never
 * warped, retouched or regraded. Both frames of a pair must be generated with
 * identical flags, and the flags used are recorded beside the pair below so the
 * frames can be regenerated from the originals at any time.
 */
export type GalleryPair = {
  /** Slot id, and the filename stem both files are expected under. */
  id: string;
  /**
   * Flip to true once both files exist in `public/brand/services/`. Until then
   * the pair renders as two labelled plates and claims nothing.
   */
  ready?: true;
};

/** Where the files live, and the shape both frames of a pair are cut to. */
export const galleryDir = "/brand/services";
export const galleryRatio = "900 / 620";

export const beforeSrc = (id: string) => `${galleryDir}/${id}-before-01.jpg`;
export const afterSrc = (id: string) => `${galleryDir}/${id}-after-01.jpg`;

/**
 * Keyed by course slug, in the order the pairs are shown. The ids repeat the
 * slug on purpose: the filename has to be readable on its own once it is out of
 * this file and sitting in a folder with thirty others.
 */
export const serviceGallery: Record<string, GalleryPair[]> = {
  microblading: [
    /**
     * READY. The academy's own client, photographed before the treatment and
     * after it, and confirmed by Amira as microblading, which is what allows it
     * to be filed under this discipline at all.
     *
     * Both frames are `scripts/align-pair.swift` run over the untouched camera
     * originals with the same overrides, and nothing else was done to them: no
     * grade, no retouch, no smoothing, no change to the brows, the skin or the
     * colour. The transform rotates each frame upright, scales it and places
     * the eyes on the canvas point. That is all.
     *
     *   swift scripts/align-pair.swift <before> microblading-01-before-01.jpg --ipd 430 --midy 0.60
     *   swift scripts/align-pair.swift <after>  microblading-01-after-01.jpg  --ipd 430 --midy 0.60
     *
     * WHY --ipd 430 RATHER THAN THE DEFAULT 607. The originals are 1200x1600
     * and were shot a step further back than the pair the default canvas was
     * measured from, so the pupils are 333 and 339 pixels apart in the source.
     * Mapping that onto the default asks for a 1.8x enlargement and the hair
     * strokes, which are the entire evidence for microblading, turn to mush.
     * 430 holds the enlargement to 1.29, which the strokes survive, and --midy
     * 0.60 drops the eye line so the brows sit on the upper third rather than
     * drifting to the middle of a wider band.
     */
    { id: "microblading-01", ready: true },
    /**
     * READY. Supplied by the academy as a single matched before/after plate and
     * identified as microblading. The two halves already share the same camera
     * angle and scale, so they are cut to the common 900x620 canvas without
     * retouching, colour work or changes to the brows.
     */
    { id: "microblading-02", ready: true },
  ],
  "powder-brows": [{ id: "powder-brows-01" }, { id: "powder-brows-02" }],
  "brow-lamination": [{ id: "brow-lamination-01" }, { id: "brow-lamination-02" }],
  "lip-blush": [{ id: "lip-blush-01" }, { id: "lip-blush-02" }],
  "eyeliner-pmu": [{ id: "eyeliner-pmu-01" }, { id: "eyeliner-pmu-02" }],
  "lash-lamination": [{ id: "lash-lamination-01" }, { id: "lash-lamination-02" }],
};

/**
 * The hero frame each discipline is waiting for.
 *
 * Every one of the six already prints a real photograph from the academy's own
 * library at the top of its block, so none of these is rendered today. The path
 * is recorded so that when a shoot produces a frame made for this position —
 * lit for it, cropped for it — it has a name to arrive under.
 */
export const heroSrc = (slug: string) => `${galleryDir}/${slug}-hero.jpg`;
