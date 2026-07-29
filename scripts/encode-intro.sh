#!/usr/bin/env bash
# Turns one master file into the three the opening sequence loads.
#
#   ./scripts/encode-intro.sh path/to/master.mp4
#
# Writes public/videos/aura-intro.{webm,mp4} and aura-intro-poster.webp.
# Needs ffmpeg (brew install ffmpeg).
set -euo pipefail

SRC="${1:?usage: encode-intro.sh <master video>}"
OUT="public/videos"
mkdir -p "$OUT"

# 1920 wide is enough for a full-screen cover crop; the file is downloaded
# before anything else on the page, so weight matters more than pixels.
SCALE="scale='min(1920,iw)':-2"

echo "→ mp4 (H.264, plays everywhere)"
ffmpeg -y -loglevel error -i "$SRC" \
  -vf "$SCALE" -c:v libx264 -profile:v high -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart -an \
  "$OUT/aura-intro.mp4"

echo "→ webm (VP9, offered first)"
ffmpeg -y -loglevel error -i "$SRC" \
  -vf "$SCALE" -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -an \
  "$OUT/aura-intro.webm"

# Homebrew's ffmpeg is not always built with libwebp, and Pillow is already the
# project's image tool (see the hero master in the README), so the frame comes
# out of ffmpeg as PNG and is converted in one line.
echo "→ poster (first frame)"
ffmpeg -y -loglevel error -i "$SRC" \
  -vf "$SCALE,select=eq(n\,0)" -frames:v 1 \
  "$OUT/.poster.png"
python3 -c "
from PIL import Image
Image.open('$OUT/.poster.png').convert('RGB').save('$OUT/aura-intro-poster.webp', quality=82, method=6)
" || {
  echo "  Pillow missing (pip install pillow); keeping the PNG."
  mv "$OUT/.poster.png" "$OUT/aura-intro-poster.png"
  echo "  Point introMedia.posterSrc in src/lib/media.ts at the .png."
  exit 1
}
rm -f "$OUT/.poster.png"

ls -lh "$OUT"/aura-intro.*
echo
echo "Audio is stripped on purpose: the intro plays muted, so the track is"
echo "weight nobody hears. Drop -an from both commands if that ever changes."
