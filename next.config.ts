import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  turbopack: { root: import.meta.dirname },
  images: {
    /**
     * AVIF first, WebP behind it.
     *
     * The default is WebP alone. This site is photographs almost end to end,
     * and they are the whole payload: a hero portrait, six programme frames, a
     * gallery, a macro. AVIF is typically 20-30% smaller than WebP at the same
     * quality on exactly this kind of image, continuous tone with skin in it,
     * and it is the format where the difference is largest rather than
     * marginal.
     *
     * Order is the negotiation order, and there is no risk in putting AVIF at
     * the front: `next/image` serves whatever the request's `Accept` header
     * says the browser takes, so anything without AVIF support is handed the
     * WebP behind it, and anything without either is handed the original. The
     * cost is build-time encoding, which is slower for AVIF and is paid once
     * per image per size rather than per visitor.
     *
     * The `picsum.photos` remote pattern that used to be here is gone. It was
     * from placeholder development and nothing on the site has referenced it
     * for some time; a remote pattern is an allowlist of hosts this site will
     * proxy and optimise images for, so an entry nothing uses is a door left
     * open onto a third party for no reason.
     */
    formats: ["image/avif", "image/webp"],
  },
};

export default createNextIntlPlugin()(nextConfig);
