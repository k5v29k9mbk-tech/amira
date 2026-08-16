#!/usr/bin/env swift
//
// Maps a before/after photograph onto the brow-band canvas the results slider
// uses, so the two frames of a pair sit on the same pixels and the wipe reads
// as one face rather than as two photographs.
//
//   swift scripts/align-pair.swift <in.jpg> <out.jpg> [--check]
//
// WHY THIS EXISTS. lib/studio.ts states the rule for a pair — "the eyes sit on
// the same pixels in both" — and until now that alignment was done by hand,
// which is fine for one pair and hopeless for a set: two photographs of the
// same client taken weeks apart differ in head roll, distance from the lens and
// framing, and matching them by eye means matching three things at once. This
// does it from the faces themselves.
//
// THE CANVAS, AND WHERE THE NUMBERS COME FROM. They are measured off
// brows-after.jpg, the frame the academy already approved and shipped: 900x620,
// pupils at (148, 415) and (755, 425). So the convention is a tight band from
// the hairline to the cheekbone, eyes level, pupils spanning two thirds of the
// width and sitting a little over two thirds of the way down. Every new pair is
// mapped to exactly that, which is what makes two sliders on one page read as
// one editorial set rather than as two crops.
//
// HOW. Vision finds the eyes; the rest is one similarity transform — rotate by
// the measured roll, scale so the interpupillary distance matches, translate so
// the midpoint between the eyes lands on the canvas point. No warping, no
// per-feature morphing: the face is never reshaped, only placed.
//
// --check prints what it would do and writes nothing, including the scale
// factor. A factor above 1 means the source is being enlarged into the canvas
// and the frame will be soft; a phone original is normally 0.4 to 0.6 here.

import Foundation
import Vision
import AppKit

// The shipped frame, measured. Changing these re-frames every pair on the site.
let CANVAS = (w: 900.0, h: 620.0)
let TARGET_IPD = 607.0
let TARGET_MID = (x: 451.0, y: 420.0)

let args = CommandLine.arguments
guard args.count > 2 else {
    print("usage: swift scripts/align-pair.swift <in> <out> [--check]")
    exit(1)
}
let src = URL(fileURLWithPath: args[1])
let dst = URL(fileURLWithPath: args[2])
let checkOnly = args.contains("--check")

guard let img = NSImage(contentsOf: src),
      let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    print("cannot read \(src.path)"); exit(1)
}
let W = Double(cg.width), H = Double(cg.height)

let request = VNDetectFaceLandmarksRequest()
try VNImageRequestHandler(cgImage: cg, options: [:]).perform([request])
guard let face = (request.results as? [VNFaceObservation])?.first,
      let landmarks = face.landmarks,
      let leftEye = landmarks.leftEye, let rightEye = landmarks.rightEye else {
    print("no face found in \(src.lastPathComponent)"); exit(2)
}

/// Landmarks are normalised to the face box, which is normalised to the image,
/// origin bottom left. This returns top-left pixels, which is how the canvas
/// numbers above are written and how anyone reading a crop off a file thinks.
func centre(_ region: VNFaceLandmarkRegion2D) -> (x: Double, y: Double) {
    var sx = 0.0, sy = 0.0
    for p in region.normalizedPoints { sx += Double(p.x); sy += Double(p.y) }
    let n = Double(region.pointCount)
    let b = face.boundingBox
    let x = (Double(b.origin.x) + (sx / n) * Double(b.width)) * W
    let yUp = (Double(b.origin.y) + (sy / n) * Double(b.height)) * H
    return (x, H - yUp)
}

let l = centre(leftEye), r = centre(rightEye)
let dx = r.x - l.x, dy = r.y - l.y
let ipd = (dx * dx + dy * dy).squareRoot()
let roll = atan2(dy, dx)
let mid = (x: (l.x + r.x) / 2, y: (l.y + r.y) / 2)
let scale = TARGET_IPD / ipd

print(String(format: "%@  %.0fx%.0f  ipd %.0f  roll %.1f°  scale %.2f%@",
             src.lastPathComponent, W, H, ipd, roll * 180 / .pi, scale,
             scale > 1 ? "  (ENLARGING — the frame will be soft)" : ""))
if checkOnly { exit(0) }

let space = CGColorSpace(name: CGColorSpace.sRGB)!
guard let ctx = CGContext(data: nil, width: Int(CANVAS.w), height: Int(CANVAS.h),
                          bitsPerComponent: 8, bytesPerRow: 0, space: space,
                          bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue) else { exit(1) }
ctx.interpolationQuality = .high

// Work top-left so the constants above mean what they say.
ctx.translateBy(x: 0, y: CGFloat(CANVAS.h))
ctx.scaleBy(x: 1, y: -1)

// Place the eye midpoint, straighten the roll, match the distance, then draw
// the photograph about its own midpoint. Read bottom-up, it is: move the eyes
// to the origin, level them, size them, move them to where the canvas wants.
ctx.translateBy(x: CGFloat(TARGET_MID.x), y: CGFloat(TARGET_MID.y))
ctx.rotate(by: CGFloat(-roll))
ctx.scaleBy(x: CGFloat(scale), y: CGFloat(scale))
ctx.translateBy(x: CGFloat(-mid.x), y: CGFloat(-mid.y))

// One more flip for the draw itself, since CGContext.draw fills its rect from
// the bottom left of the image.
ctx.translateBy(x: 0, y: CGFloat(H))
ctx.scaleBy(x: 1, y: -1)
ctx.draw(cg, in: CGRect(x: 0, y: 0, width: W, height: H))

guard let out = ctx.makeImage() else { exit(1) }
let rep = NSBitmapImageRep(cgImage: out)
try rep.representation(using: .jpeg, properties: [.compressionFactor: 0.86])!.write(to: dst)
print("→ \(dst.lastPathComponent)  \(Int(CANVAS.w))x\(Int(CANVAS.h))")
