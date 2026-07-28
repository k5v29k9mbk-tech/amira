import { markBox, markPath } from "@/lib/mark";
import { brand } from "@/lib/studio";

/**
 * Brand lockup. The monogram is the studio's drawn AB mark (see lib/mark), set
 * in currentColor so each surface can pick a weight that clears contrast on its
 * own ground — champagne gold on ivory is only ~2.4:1, so --accent never carries
 * the mark alone.
 *
 * Two registers, in the academy's own naming order: the short name leads and
 * the founder's name sits under it as the qualifier, matching "Aura Academy di
 * Amira Bechini".
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

export function Wordmark({
  stacked = false,
  className = "",
}: {
  stacked?: boolean;
  className?: string;
}) {
  if (stacked) {
    return (
      <span className={`flex flex-col items-center gap-3 ${className}`}>
        <Monogram className="text-5xl text-accent-hi" />
        <span className="display text-2xl tracking-[0.22em] text-bone uppercase">
          {brand.short}
        </span>
        <span className="flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-accent/40" />
          <span className="lockup text-[10px] text-muted">{brand.founder}</span>
          <span className="h-px flex-1 bg-accent/40" />
        </span>
      </span>
    );
  }

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <Monogram className="text-[30px] text-accent-hi" />
      <span className="flex flex-col leading-none">
        <span className="display text-[15px] tracking-[0.24em] text-bone uppercase">
          {brand.short}
        </span>
        <span className="lockup mt-1 text-[8px] text-muted">{brand.founder}</span>
      </span>
    </span>
  );
}
