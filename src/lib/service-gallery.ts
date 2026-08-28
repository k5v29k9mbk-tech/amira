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
 *   - Up to three pairs per discipline. With the hero frame above them that is
 *     enough proof to compare the work without turning the page into an archive.
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
  /**
   * The top row of the brow band in each frame, measured off the file.
   *
   * THIS IS WHAT MAKES THE WIPE A COMPARISON. The two numbers are almost never
   * the same, and that is the point: `align-pair.swift` puts the eyes on the
   * same pixels when it can work from a full face, but three of these frames
   * are crops it cannot run on, and the pairs arrived with the face sitting at
   * different heights in the two files. A single band applied to both then
   * makes the face jump under the handle, and a face that jumps reads as two
   * photographs of two people rather than as one result.
   *
   * HOW TO MEASURE A NEW PAIR. The anchor is the eye line, never the brow: the
   * brow is the thing being changed, so aligning on it would flatten the exact
   * difference the pair exists to show, while the eye is fixed anatomy and is
   * in both frames. Find the pupil row in each file, subtract the same offset
   * from both, and record the results here. The offset is the pair's own: it
   * has to clear the top of the brow in whichever frame carries it highest,
   * which is a property of how tightly that pair was shot.
   */
  band?: { before: number; after: number };
};

/** Where the files live, and the shape both frames of a pair are cut to. */
export const galleryDir = "/brand/services";

/**
 * THE BROW BAND, which is what the slider actually shows of a 900x620 frame.
 *
 * The aligned frames are a face from the hairline to the cheekbone, and most of
 * that is not the evidence. A visitor comparing microblading is reading four
 * things — shape, density, symmetry and definition — and every one of them is
 * in a strip about 260px tall. The forehead above it and the cheeks below it
 * are the two largest objects in the frame and neither carries any part of the
 * result, so they were pushing the brows down to a third of the height of the
 * thing that exists to show them.
 *
 * So the figure is cut to 900x260 and the frames are shown through it with
 * `object-fit: cover`. Nothing is done to the files: both frames of every pair
 * are 900px wide and the band is 900px wide, so the scale is exactly 1 in the
 * container and the crop is purely a choice of which rows to show. A pair
 * cannot be made to look better than it is by this, because neither frame can
 * be zoomed relative to the other — the scale is a property of the band, not of
 * the image.
 *
 * WHY 260 AND NOT MORE. microblading-03 is the binding constraint and it is
 * worth recording. Its two frames are a wide plate scaled onto the canvas with
 * an ivory margin, so the photograph only occupies rows 122..496, and the face
 * sits 100px lower in the before than in the after. Aligning the two therefore
 * costs 100px of the 374 available, and 260 is what is left once the band is
 * kept clear of the ivory in both. A taller band would either show the margin
 * or give up the alignment, and the alignment is the whole point.
 */
export const bandHeight = 260;
export const galleryRatio = `900 / ${bandHeight}`;

/**
 * The top row of the band, as the `object-position` that selects it.
 *
 * Under `cover` a percentage does not address a row directly: it distributes
 * the overflow, so 0% is the top of the frame and 100% is the bottom of it, and
 * the 620 - 260 rows in between are what the percentage divides. Writing the
 * measured row here and converting once is the difference between a number that
 * can be checked against the photograph and six magic percentages.
 */
export const bandPosition = (top: number) => `50% ${(top / (620 - bandHeight)) * 100}%`;

/** Where the band sits when a pair has not been measured yet: centred. */
export const bandDefault = (620 - bandHeight) / 2;

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
     *
     * Pupils on row 353 (before) and 360 (after) — the pair `align-pair.swift`
     * already placed, so the band is the same 172px above the eye line in both
     * and the two numbers differ only by the 7px the alignment left. The brows
     * clear the top of the band by about 35px in both frames.
     */
    { id: "microblading-01", ready: true, band: { before: 181, after: 188 } },
    /**
     * READY. Supplied by the academy as a single matched before/after plate and
     * identified as microblading. The two halves already share the same camera
     * angle and scale, so they are cut to the common 900x620 canvas without
     * retouching, colour work or changes to the brows.
     *
     * Pupils on row 348 (before) and 310 (after): the supplied plate has the
     * face 38px higher in the after, so the band is moved by the same 38px and
     * the eyes hold still under the handle. This is the tightest-shot pair on
     * file — the brows start only ~175px above the pupils — so the band is hung
     * 207px above the eye line to clear them, which is why it cuts closer under
     * the eye here than in the other two.
     *
     * WHAT THIS CROP CANNOT FIX, and it should not be papered over: both frames
     * are cut through the outer brow tails at the left and right edges in the
     * source itself. That is horizontal and the band is vertical, so no framing
     * choice here recovers it; it needs a wider crop from the camera original,
     * which is not in the repository.
     */
    { id: "microblading-02", ready: true, band: { before: 141, after: 103 } },
    /**
     * READY. Supplied by the academy as one three-stage Microblading plate.
     * The opening and final panels are used here as the comparison; the mapping
     * panel in the middle remains in the untouched source but is not part of the
     * wipe. Both panels keep their original colour and brow detail, scaled onto
     * the shared 900x620 canvas with an ivory margin rather than cropped through
     * the eyes.
     *
     * Pupils on row 400 (before) and 300 (after). The three-stage plate put the
     * two panels 100px apart vertically, which was the worst misalignment on the
     * site: the whole face stepped down a tenth of the frame as the handle
     * crossed it. The band is moved by exactly that 100px, and it is kept inside
     * the photograph's own rows (122..496) at both ends, so the ivory margin the
     * plate was scaled onto never enters the figure.
     */
    { id: "microblading-03", ready: true, band: { before: 228, after: 128 } },
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
