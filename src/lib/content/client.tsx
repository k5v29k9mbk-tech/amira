"use client";

import { createContext, useContext, useMemo } from "react";
import type { PageId } from "./pages";
import type { ContentFor } from "./schemas";
import { merge, scope, type Text } from "./path";

/**
 * Published copy for the client components that need it.
 *
 * WHY A PROVIDER AND NOT PROPS. Most client components here are rendered by a
 * server parent that could pass their strings down, and where that is true it
 * is what happens. Two cannot: `not-found.tsx` is a client boundary Next
 * renders with no props of its own, and the header and footer chrome are
 * rendered once by the layout for every page beneath it. A context mounted in
 * the layout serves both without threading a prop through components that do
 * not otherwise care about content.
 *
 * WHAT IT COSTS. The pages placed in here are serialised into the RSC payload,
 * exactly as next-intl's own client provider serialised its message
 * namespaces. So only the pages whose strings a client component actually
 * reads are put in -- `common` from the layout, and a page's own group where
 * that page has client children. The other five never reach the browser.
 */
type Store = Partial<{ [P in PageId]: ContentFor<P> }>;

const ContentContext = createContext<Store>({});

/**
 * NESTING IS ADDITIVE, not replacing.
 *
 * The layout provides the chrome's group for every page beneath it, and a page
 * that has client children of its own provides its group as well. A plain
 * context would make the inner provider hide the outer one, so the header
 * inside a page that provides `home` would lose `common` and throw. Merging
 * with whatever is already above means each provider only ever declares what
 * it adds.
 */
export function ContentProvider({
  value,
  children,
}: {
  value: Store;
  children: React.ReactNode;
}) {
  const parent = useContext(ContentContext);
  const merged = useMemo(() => ({ ...parent, ...value }), [parent, value]);
  return <ContentContext.Provider value={merged}>{children}</ContentContext.Provider>;
}

/**
 * Read one page's content in a client component.
 *
 * Throws rather than returning undefined when the page was not provided,
 * because the failure it is catching is a component being moved under a layout
 * that does not carry its group -- and that shows up as `undefined is not an
 * object` three frames deeper, naming a property instead of the page.
 */
export function useContent<P extends PageId>(page: P): ContentFor<P> {
  const store = useContext(ContentContext);
  const value = store[page];
  if (!value) {
    throw new Error(
      `Content for "${page}" was not provided. Add it to the ContentProvider in the layout or page above this component.`,
    );
  }
  return value as ContentFor<P>;
}

/**
 * The same accessor as `pageText`, for client components.
 *
 * Identical call shape, so a component that moves between the server and the
 * client changes one line and none of its call sites.
 */
export function usePageText(
  pages: PageId | readonly PageId[],
  namespace?: string,
): Text {
  const store = useContext(ContentContext);
  const list = (Array.isArray(pages) ? pages : [pages]) as PageId[];
  const trees = list.map((page) => {
    const value = store[page];
    if (!value) {
      throw new Error(
        `Content for "${page}" was not provided. Add it to the ContentProvider in the layout or page above this component.`,
      );
    }
    return value;
  });
  return scope(list.length === 1 ? trees[0] : merge(trees), namespace);
}
