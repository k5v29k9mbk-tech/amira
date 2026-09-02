/**
 * Create the academy's two accounts.
 *
 *   npm run seed:users              create anything missing, leave the rest alone
 *   npm run seed:users -- --reset   also reset the password of accounts that exist
 *
 * Both accounts are created with `must_change_password = true`, so the password
 * that travels from here to Amira is a one-time token rather than a
 * credential: phase 7 forces it to be replaced at first login.
 *
 * IT DOES NOT OVERWRITE BY DEFAULT, and that is the important behaviour. A seed
 * script that upserts is a seed script that silently resets a live password the
 * day somebody re-runs it during a deploy. Existing accounts are reported and
 * skipped; `--reset` is the deliberate act, typed by a person who meant it.
 */
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from "../src/lib/db/schema.ts";
import { hashPassword, MIN_PASSWORD_LENGTH } from "../src/lib/auth/password.ts";

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error("DATABASE_URL is not set. Put it in .env.local; see .env.example.");
  process.exit(1);
}

const reset = process.argv.includes("--reset");

/**
 * A password nobody chose and nobody has to remember, for the case where the
 * environment does not supply one.
 *
 * 24 bytes of `randomBytes` is 192 bits before encoding. base64url rather than
 * hex so it stays short enough to read down a telephone, and rather than plain
 * base64 so it survives being pasted into a URL or a shell without quoting.
 */
const generatePassword = () => randomBytes(24).toString("base64url");

type Seed = {
  role: "owner" | "editor";
  email: string | undefined;
  name: string;
  password: string;
  generated: boolean;
};

function read(role: "owner" | "editor", fallbackName: string): Seed {
  const prefix = `ADMIN_${role.toUpperCase()}`;
  const supplied = process.env[`${prefix}_PASSWORD`]?.trim();
  return {
    role,
    email: process.env[`${prefix}_EMAIL`]?.trim().toLowerCase(),
    name: process.env[`${prefix}_NAME`]?.trim() || fallbackName,
    password: supplied || generatePassword(),
    generated: !supplied,
  };
}

const seeds = [read("owner", "Amira Bechini"), read("editor", "Editor")];

const missing = seeds.filter((s) => !s.email);
if (missing.length) {
  console.error(
    `Missing ${missing.map((s) => `ADMIN_${s.role.toUpperCase()}_EMAIL`).join(" and ")}. See .env.example.`,
  );
  process.exit(1);
}

/* A supplied password is checked against the same floor the admin panel will
   enforce, so a weak one cannot be smuggled in through the environment. A
   generated one is far above it. */
const weak = seeds.filter((s) => !s.generated && s.password.length < MIN_PASSWORD_LENGTH);
if (weak.length) {
  console.error(
    `These passwords are shorter than ${MIN_PASSWORD_LENGTH} characters: ${weak
      .map((s) => `ADMIN_${s.role.toUpperCase()}_PASSWORD`)
      .join(", ")}.`,
  );
  process.exit(1);
}

if (seeds[0].email === seeds[1].email) {
  console.error("The owner and the editor cannot share an email address.");
  process.exit(1);
}

const sql = postgres(url, { max: 1 });
const db = drizzle(sql);

/** What to print at the end: one line per account, passwords last. */
const created: { email: string; role: string; password: string; generated: boolean }[] = [];

try {
  for (const seed of seeds) {
    const email = seed.email as string;
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length && !reset) {
      console.log(`· ${email} (${seed.role}) already exists — left untouched.`);
      continue;
    }

    const passwordHash = await hashPassword(seed.password);

    if (existing.length) {
      await db
        .update(users)
        .set({ passwordHash, role: seed.role, name: seed.name, mustChangePassword: true })
        .where(eq(users.email, email));
      console.log(`↻ ${email} (${seed.role}) password reset.`);
    } else {
      await db
        .insert(users)
        .values({ email, passwordHash, name: seed.name, role: seed.role, mustChangePassword: true });
      console.log(`✓ ${email} (${seed.role}) created.`);
    }

    created.push({ email, role: seed.role, password: seed.password, generated: seed.generated });
  }

  const generated = created.filter((c) => c.generated);
  if (generated.length) {
    console.log(
      "\nThese passwords were generated and are NOT stored anywhere else.\n" +
        "Copy them now, give them to their owner over a channel you trust, and\n" +
        "delete your copy. Each must be changed at first sign-in.\n",
    );
    for (const c of generated) console.log(`  ${c.role.padEnd(6)} ${c.email}\n         ${c.password}\n`);
  }

  if (!created.length) {
    console.log("\nNothing to do. Re-run with `-- --reset` to reset existing passwords.");
  }
} catch (error) {
  console.error("Seeding failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await sql.end();
}
