import { PageTransition } from "@/components/PageTransition";

// Next remounts a template on every navigation, unlike a layout. Children pass
// straight through, so pages stay server components.
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
