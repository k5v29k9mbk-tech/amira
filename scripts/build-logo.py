"""
Derives every logo asset the site uses from the one file the academy supplied.

    python3 scripts/build-logo.py

The master is gold artwork on a black field, which is a premultiplied
composite: on black, what a pixel shows *is* the ink times its coverage. So the
cutout is not a colour key, it is arithmetic. Coverage comes from the brightest
channel (gold is weak in blue, so luma would thin the strokes), and dividing the
pixel by its own coverage recovers the ink, gradient and all.

Everything below is derived from that single alpha channel, which is why the
gold, black and ivory versions are the same artwork rather than three drawings.

Nothing here redesigns the logo. It trims, cuts alpha, recolours flat, and
crops the monogram out of the lockup for the small sizes where the two words
would be unreadable.
"""

from pathlib import Path

import numpy as np
from PIL import Image

BRAND = Path("public/brand")
APP = Path("src/app")
SRC = BRAND / "aura-logo-source.jpg"

ESPRESSO = (0x21, 0x19, 0x16)
IVORY = (0xF2, 0xEE, 0xE7)
BLACK = (0x0B, 0x0A, 0x09)

# Longest edge of the exported lockup. next/image resizes down per breakpoint,
# so one generous master covers phone through retina desktop.
LOCKUP_W = 1100
MARK_W = 640
ICON = 512
APPLE = 180


def straight_alpha(img: Image.Image) -> tuple[np.ndarray, np.ndarray]:
    """Returns (rgb 0-1, alpha 0-1) recovered from a composite on black."""
    a = np.asarray(img.convert("RGB")).astype(np.float32) / 255.0
    coverage = a.max(axis=2)

    # Full ink, measured rather than assumed: the brightest 0.2% of the plate.
    full = float(np.percentile(coverage, 99.8))
    alpha = np.clip(coverage / full, 0.0, 1.0)

    # JPEG leaves a faint haze across the black. Pull the bottom of the ramp to
    # zero so the cutout has a clean field, and leave the rest linear so the
    # antialiased edges of the hairlines survive.
    alpha = np.clip((alpha - 0.07) / 0.93, 0.0, 1.0)

    rgb = np.clip(a / np.maximum(alpha, 1e-3)[..., None], 0.0, 1.0)
    return rgb, alpha


def to_image(rgb: np.ndarray, alpha: np.ndarray) -> Image.Image:
    out = np.dstack([rgb, alpha[..., None]])
    return Image.fromarray((out * 255).round().astype(np.uint8), "RGBA")


def flat(alpha: np.ndarray, colour: tuple[int, int, int]) -> Image.Image:
    """
    The same coverage, inked in one flat colour.

    The gold in the master carries a metallic gradient, which the alpha channel
    faithfully records as a swing from full to about half coverage across a
    single stroke. Gold wants that. One flat ink does not: it reads as a washed
    out letter. So the ramp is hardened, everything above roughly 60% coverage
    goes solid, and only the true edges stay soft enough to antialias.
    """
    solid = np.clip((alpha - 0.06) / 0.52, 0.0, 1.0)
    h, w = alpha.shape
    rgb = np.empty((h, w, 3), np.float32)
    rgb[:] = np.array(colour, np.float32) / 255.0
    return to_image(rgb, solid)


def fit(img: Image.Image, width: int) -> Image.Image:
    if img.width <= width:
        return img
    return img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)


def save(img: Image.Image, name: str) -> None:
    path = BRAND / name if name.endswith(".png") and "/" not in name else Path(name)
    img.save(path, optimize=True)
    print(f"  {path}  {img.width}x{img.height}")


def tile(mark: Image.Image, size: int, pad: float = 0.11) -> Image.Image:
    """The monogram centred on the brand's own black, for tab and home screen."""
    inner = round(size * (1 - pad * 2))
    m = mark.copy()
    m.thumbnail((inner, inner), Image.LANCZOS)
    out = Image.new("RGBA", (size, size), BLACK + (255,))
    out.paste(m, ((size - m.width) // 2, (size - m.height) // 2), m)
    return out


def main() -> None:
    master = Image.open(SRC)
    rgb, alpha = straight_alpha(master)

    lockup = to_image(rgb, alpha)
    box = lockup.getbbox()
    lockup, alpha = lockup.crop(box), alpha[box[1] : box[3], box[0] : box[2]]

    # Split the plate where the artwork itself leaves a gap: the widest band of
    # empty rows in the upper half is the space under the monogram.
    rows = alpha.sum(axis=1)
    empty = rows < rows.max() * 0.004
    best = run = 0
    end = 0
    for i, blank in enumerate(empty[: int(len(empty) * 0.62)]):
        run = run + 1 if blank else 0
        if run > best:
            best, end = run, i
    cut = end + 1

    mark_a = alpha[:cut]
    mark = lockup.crop((0, 0, lockup.width, cut))
    mark_box = mark.getbbox()
    mark, mark_a = mark.crop(mark_box), mark_a[mark_box[1] : mark_box[3], mark_box[0] : mark_box[2]]

    print("building:")
    save(fit(lockup, LOCKUP_W), "aura-logo-gold.png")
    save(fit(flat(alpha, ESPRESSO), LOCKUP_W), "aura-logo-dark.png")
    save(fit(flat(alpha, IVORY), LOCKUP_W), "aura-logo-light.png")
    save(fit(mark, MARK_W), "aura-mark-gold.png")
    save(fit(flat(mark_a, ESPRESSO), MARK_W), "aura-mark-dark.png")
    save(fit(flat(mark_a, IVORY), MARK_W), "aura-mark-light.png")

    # Next reads these two by filename, so they are metadata rather than art.
    save(tile(mark, ICON), str(APP / "icon.png"))
    save(tile(mark, APPLE), str(APP / "apple-icon.png"))


if __name__ == "__main__":
    main()
