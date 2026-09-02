import type { Config } from "drizzle-kit";

/**
 * `generate` needs none of the credentials below -- it diffs the TypeScript
 * schema against the files in `drizzle/` and never opens a socket. They are
 * here for `drizzle-kit studio` and for the occasional `push` against a
 * scratch database.
 *
 * Migrations are applied by `scripts/migrate.ts` rather than `drizzle-kit
 * migrate`, so that the same command runs in a terminal and in a deploy step
 * and reads `.env.local` the same way the seed script does.
 */
export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
  strict: true,
  verbose: true,
} satisfies Config;
