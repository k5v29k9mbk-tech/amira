# Opening sequence

Drop the master promotional film in this folder as:

```
aura-intro.mp4
```

Then produce the web-optimised set:

```bash
./scripts/encode-intro.sh public/videos/aura-intro.mp4
```

That writes the three files the site actually loads:

| File | Role |
| --- | --- |
| `aura-intro.webm` | offered first, VP9, smallest |
| `aura-intro.mp4` | fallback, H.264, plays everywhere |
| `aura-intro-poster.webp` | first frame, shown before playback starts |

Paths are configured once, in `introMedia` in `src/lib/media.ts`.

Until these files exist the overlay finds no playable source, stands down
immediately, and the site behaves as though there were no intro at all.

## Notes

- The clip plays **muted**. Browsers block autoplay with sound, and the site
  never asks for it.
- It plays **once per browser session**. Force a replay while working on it with
  `?intro=1` on the homepage, e.g. `http://localhost:3000/en?intro=1`.
- It never plays for a visitor who has asked for reduced motion.
- Keep it short. Ten to twenty seconds is a title sequence; longer is a wall.
  The site fades it out roughly a second before the end, so the last frame is
  never seen.
