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
| `src/app/[locale]/page.tsx` | Homepage: hero, manifesto, course selector, method, before/after, founder, gallery, the three claims, voices, six questions, closing frame |
| `src/app/[locale]/courses/page.tsx` | The six courses, the shared conditions, before/after |
| `src/app/[locale]/about/page.tsx` | Amira, the values, the business curriculum, the welcome message |
| `src/app/[locale]/faq/page.tsx` | All eleven questions, and the FAQ structured data |
| `src/app/[locale]/contact/page.tsx` | Enquiry form, channels, venue, the booking sequence |
| `src/lib/studio.ts` | Every official fact: brand names, address, legal data, social handles |
| `src/lib/courses.ts` | The six course slugs and their media |
| `src/lib/media.ts` | All art direction: posters, clips, crops, overlays, gallery composition |
| `src/lib/ui.ts` | The shared class strings (buttons, links, display sizes, page shell) |
| `src/lib/seo.tsx` | schema.org payloads: organisation, course list, person, FAQ |
| `messages/` | All copy, in `en` `it` `fr` `ar` |
| `public/brand/` | Academy photography, cut from the supplied artwork |

## Swapping a video or an image

Nothing on the pages hardcodes a file path. Every frame is a `Media` object in
`src/lib/media.ts`:

```ts
{ videoSrc, mobileVideoSrc, posterSrc, alt, position, mobilePosition, overlay }
```

`MediaFrame` renders the poster as a normal `next/image` (so it is the LCP
candidate and reserves its space) and layers the clip over it only when the
frame is near the viewport, the reader has not asked for reduced motion, and the
clip can actually play. To turn any still into a clip, set `videoSrc` and leave
the poster alone. `position` is a CSS `object-position`; phones use
`mobilePosition` where the vertical crop needs a different focal point.

The homepage hero holds Amira in the arch. `heroMedia.videoSrc` is `null`, so
the portrait carries it; setting a clip there plays it inside the same frame.

## The logo

The academy's own artwork: a serif A with a swoosh over AURA over ACADEMY, gold
on black. The master is `public/brand/aura-logo-source.jpg` and it is never
edited. Everything the site shows is derived from it by

```bash
python3 scripts/build-logo.py
```

which writes three inks and two crops, plus the two files Next serves as the
tab icon and the iOS tile:

| File | Where it is used |
| --- | --- |
| `aura-logo-gold.png` | footer, opening sequence |
| `aura-logo-dark.png` | share card, schema.org `logo` |
| `aura-logo-light.png` | spare, for photography and black grounds |
| `aura-mark-{gold,dark,light}.png` | header, mobile menu, loading state |
| `src/app/icon.png`, `apple-icon.png` | browser tab, home screen |

**How the cutout works.** The master is gold on black, which is a premultiplied
composite: on black, what a pixel shows is the ink times its coverage. So the
alpha is arithmetic rather than a colour key. Coverage comes from the brightest
channel, because gold is weak in blue and a luma reading would thin the strokes,
and dividing each pixel by its own coverage recovers the ink with its metallic
gradient intact. The flat inks reuse that same alpha with a hardened ramp, since
one solid colour at the gradient's own coverage reads as a washed out letter.

**Three rules worth keeping.** Gold only on near-black. Every piece of site
chrome carries the monogram, never the plate: the lockup is stacked, and in a
76px header its ACADEMY line would land four pixels tall. The full plate is
reserved for the two moments that are only the brand, the opening film and the
wait between routes.

`src/components/Logo.tsx` is the only component that knows any of this. Callers
pass a crop, an ink and a CSS height.

If the academy sends new artwork, replace the master and re-run the script. Do
not edit the derived files by hand; `npm test` checks that the whole set is
present, and the point of the pipeline is that the versions cannot drift apart.

The previous marks are in git history: the AB monogram from the salon wall, and
the arch A drawn before this artwork arrived.

## The opening sequence

A full-screen film that plays once per browser session before the homepage, and
fades into a page that is already rendered behind it.

Three beats: the logo holds the black while the clip loads, the film plays, and
then a beat before it runs out the film fades back to black and the logo returns
to sit alone for about a second. Logo and black then dissolve together over a
homepage already rising into place underneath. Skipping is immediate and does
not play the ending; only the clip reaching its own end does.

| Path | Role |
| --- | --- |
| `src/components/IntroVideo.tsx` | the overlay: playback, exits, skip control |
| `src/lib/intro.ts` | the bootstrap script, the session key, `endIntro()` |
| `src/lib/use-intro-ready.ts` | what entrance animations wait on |
| `public/videos/` | the film itself, see the README in that folder |
| `scripts/encode-intro.sh` | master file to webm + mp4 + poster |

Mounted in `src/app/[locale]/layout.tsx`, as three things in this order: the
inline bootstrap script, the black shield, then `<IntroVideo />`.

The script is the part worth understanding. It runs during HTML parse, before
anything paints, and decides whether the film is due: homepage only, not if
`aura-intro-played` is in `sessionStorage`, never under
`prefers-reduced-motion`, always if the URL carries `?intro=1`. It writes
`<html data-intro-pending>`, which is what shows the shield and locks scrolling.
Deciding this in React instead would flash a frame of the homepage before the
overlay covered it.

**Forcing a replay while working on it:** add `?intro=1` to the homepage URL.

The overlay can never hold the site hostage. It stands down on `ended`, on a
fade cue about a second before the end, on `error`, on a rejected autoplay
promise, on Escape, on the skip control, if playback has not started within six
seconds, or if a running clip freezes for three and a half. There is
deliberately no hard cap on a healthy clip: that would truncate the film. The
guards are against failure, not against length.

`Stagger` and `HeroPortrait` call `useIntroReady()`, so the hero's entrance
waits for the fade rather than playing out behind a black overlay.

