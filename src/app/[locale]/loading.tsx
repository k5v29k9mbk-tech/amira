import { Logo } from "@/components/Logo";

/**
 * Route-level loading state. A blank frame between pages is the cheapest thing
 * a site can look like, so the full logo holds the space on the brand's own
 * ground while the next route streams in. One of the two places the whole plate
 * appears, the opening film being the other.
 *
 * The pulse is the only motion, and it is slow enough to read as breathing
 * rather than as a spinner.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[70dvh] items-center justify-center px-6">
      <Logo
        variant="lockup"
        tone="dark"
        className="h-32 w-auto animate-pulse md:h-40"
        sizes="180px"
      />
      <span className="sr-only">Loading</span>
    </div>
  );
}
