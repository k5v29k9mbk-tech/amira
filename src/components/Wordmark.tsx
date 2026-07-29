import { markBox, markPath } from "@/lib/mark";

/**
 * The studio's drawn AB monogram, set in currentColor so every surface picks a
 * weight that clears contrast on its own ground.
 *
 * The header and footer set the name in type rather than in the mark, so this
 * is used only where a glyph has to stand alone: the route loading state, and
 * (through lib/mark directly) the tab icon and the share card.
 */
export function Monogram({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${markBox.width} ${markBox.height}`}
      className={`inline-block w-auto fill-current ${className}`}
      style={{ height: "1em" }}
    >
      <path d={markPath} />
    </svg>
  );
}