### The hero master

`public/brand/amira-portrait-hero.jpg` is a graded derivative of
`amira-studio.jpg`, not a separate shoot. Both stay in the repo. To regenerate
after a retouch, or to soften the grade:

```python
from PIL import Image, ImageEnhance, ImageFilter
im = Image.open("public/brand/amira-studio.jpg").convert("RGB")
im = im.resize((1440, 1920), Image.LANCZOS)          # headroom for 2x displays
im = im.filter(ImageFilter.UnsharpMask(16, 14, 6))   # clarity, not edges
im = im.filter(ImageFilter.UnsharpMask(1.6, 46, 4))  # detail, gentle
im = ImageEnhance.Color(im).enhance(1.04)            # skin warmth, barely
im = ImageEnhance.Contrast(im).enhance(1.03)
im.save("public/brand/amira-portrait-hero.jpg", quality=92, subsampling=0,
        optimize=True, progressive=True)
```

The two unsharp passes are deliberately mild: the first is a large-radius local
contrast lift, the second a small-radius pass for lash and fabric detail. Push
either much further and it stops reading as photography.

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
- **One line per course, and it describes the technique.** `catalog.blurbs.*`
  says what microblading or lip blush *is*, in neutral terms. It makes no claim
  about the academy's version of it, because the academy supplied no per-course
  syllabus, price or duration. The shared conditions are stated once on the
  courses page rather than padded into six near-identical pages, which is also
  why there are no `/courses/[slug]` routes. Have the academy sign off the six
  lines before launch.
- **Testimonials render only when real ones exist.** `voices.items` ships empty
  in every language and the whole section stays out of the page until quotes are
  added. Add them with the student's consent, using their real name and role.
  See [Adding student testimonials](#adding-student-testimonials) for the shape.
  Four fabricated quotes from the removed online-course build are still in this
  repository's git history; `npm test` blocks them by name, because content that
  already exists somewhere is exactly what gets "restored" by mistake.
- **Photography.** `public/brand/` holds crops of the artwork the academy
  supplied. The originals are WhatsApp-compressed, so several stills are 230-700px
  wide. Replace them with full-resolution exports before launch.
  `students-certificates.jpg` shows identifiable students and their certificate
  numbers; it is deliberately not used on any page until written consent exists.
- **Facebook is text, not a link.** The academy gave a page name, not a URL.

## Adding student testimonials

The section is built and waiting. It is the only significant piece of proof the
homepage is missing, and it needs nothing from a developer: paste the quotes in
and it appears.

For each student, collect four things, **with their written consent to publish**:

| Field | What it is | Example shape |
| --- | --- | --- |
| `quote` | Their own words, one or two sentences. Not edited into marketing copy. | "..." |
| `name` | Real first and last name. | "..." |
| `role` | What they do now, and the town. This is what makes it checkable. | "Brow artist, Pescara" |
| `course` | *Optional.* The discipline they trained in, and the year. Shown in bronze small caps under the name. | "Powder Brows · 2026" |

Then add them to `voices.items` in **all four** `messages/*.json` files, using
the same keys in each. Only `quote` and `role` get translated; `name` and
`course` stay identical across languages.

```jsonc
// messages/en.json → "voices"
"items": {
  "giulia": {
    "quote": "Her words, as she said them.",
    "name": "Real Name",
    "role": "Brow artist, Pescara",
    "course": "Powder Brows · 2026"
  }
}
```

`npm test` enforces the rest: every locale must carry the same set of quotes,
every quote must have a name and a role in every language, and the four
fabricated quotes in git history can never come back. One quote is enough for
the section to render, and it drops the counter and arrows automatically.

## Still missing from the academy

These are the only things blocking a launch-ready site:

- WhatsApp number (booking channel one of two)
- An ordinary email inbox for the contact form
- A phone number, if they want one shown
- The Facebook page URL
- Student testimonials, with consent
- More before/after pairs (there is one)
- An abstract clip for the hero arch, if they want the frame to move (optional:
  the portrait carries the section as it is)
- Full-resolution exports of the course photography (several stills are 230-700px
  wide, which is thin for a panel that fills two thirds of the screen)

## Tests

`npm test` covers what breaks silently: that the catalogue is still the six
published courses, that every official fact still matches the client document
verbatim, that every string the pages read exists in all four languages, that no
copy from the removed online-course build survived, that no price or refund claim
has crept back in, and that every referenced image exists on disk.

## Design system

Editorial, not a UI kit. Two grounds (warm ivory `#F2EEE7` and near black
`#0B0A09`), espresso type, and one metal: bronze, used at hairline weight for
section numbers, rules and small labels. Raw bronze is 3.7:1 on ivory, so type
never uses it directly; `--aura-bronze-ink` and `--aura-bronze-hi` are the
text-safe weights per ground and both clear AA.

Everything is square. The only radius on the site is 2px on form fields. No
shadows, no glass, no gradient type, no filled progress tracks: hierarchy comes
from type size, ground colour and one-pixel hairlines.

Two faces: Cormorant Garamond for anything oversized, Jost for interface text,
Noto Naskh Arabic for `ar`. Tokens live at the top of `src/app/globals.css`,
shared class strings in `src/lib/ui.ts`.

Motion is `motion/react` only, and every animation is either a reveal, a 10-20px
parallax, a media cross-fade or a panel expansion. All of it is gated behind
`prefers-reduced-motion`, which also stops video from loading at all.

## Known gaps

- Content lives in code rather than a CMS. Fine at this size; swap for Sanity or
  Payload when someone non-technical needs to edit it.
- No terms, privacy or cookie pages yet. An Italian business taking deposits
  needs at least a privacy notice.
- No analytics.
