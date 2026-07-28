import { Monogram } from "@/components/Wordmark";

/**
 * Route-level loading state. A blank frame between pages is the cheapest thing
 * a site can look like, so the monogram holds the space on the brand's own
 * ground while the next route streams in.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[70dvh] items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <Monogram className="animate-pulse text-4xl" />
        <span aria-hidden className="h-px w-16 bg-accent/40" />
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}
