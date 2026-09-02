import test from "node:test";
import assert from "node:assert/strict";

import { hashPassword, verifyPassword, passwordProblem, MIN_PASSWORD_LENGTH } from "./password.ts";

test("passwords are hashed with argon2id at the parameters we chose", async () => {
  const hash = await hashPassword("a correct horse battery staple");

  // The variant is written into the hash, so this is what stops `ARGON2ID`
  // silently becoming Argon2i or Argon2d. See the comment on that constant for
  // why the value is a literal rather than the library's enum member.
  assert.ok(hash.startsWith("$argon2id$"), `not argon2id: ${hash.slice(0, 20)}`);
  assert.match(hash, /^\$argon2id\$v=19\$m=19456,t=2,p=1\$/);
});

test("the same password hashes differently every time", async () => {
  // A per-hash salt is what stops two people who chose the same password being
  // visibly identical in the users table, and stops a precomputed table working.
  const [a, b] = await Promise.all([hashPassword("same password"), hashPassword("same password")]);
  assert.notEqual(a, b);
});

test("verification accepts the password and rejects everything else", async () => {
  const hash = await hashPassword("the real password");

  assert.equal(await verifyPassword(hash, "the real password"), true);
  assert.equal(await verifyPassword(hash, "the real passwor"), false);
  assert.equal(await verifyPassword(hash, "The Real Password"), false);
  assert.equal(await verifyPassword(hash, ""), false);
});

test("a corrupt hash is a failed login, not a crashed page", async () => {
  // A row that argon2 cannot parse must answer "no". Throwing would turn one
  // bad row into a 500 on the login form, which is both worse to use and a
  // signal to whoever is probing it.
  for (const corrupt of ["", "not a hash", "$argon2id$truncated", "$2b$10$bcryptnotargon"]) {
    assert.equal(await verifyPassword(corrupt, "anything"), false, `threw or passed on: ${corrupt}`);
  }
});

test("passwords shorter than the floor are refused, longer ones accepted", () => {
  assert.equal(passwordProblem("x".repeat(MIN_PASSWORD_LENGTH)), null);
  assert.equal(passwordProblem("x".repeat(MIN_PASSWORD_LENGTH + 40)), null);

  const short = passwordProblem("x".repeat(MIN_PASSWORD_LENGTH - 1));
  assert.ok(short, "a short password was accepted");
  assert.match(String(short), new RegExp(String(MIN_PASSWORD_LENGTH)));

  // Length only: NIST SP 800-63B dropped composition rules, so four ordinary
  // words must pass even with no digit, symbol or capital in sight.
  assert.equal(passwordProblem("correct horse battery staple"), null);
});
