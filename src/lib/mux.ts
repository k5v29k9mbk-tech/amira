import { createHmac, createSign } from "node:crypto";

/**
 * Signed Mux playback token. Without a signing key the player falls back to
 * public playback, which is fine for the free preview lessons only.
 */
export function muxPlaybackToken(playbackId: string, ttlSeconds = 60 * 60 * 3) {
  const keyId = process.env.MUX_SIGNING_KEY_ID;
  const secret = process.env.MUX_SIGNING_KEY_PRIVATE; // base64-encoded RSA private key
  if (!keyId || !secret || !playbackId) return null;

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT", kid: keyId };
  const payload = { sub: playbackId, aud: "v", exp: now + ttlSeconds, kid: keyId };

  const b64 = (o: object) =>
    Buffer.from(JSON.stringify(o)).toString("base64url");
  const signingInput = `${b64(header)}.${b64(payload)}`;

  const pem = Buffer.from(secret, "base64").toString("utf8");
  const signature = createSign("RSA-SHA256")
    .update(signingInput)
    .sign(pem)
    .toString("base64url");

  return `${signingInput}.${signature}`;
}

/** Stable, non-guessable certificate code derived from the enrollment id. */
export function certificateCode(enrollmentId: string) {
  const secret = process.env.CERTIFICATE_SECRET ?? "amira-bechini-dev";
  return createHmac("sha256", secret)
    .update(enrollmentId)
    .digest("hex")
    .slice(0, 12)
    .toUpperCase();
}
