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
  /**
   * ONE HOST SERVES THE SITE, AND IT IS THE BARE DOMAIN.
   *
   * Every canonical tag, every hreflang alternate, every sitemap entry and the
   * `host` line in robots.txt are built from `siteUrl` in `i18n/routing.ts`,
   * which is `https://amira-bechini.com`. A second host answering 200 with the
   * same HTML is one document at two addresses, and the only thing telling a
   * crawler which of the two counts is a tag inside a page it has already
   * downloaded twice.
   *
   * `has` matches the request's Host header, so this fires for the www host and
   * for nothing else: localhost, the `*.vercel.app` preview aliases and the
   * bare domain itself all fall straight through. `:path*` carries the whole
   * path across, and Next appends the original query string to a destination
   * that does not declare one, so `?utm_source=` survives the hop.
   *
   * `statusCode: 301` rather than `permanent: true`, which would emit 308. Both
   * are permanent and search engines treat them alike; 301 is what the delivery
   * brief specifies and what `curl -I` is expected to print.
   *
   * THIS RULE CANNOT WORK ALONE, AND ON ITS OWN IT IS DANGEROUS. Vercel
   * resolves domain-level redirects at the edge, before a request reaches this
   * application, and the project is currently configured the other way round:
   * `www` is the Primary Domain and the bare host 308s to it. Shipping this
   * while that setting stands puts the two redirects in a loop. The Primary
   * Domain must be moved to `amira-bechini.com` first.
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.amira-bechini.com" }],
        destination: "https://amira-bechini.com/:path*",
        statusCode: 301,
      },
    ];
  },
};

export default createNextIntlPlugin()(nextConfig);
