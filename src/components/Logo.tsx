import Image from "next/image";
import { brand } from "@/lib/studio";

/**
 * The academy's logo, as supplied.
 *
 * One piece of artwork, three inks and two crops, all generated from the
 * master by `scripts/build-logo.py`:
 *
 *   gold   the artwork as drawn, for near-black grounds
 *   dark   the same coverage in espresso, for ivory and paper grounds
 *   light  the same coverage in ivory, for photography and black
 *
 * `lockup` is the full plate, monogram over AURA over ACADEMY. `mark` is the
 * monogram alone, which is what any surface under about 90px tall gets: the
 * lockup is a stacked one, so at header height its ACADEMY line would render
 * about four pixels tall and read as a smudge. Reducing a stacked lockup to its
 * monogram is the standard behaviour, not a redesign.
 *
 * Sizing is done by the caller in CSS height, never by width, so every surface
 * keeps the same optical weight regardless of which crop it uses. The intrinsic
 * dimensions below let next/image serve a retina file and reserve the space.
 */
const ART = {
  lockup: {
    width: 506,
    height: 600,
    gold: "/brand/aura-logo-gold.png",
    dark: "/brand/aura-logo-dark.png",
    light: "/brand/aura-logo-light.png",
  },
  mark: {
    width: 387,
    height: 360,
    gold: "/brand/aura-mark-gold.png",
    dark: "/brand/aura-mark-dark.png",
    light: "/brand/aura-mark-light.png",
  },
} as const;

export function Logo({
  variant = "mark",
  tone = "dark",
  className = "h-9 w-auto",
  sizes = "160px",
  priority = false,
}: {
  variant?: "lockup" | "mark";
  /** gold on dark grounds, dark on ivory, light on photography. */
  tone?: "gold" | "dark" | "light";
  /** Set the height here. Width follows. */
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const art = ART[variant];

  return (
    <Image
      src={art[tone]}
      alt={brand.full}
      width={art.width}
      height={art.height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
