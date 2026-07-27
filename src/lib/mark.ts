/**
 * The AB monogram, redrawn as vector geometry from the studio's artwork: a
 * slanted A whose right leg IS the B's stem, so the two letters share one
 * spine. Counters are wound against the outer shapes, so the default nonzero
 * fill rule punches them out while the overlapping strokes stay solid.
 *
 * One source of truth for the lockup, the tab icon and the share card.
 */
export const markBox = { width: 555, height: 580 };

export const markPath = [
  // B: stem, then two bowls with their counters.
  "M250 0H315V580H250Z",
  "M240 0H400A135 135 0 0 1 400 270H240Z",
  "M315 72V198H400A63 63 0 0 0 400 72Z",
  "M240 270H400A155 155 0 0 1 400 580H240Z",
  "M315 342V508H400A83 83 0 0 0 400 342Z",
  // A: diagonal and crossbar. Its counter needs no subpath — nothing fills it.
  "M164 18H256L92 556H0Z",
  "M63 348H290V423H40Z",
].join("");

/** The mark as a standalone SVG document, for anywhere a URL is needed. */
export const markSvg = (fill: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${markBox.width} ${markBox.height}"><path d="${markPath}" fill="${fill}"/></svg>`;

export const markDataUri = (fill: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(markSvg(fill))}`;
