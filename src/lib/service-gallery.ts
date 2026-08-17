/**
 * The before/after slots for each discipline, and the file each one is waiting
 * for.
 *
 * WHAT THIS IS. The academy has supplied exactly one aligned before/after pair
 * so far — the brow pair the homepage results section carries — and it is not
 * recorded here, because nobody has told us which of the three brow techniques
 * produced it and a gallery that files a client's result under the wrong
 * discipline is worse than one that shows nothing.
 *
 * Everything below is therefore a slot: a named, sized, laid-out place for a
 * photograph, printing the exact filename it expects. Drop a file at that path
 * in `public/brand/services/`, set `ready: true` on the pair, and the plate
 * becomes the photograph with no other change anywhere.
 *
 * WHY THE PATH IS THE LABEL. A placeholder that says "image here" tells the
 * person filling it nothing. This one says `microblading-before-01.jpg`, which
 * is simultaneously the instruction, the filename and the sort order, so a
 * folder of forty photographs from a shoot can be renamed against the page
 * itself rather than against a list in someone's notes.
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
 * ALIGNMENT. When the real files arrive they want the same treatment as the
 * existing pair: `scripts/align-pair.swift` maps each frame onto the shared
 * 900x620 canvas so the eyes sit on the same pixels. Side by side that matters
 * as much as it does under a wipe — two frames at different scales read as two
 * photographs of two people.
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
  microblading: [{ id: "microblading-01" }, { id: "microblading-02" }],
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
