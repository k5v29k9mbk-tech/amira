/**
 * Brand lockup. The AB monogram is set type, not a drawn logo, so it inherits
 * the Didone and stays crisp at any size. Swap in a real SVG mark when the
 * studio supplies one.
 */
export function Monogram({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`display inline-flex items-baseline leading-none text-accent-hi ${className}`}
    >
      <span>A</span>
      <span className="-ms-[0.22em]">B</span>
    </span>
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
        <Monogram className="text-4xl" />
        <span className="display text-2xl tracking-[0.22em] text-bone uppercase">
          Amira Bechini
        </span>
        <span className="flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-accent/40" />
          <span className="lockup text-[10px] text-muted">Masterclass</span>
          <span className="h-px flex-1 bg-accent/40" />
        </span>
      </span>
    );
  }

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <Monogram className="text-2xl" />
      <span className="flex flex-col leading-none">
        <span className="display text-[15px] tracking-[0.24em] text-bone uppercase">
          Amira Bechini
        </span>
        <span className="lockup mt-1 text-[8px] text-muted">Masterclass</span>
      </span>
    </span>
  );
}
