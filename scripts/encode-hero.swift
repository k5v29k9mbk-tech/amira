#!/usr/bin/env swift
//
// Turns the academy's camera master into the two cuts the hero film loads.
//
//   swift scripts/encode-hero.swift path/to/master.MOV
//
// Writes public/brand/hero-class.mp4 (1080x1920, 2.6 Mbit/s) and
// public/brand/hero-class-mobile.mp4 (720x1280, 1.4 Mbit/s), both trimmed to
// the last frame with light in it and both stripped of their audio track.
//
// WHY THIS IS SWIFT AND NOT A LINE OF FFMPEG, like `encode-intro.sh` beside it.
// macOS ships no ffmpeg, and the machine this was cut on had none; AVFoundation
// is already on every Mac. Two things follow, and both are the reason this file
// is worth keeping rather than a one-off:
//
//   - `AVAssetExportSession`'s named presets are useless here. They fix the
//     bitrate internally, and asked for this clip they produced files LARGER
//     than the 10.8MB source: 13.5MB at 720p, 8.7MB at 540p. The only way to
//     ask for a bitrate on this platform is to drive the encoder directly,
//     which is what the reader/writer pair below does.
//   - The trim and the audio strip are free here. The reader is given a time
//     range and only the video track is wired to the writer.
//
// If ffmpeg is ever available, the equivalent is roughly:
//
//   ffmpeg -i master.MOV -t 14.7 -an -c:v libx264 -profile:v high -crf 21 \
//     -preset slow -pix_fmt yuv420p -movflags +faststart out.mp4
//
// THE SETTINGS, AND WHY THESE NUMBERS. 2.6 Mbit/s at the full frame measures
// 41.8 and 43.7 dB PSNR against the master at 6s and 12s, which is past visible
// on a still and far past it on 30fps of handheld footage under the hero's 42%
// grade. 3.5 Mbit/s was measured too: 1.6MB heavier, and no better. The keyframe
// interval is three seconds so a loop restart is cheap, and
// `shouldOptimizeForNetworkUse` puts the moov atom before the mdat, which is
// what lets playback start on the first bytes instead of the last.

import AVFoundation
import Foundation

/** The last frame with light in it. The master runs 19.1s and fades to black at
    about 14.8; a background that loops has no use for the black. */
let END = 14.7

struct Cut {
    let name: String
    let width: Int
    let height: Int
    let kbps: Int
}

let cuts = [
    Cut(name: "hero-class.mp4", width: 1080, height: 1920, kbps: 2600),
    // 720 is the honest resolution for a 390pt phone at 2x, and the connection
    // most likely to be metered is the one that gets this file.
    Cut(name: "hero-class-mobile.mp4", width: 720, height: 1280, kbps: 1400),
]

guard CommandLine.arguments.count > 1 else {
    print("usage: swift scripts/encode-hero.swift <master video>")
    exit(1)
}
let src = URL(fileURLWithPath: CommandLine.arguments[1])
let outDir = URL(fileURLWithPath: "public/brand")

func encode(_ cut: Cut) throws {
    let dst = outDir.appendingPathComponent(cut.name)
    try? FileManager.default.removeItem(at: dst)

    let asset = AVURLAsset(url: src)
    guard let track = asset.tracks(withMediaType: .video).first else {
        print("no video track in \(src.lastPathComponent)")
        exit(1)
    }

    // Scaling happens in a video composition, so the reader hands the writer
    // buffers that are already the size being encoded.
    let range = CMTimeRange(start: .zero, end: CMTime(seconds: END, preferredTimescale: 600))
    let comp = AVMutableVideoComposition()
    comp.renderSize = CGSize(width: cut.width, height: cut.height)
    comp.frameDuration = CMTime(value: 1, timescale: 30)

    let inst = AVMutableVideoCompositionInstruction()
    inst.timeRange = range
    let layer = AVMutableVideoCompositionLayerInstruction(assetTrack: track)
    let scale = CGAffineTransform(
        scaleX: CGFloat(cut.width) / track.naturalSize.width,
        y: CGFloat(cut.height) / track.naturalSize.height
    )
    layer.setTransform(track.preferredTransform.concatenating(scale), at: .zero)
    inst.layerInstructions = [layer]
    comp.instructions = [inst]

    let reader = try AVAssetReader(asset: asset)
    reader.timeRange = range
    let output = AVAssetReaderVideoCompositionOutput(
        videoTracks: [track],
        videoSettings: [
            kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange
        ]
    )
    output.videoComposition = comp
    output.alwaysCopiesSampleData = false
    reader.add(output)

    let writer = try AVAssetWriter(outputURL: dst, fileType: .mp4)
    writer.shouldOptimizeForNetworkUse = true
    let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: cut.width,
        AVVideoHeightKey: cut.height,
        AVVideoCompressionPropertiesKey: [
            AVVideoAverageBitRateKey: cut.kbps * 1000,
            AVVideoMaxKeyFrameIntervalKey: 90,
            AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
            AVVideoAllowFrameReorderingKey: true,
            AVVideoH264EntropyModeKey: AVVideoH264EntropyModeCABAC,
            AVVideoExpectedSourceFrameRateKey: 30,
        ],
    ])
    input.expectsMediaDataInRealTime = false
    writer.add(input)

    writer.startWriting()
    writer.startSession(atSourceTime: .zero)
    reader.startReading()

    let done = DispatchSemaphore(value: 0)
    input.requestMediaDataWhenReady(on: DispatchQueue(label: "encode-hero")) {
        while input.isReadyForMoreMediaData {
            guard let buffer = output.copyNextSampleBuffer() else {
                input.markAsFinished()
                writer.finishWriting { done.signal() }
                return
            }
            input.append(buffer)
        }
    }
    done.wait()

    guard writer.status == .completed else {
        print("→ \(cut.name) FAILED: \(writer.error?.localizedDescription ?? "unknown")")
        exit(1)
    }
    let attrs = try? FileManager.default.attributesOfItem(atPath: dst.path)
    let bytes = (attrs?[.size] as? Int) ?? 0
    print(String(format: "→ %@  %dx%d  %.2f MB", cut.name, cut.width, cut.height,
                 Double(bytes) / 1_048_576))
}

for cut in cuts { try encode(cut) }
