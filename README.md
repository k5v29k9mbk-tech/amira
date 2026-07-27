# Amira Bechini Masterclass

Permanent makeup e-learning platform. Next.js 16, Tailwind v4, Supabase, Stripe, Mux. Four languages including Arabic with full RTL.

```bash
npm install
cp .env.example .env.local   # every block is optional, see below
npm run dev
npm test                     # logic + translation-completeness checks, no framework
```

## What is where

| Path | Purpose |
| --- | --- |
| `src/app/[locale]/page.tsx` | Homepage: hero, credentials, instructor, method, catalogue, results, FAQ, contact |
| `src/app/[locale]/courses/` | Catalogue and course detail with curriculum and purchase panel |
| `src/app/[locale]/learn/[slug]/[lesson]/` | HD video lesson, curriculum rail, progress |
| `src/app/[locale]/dashboard/` | Student dashboard, per-course progress, certificate link |
| `src/app/[locale]/certificate/[id]/` | Certificate of completion, print or save as PDF |
| `src/lib/courses.ts` | Course structure, pricing, Mux playback ids, image paths |
| `messages/` | All copy, in `en` `it` `fr` `ar` |
| `public/brand/` | Studio photography, cut from the supplied artwork |
| `supabase/schema.sql` | Tables and row-level security |

## Running without keys

The site runs with an empty `.env.local`. Anything that needs a third party shows its
"not connected yet" state instead of crashing: sign in, checkout, and signed video
playback. Everything else, including all four languages, works.

## Switching the real thing on

**Supabase.** Create a project, run `supabase/schema.sql` in the SQL editor, then set
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the publishable key) and
`SUPABASE_SERVICE_ROLE_KEY` (the secret key). Row-level security means a student can only
ever read their own enrollments and can only write progress for a course they paid for.

**Stripe.** Create one Price per course, put the three ids in `STRIPE_PRICE_BROW`,
`STRIPE_PRICE_LIP`, `STRIPE_PRICE_VIP`, set `STRIPE_SECRET_KEY`, then point a webhook at
`/api/stripe/webhook` for `checkout.session.completed` and set `STRIPE_WEBHOOK_SECRET`.
The webhook is the only thing that grants course access, so a forged client request
cannot unlock a course.

**Mux.** Upload each lesson and paste its playback id into `src/lib/courses.ts`. For
private playback, create a signing key and set `MUX_SIGNING_KEY_ID` and
`MUX_SIGNING_KEY_PRIVATE` (base64 of the PEM). Tokens are minted server side per request
and last three hours.

**Contact form.** Set `RESEND_API_KEY` and `CONTACT_TO`. Without them the form still
accepts messages and logs them server side, so nothing is silently dropped.

## Content rules

Everything on the site is either supplied by the studio or verifiable. There are no
invented statistics, credentials or reviews.

- **Testimonials render only when real ones exist.** `voices.items` ships empty in every
  language and the whole section stays out of the page until quotes are added. Add them
  with the student's consent, using their real name and role.
- **Photography.** `public/brand/` holds crops of the artwork the studio supplied. The
  originals are WhatsApp-compressed, so several stills are 230-700px wide. Replace them
  with full-resolution exports before launch. `students-certificates.jpg` shows
  identifiable students and their certificate numbers; it is deliberately not used on any
  page until written consent exists.
- **Credential claims.** "PhiBrows Master" and "International certification" come from the
  studio's own flyers. PhiBrows is a third-party trademark, referenced by name only; none
  of its logos or certificate designs are reproduced here.

## Tests

`npm test` covers the parts that break silently: lesson-id uniqueness across courses
(a duplicate would make one course's progress advance another), progress and resume
maths, certificate-code stability, that every course, module and lesson is translated in
all four languages, that no orphan translation strings survive a catalogue change, and
that every referenced image exists on disk.

## Design system

One accent (champagne gold at two weights), one radius (2px, circles on icon badges only),
light-primary with an espresso variant on `prefers-color-scheme`. Tokens live at the top
of `src/app/globals.css`. Motion is `motion/react` only, gated behind
`prefers-reduced-motion`.

## Known gaps

- Course content lives in code rather than a CMS. Fine for three courses, swap for Sanity
  or Payload when someone non-technical needs to edit it.
- Certificates print from the browser rather than being generated as PDFs server side.
- No terms, privacy or refund pages yet. Stripe requires links to them before going live,
  and the FAQ already promises a fourteen-day refund.
