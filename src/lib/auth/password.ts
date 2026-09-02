import { hash, verify, type Algorithm } from "@node-rs/argon2";

/**
 * Argon2id, at the parameters OWASP names as the floor for this algorithm:
 * 19 MiB of memory, two passes, one lane.
 *
 * MEMORY IS THE POINT, not the iteration count. Argon2id is memory-hard, so
 * 19 MiB per guess is what makes a GPU or an ASIC farm uneconomic in a way
 * that raising `timeCost` alone never does. These are the library's own
 * defaults; they are written out anyway so that a future upgrade that changes
 * a default cannot silently weaken every password the site stores.
 *
 * The parameters are encoded in the hash itself (`$argon2id$v=19$m=19456,t=2,p=1$…`),
 * so raising them later verifies old hashes correctly and only new hashes get
 * the stronger settings.
 */
/**
 * `Algorithm.Argon2id`, written as its value.
 *
 * The library declares `Algorithm` as an ambient `const enum`, and this project
 * builds with `isolatedModules`, under which TypeScript refuses to inline one:
 * each file is transpiled alone, so it cannot see the enum's members. The
 * runtime object is real -- `require("@node-rs/argon2").Algorithm.Argon2id` is
 * 2 -- but the type-level name is unusable here.
 *
 * A wrong value cannot go unnoticed: argon2 writes the variant into the hash
 * it produces, so every stored password begins `$argon2id$` and `password.test.ts`
 * asserts it.
 */
const ARGON2ID = 2 as Algorithm;

const OPTIONS = {
  algorithm: ARGON2ID,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
} as const;

export const hashPassword = (plain: string) => hash(plain, OPTIONS);

/**
 * Returns false rather than throwing on a malformed or truncated hash.
 *
 * A stored value that argon2 cannot parse is a corrupt row, and the answer to
 * "does this password match a corrupt row" is no. Letting it throw would turn
 * one bad row into a 500 on the login page, which is both a worse experience
 * and a signal to whoever is probing it.
 */
export async function verifyPassword(storedHash: string, plain: string): Promise<boolean> {
  try {
    return await verify(storedHash, plain, OPTIONS);
  } catch {
    return false;
  }
}

/**
 * The floor for a password chosen through the admin panel.
 *
 * Length only, and deliberately no character-class rules. NIST SP 800-63B
 * dropped composition rules because they push people towards `Password1!`,
 * which is shorter and more guessable than three ordinary words. Twelve
 * characters is the floor; the seed script's generated passwords are far
 * longer.
 */
export const MIN_PASSWORD_LENGTH = 12;

export function passwordProblem(plain: string): string | null {
  if (plain.length < MIN_PASSWORD_LENGTH) {
    return `Choose a password of at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}
