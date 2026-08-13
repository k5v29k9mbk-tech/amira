import { existsSync } from "node:fs";
import { join } from "node:path";
import { introMedia } from "./media";

/**
 * Whether the opening film is actually on disk. Server only: it reads the file
 * system once, when the module is first imported, and the layout uses it to
 * decide whether to emit the opening sequence at all.
 *
 * This closes a hole that only opens when the academy has not sent the film,
 * which is the state the repository has been in the whole time. The bootstrap
 * script decides the intro is due from the route, the session flag and the
 * motion preference, and it has no way to know whether there is anything to
 * play: it marks the document pending, CSS paints the black shield over the
 * first frame, and the overlay then mounts, asks a <video> with two dead
 * sources to play, and waits for that to fail. Best case a first-time visitor
 * gets black for as long as hydration takes and then a 1.4 second fade off it;
 * worst case the play promise never settles and the six second watchdog is what
 * ends it. Either way the site's opening moment is a blank screen and a
 * download of nothing.
 *
 * Checked on the mp4 because that is the source every browser can play and the
 * one the test treats as the trigger for the set having to be complete: with an
 * mp4 present, `npm test` requires the webm and the poster beside it.
 *
 * Drop the three files into public/videos and the sequence turns itself back
 * on, with no code change and no flag to remember.
 */
export const introFilmReady = existsSync(
  join(process.cwd(), "public", introMedia.mp4Src),
);
