# Aura Academy di Amira Bechini

Marketing and booking site for a permanent-makeup and lamination academy in
Giulianova (TE), Italy. Next.js 16, Tailwind v4, four languages including Arabic
with full RTL.

```bash
npm install
cp .env.example .env.local   # every block is optional, see below
npm run dev
npm test                     # content + translation-completeness checks, no framework
```

## What is where

| Path | Purpose |
| --- | --- |
| `src/app/[locale]/page.tsx` | Homepage: hero, about, conditions, method, catalogue, booking steps, gallery, before/after, FAQ, contact |
| `src/app/[locale]/courses/page.tsx` | The six courses and the shared conditions that apply to all of them |
| `src/lib/studio.ts` | Every official fact: brand names, address, legal data, social handles |
| `src/lib/courses.ts` | The six course slugs and their images |
| `src/lib/seo.tsx` | schema.org payloads: organisation, course list, FAQ |
| `messages/` | All copy, in `en` `it` `fr` `ar` |
| `public/brand/` | Academy photography, cut from the supplied artwork |

## The business model this site describes

The academy teaches **in person**, in Italian, to three or four students at a
time, at its premises in Giulianova. Duration and price vary per course and are
quoted on request. Booking is by WhatsApp or the contact form; the place is held
with an agreed deposit; payment is by bank transfer, card or PagoDIL.

There is deliberately **no online checkout, no student account and no video
lesson platform**. An earlier build had all three, plus fixed prices, and none of
it matched what the academy actually sells. It was removed rather than left to
mislead buyers; `git log` has it if the academy ever adds online courses.

## Running without keys

The site runs with an empty `.env.local`. The contact form still accepts messages
and logs them server side rather than crashing.

## Switching the real thing on

**Contact form.** Set `RESEND_API_KEY` and `CONTACT_TO`. Without either, the form
still accepts messages and logs them server side, so nothing is silently dropped
— but nobody at the academy is emailed, so set both before launch.

`CONTACT_TO` must be an **ordinary inbox**, not the PEC address. Italian certified
mailboxes reject ordinary mail, so enquiries routed there would bounce.

**WhatsApp.** `studio.whatsapp` in `src/lib/studio.ts` is empty because the
academy has not supplied the number. Every WhatsApp affordance — the floating
button, the contact row, the footer link — checks for it and renders nothing
while it is blank, so the site never links to a guessed number. Add the digits
(no `+`, no spaces) and all three appear.

## Content rules

Everything on the site comes from the academy's own approved content document.
There are no invented statistics, credentials, prices or reviews.

- **No prices anywhere.** The academy quotes per course. `npm test` fails if a
  euro figure, a refund promise or a "lifetime access" claim reappears in any
  language.
- **No per-course descriptions.** The academy supplied six names and one shared
  set of conditions. Those conditions are stated once on the courses page rather
  than padded into six near-identical pages — which is also why there are no
  `/courses/[slug]` routes.
- **Testimonials render only when real ones exist.** `voices.items` ships empty
  in every language and the whole section stays out of the page until quotes are
  added. Add them with the student's consent, using their real name and role.
- **Photography.** `public/brand/` holds crops of the artwork the academy
  supplied. The originals are WhatsApp-compressed, so several stills are 230-700px
  wide. Replace them with full-resolution exports before launch.
  `students-certificates.jpg` shows identifiable students and their certificate
  numbers; it is deliberately not used on any page until written consent exists.
- **Facebook is text, not a link.** The academy gave a page name, not a URL.

## Still missing from the academy

These are the only things blocking a launch-ready site:

- WhatsApp number (booking channel one of two)
- An ordinary email inbox for the contact form
- A phone number, if they want one shown
- The Facebook page URL
- Student testimonials, with consent
- More before/after pairs (there is one)

## Tests

`npm test` covers what breaks silently: that the catalogue is still the six
published courses, that every official fact still matches the client document
verbatim, that every string the pages read exists in all four languages, that no
copy from the removed online-course build survived, that no price or refund claim
has crept back in, and that every referenced image exists on disk.

## Design system

One accent (champagne gold at two weights), one radius (2px, circles on icon
badges only), locked to the nude/beige ground — there is no dark variant, by
design. Tokens live at the top of `src/app/globals.css`. Motion is `motion/react`
only, gated behind `prefers-reduced-motion`.

## Known gaps

- Content lives in code rather than a CMS. Fine at this size; swap for Sanity or
  Payload when someone non-technical needs to edit it.
- No terms, privacy or cookie pages yet. An Italian business taking deposits
  needs at least a privacy notice.
- No analytics.
