#!/usr/bin/env swift
//
// Cuts one upright photograph out of a file that is not upright, or not one
// photograph.
//
//   swift scripts/rotate-crop.swift <in> <out> --rect X,Y,W,H [--rotate 90|180|270]
//
// WHY THIS EXISTS. `align-pair.swift` maps a face onto the results canvas and
// needs Vision to find that face, which it cannot do on a frame that arrives on
// its side or with two faces in it. This is the step before that one, and it is
// deliberately dumber: it takes a rectangle and a quarter turn, both given by
// hand off the file, and does nothing else.
//
// It was written for the Microblading card. The academy supplied that result as
// a two-up collage with the two copies rotated about 90 degrees in opposite
// directions, so no rotation of the whole frame stands both upright and no CSS
// can help — `object-position` pans, it does not rotate. The card's entry in
// lib/courses.ts records the rectangle and the turn used, so the poster can be
// regenerated from the original at any time.
//
// WHAT IT WILL NOT DO. No scaling, no grade, no retouch, no straightening by a
// free angle. A quarter turn is a relabelling of the pixel grid and a crop is a
// subset of it, so the photograph that comes out is the photograph that went
// in. Anything beyond that belongs in a decision someone records, not in a
// script that runs over a folder.

import Foundation
import AppKit
import CoreImage

func fail(_ m: String) -> Never { print(m); exit(1) }

let args = CommandLine.arguments
guard args.count > 2 else { fail("usage: swift scripts/rotate-crop.swift <in> <out> --rect X,Y,W,H [--rotate 90|180|270]") }

let src = URL(fileURLWithPath: args[1])
let dst = URL(fileURLWithPath: args[2])

guard let img = NSImage(contentsOf: src),
      let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { fail("cannot read \(src.path)") }

// The rectangle is written top-left, which is how anyone reading a crop off a
// file in a picture viewer thinks about it.
var rect = CGRect(x: 0, y: 0, width: cg.width, height: cg.height)
if let i = args.firstIndex(of: "--rect"), i + 1 < args.count {
    let n = args[i + 1].split(separator: ",").compactMap { Double($0) }
    guard n.count == 4 else { fail("--rect wants X,Y,W,H") }
    rect = CGRect(x: n[0], y: n[1], width: n[2], height: n[3])
}
guard rect.maxX <= Double(cg.width), rect.maxY <= Double(cg.height),
      rect.minX >= 0, rect.minY >= 0, rect.width > 0, rect.height > 0 else {
    fail("--rect falls outside the image, which is \(cg.width)x\(cg.height)")
}

var turn = 0
if let i = args.firstIndex(of: "--rotate"), i + 1 < args.count {
    guard let t = Int(args[i + 1]), [0, 90, 180, 270].contains(t) else {
        fail("--rotate wants 90, 180 or 270; a free angle would resample the photograph")
    }
    turn = t
}

guard let cropped = cg.cropping(to: rect) else { fail("crop failed") }

// Clockwise, expressed as the EXIF orientation that means the same thing, so
// the turn is done by the imaging stack rather than by a matrix written here.
let exif: Int32 = turn == 90 ? 6 : turn == 180 ? 3 : turn == 270 ? 8 : 1
var ci = CIImage(cgImage: cropped)
if exif != 1 { ci = ci.oriented(forExifOrientation: exif) }

guard let out = CIContext().createCGImage(ci, from: ci.extent) else { fail("render failed") }
let rep = NSBitmapImageRep(cgImage: out)
guard let data = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.92]) else { fail("encode failed") }
try data.write(to: dst)
print("→ \(dst.lastPathComponent)  \(out.width)x\(out.height)  (from \(Int(rect.width))x\(Int(rect.height)) at \(Int(rect.minX)),\(Int(rect.minY)), turned \(turn)°)")
