# Amira Bechini

Premium e-learning platform for filmed beauty-artistry masterclasses. Next.js 16, Tailwind v4, Supabase, Stripe, Mux. Four languages including Arabic with full RTL.

```bash
npm install
cp .env.example .env.local   # every block is optional, see below
npm run dev
npm test                     # logic self-checks, no framework
```

## What is where

| Path | Purpose |
| --- | --- |
| `src/app/[locale]/page.tsx` | Homepage: hero, numbers, instructor, method, catalogue, testimonials, FAQ, contact |
| `src/app/[locale]/courses/` | Catalogue and course detail with curriculum and purchase panel |
| `src/app/[locale]/learn/[slug]/[lesson]/` | HD video lesson, curriculum rail, progress |
| `src/app/[locale]/dashboard/` | Student dashboard, per-course progress, certificate link |
| `src/app/[locale]/certificate/[id]/` | Certificate of completion, print or save as PDF |
| `src/lib/courses.ts` | Course structure, pricing, Mux playback ids |
| `messages/` | All copy, in `en` `it` `fr` `ar` |
| `supabase/schema.sql` | Tables and row-level security |

## Running without keys

The site runs with an empty `.env.local`. Anything that needs a third party shows its
"not connected yet" state instead of crashing: sign in, checkout, and signed video
playback. Everything else, including all four languages, works.

## Switching the real thing on

**Supabase.** Create a project, run `supabase/schema.sql` in the SQL editor, then set
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and
`SUPABASE_SERVICE_ROLE_KEY`. Row-level security means a student can only ever read their
own enrollments and can only write progress for a course they paid for.

**Stripe.** Create one Price per course, put the four ids in `STRIPE_PRICE_*`, set
`STRIPE_SECRET_KEY`, then point a webhook at `/api/stripe/webhook` for
`checkout.session.completed` and set `STRIPE_WEBHOOK_SECRET`. The webhook is the only
thing that grants course access, so a forged client request cannot unlock a course.

**Mux.** Upload each lesson and paste its playback id into `src/lib/courses.ts`. For
private playback, create a signing key and set `MUX_SIGNING_KEY_ID` and
`MUX_SIGNING_KEY_PRIVATE` (base64 of the PEM). Tokens are minted server side per request
and last three hours.

**Contact form.** Set `RESEND_API_KEY` and `CONTACT_TO`. Without them the form still
accepts messages and logs them server side, so nothing is silently dropped.

## Design system

One accent (jade), one radius (0), one theme family with a light variant that follows
`prefers-color-scheme`. Tokens live at the top of `src/app/globals.css`; change them there
and the whole site follows. Motion is `motion/react` only, gated behind
`prefers-reduced-motion`.

Images are Picsum placeholders seeded per section. Replace the URLs in `src/lib/courses.ts`
and the two `picsum.photos` calls in `src/app/[locale]/page.tsx` with real photography
before launch.

## Known gaps

- Supabase session refresh is not wired into `src/proxy.ts`, so a very long idle tab may
  need a page reload to re-authenticate.
- Course content lives in code rather than a CMS. Fine for four courses, swap for Sanity or
  Payload when someone non-technical needs to edit it.
- Certificates print from the browser rather than being generated as PDFs server side.
