# Card faces

Static TTF instances for `src/app/[locale]/opengraph-image.tsx` only — satori
shapes text with the fonts it is handed, so the share card needs real files
where the site itself uses `next/font`. Read at build time; never shipped to a
browser.

- `CormorantGaramond-Medium.ttf` — the display face, weight 500.
- `MarkaziText-Medium.ttf` — the Arabic face, weight 500, and the reason the
  Arabic card carries its sentence at all. Not the site's Noto Naskh: that
  face (and Amiri, Lateef, Scheherazade) trips satori's font parser
  (`lookupType: 5 - substFormat: 3`); Markazi is the closest naskh-flavoured
  face that parses.

Both from Google Fonts, licensed under the SIL Open Font License 1.1.
