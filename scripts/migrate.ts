/**
 * Apply every pending migration in `drizzle/`.
 *
 *   npm run db:migrate
 *
 * Run from a terminal or a deploy step, never from a request. It uses its own
 * single connection rather than `src/lib/db/index.ts`, because that module is
 * marked `server-only` and carries a pool sized for serving traffic; a
 * migration wants one connection that closes when it is done.
 */
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error("DATABASE_URL is not set. Put it in .env.local; see .env.example.");
  process.exit(1);
}

/**
 * `max: 1` is required, not a tuning choice. Migrations run inside a
 * transaction that takes locks on the tables it alters; a pool would let a
 * second statement queue behind a lock its own transaction holds and the
 * script would hang rather than fail.
 */
/**
 * Which folder of migrations to apply. Defaults to the project's own.
 *
 * The override exists for the local verification harness, which runs against a
 * WASM Postgres that has no `citext` extension and therefore needs the
 * `lower(email)` variant of the first migration. Production never passes it.
 */
const folderIndex = process.argv.indexOf("--folder");
const folder = folderIndex >= 0 ? process.argv[folderIndex + 1] : "./drizzle";

const sql = postgres(url, { max: 1 });

try {
  await migrate(drizzle(sql), { migrationsFolder: folder });
  console.log(`Migrations applied from ${folder}.`);
} catch (error) {
  console.error("Migration failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await sql.end();
}
