/**
 * The only recurring small-caps label on the site: a figure, a hairline, a
 * word. The rule is a real element rather than a dash character, so it scales
 * with the type and never reads as punctuation.
 */
export function SectionLabel({
  n,
  children,
  tone = "dark",
  className = "",
}: {
  /** Position in the page sequence, printed as 01, 02 and so on. */
  n: number;
  children: React.ReactNode;
  /** "dark" for espresso grounds under it, "light" for near-black grounds. */
  tone?: "dark" | "light";
  className?: string;
}) {
  const ink = tone === "light" ? "text-bronze-hi" : "text-bronze-ink";
  const rule = tone === "light" ? "bg-bronze-hi/50" : "bg-bronze/50";

  return (
    <p className={`label flex items-center gap-4 ${ink} ${className}`}>
      <span className="font-mono">{String(n).padStart(2, "0")}</span>
      <span aria-hidden className={`h-px w-10 ${rule}`} />
      <span>{children}</span>
    </p>
  );
}
