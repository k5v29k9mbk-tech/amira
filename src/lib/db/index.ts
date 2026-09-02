import "server-only";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * The one database handle the application uses.
 *
 * `server-only` is the first line of the brief's "no service-role key ever
 * reaches the browser". It is not a convention: importing this file from a
 * client component is a BUILD ERROR, so the connection string cannot leak by
 * somebody adding "use client" to the top of a file that imports it. The other
 * lines are that `DATABASE_URL` carries no `NEXT_PUBLIC_` prefix, so it is
 * never inlined into a bundle, and that nothing here is re-exported from a
 * module a client component can reach.
 */

type Db = PostgresJsDatabase<typeof schema>;

/**
 * One pool per process, kept on `globalThis` across hot reloads.
 *
 * Without this, every edit in `next dev` builds a fresh module instance and a
 * fresh pool, and Postgres starts refusing connections after a couple of dozen
 * saves.
 */
const globalForDb = globalThis as unknown as { conn?: postgres.Sql; db?: Db };

/**
 * CONNECTING IS DEFERRED TO THE FIRST QUERY, AND THAT IS ABOUT BUILDS.
 *
 * `next build` imports every route module to discover what it exports. If the
 * connection were opened at import time, a build would need a reachable
 * database merely to find out which pages are static -- so CI could not
 * typecheck a branch, and a deploy would fail at the wrong step with a message
 * about the wrong thing. Admin routes are dynamic and query nothing during a
 * build, so nothing here runs until a request does.
 *
 * WHAT IS NOT DEFERRED IS THE LOUDNESS. A missing `DATABASE_URL` still throws
 * rather than degrading. The Supabase CMS this replaces was built to fail soft,
 * and that was right for an overlay laid over the repository's own copy; it is
 * wrong here, because from phase 4 this database IS the copy, and a site that
 * quietly renders with no words on it is worse than a site that says why.
 */
function connect(): Db {
  if (globalForDb.db) return globalForDb.db;

  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. The admin panel and the public site's copy both read from it; see .env.example.",
    );
  }

  const conn =
    globalForDb.conn ??
    postgres(connectionString, {
      /* Serverless invocations are short and numerous; a large per-instance
         pool just multiplies idle connections against the database's limit.
         `DB_POOL_MAX` lowers it for a database with a small connection budget
         -- a free tier, or the single-connection WASM Postgres the local
         verification harness runs on. */
      max: Number(process.env.DB_POOL_MAX) || 10,
      /* Transaction poolers (PgBouncer, Neon's pooled endpoint, Supabase's
         6543) do not support the extended protocol's prepared statements.
         Turning them off costs a little planning time and makes the same code
         work against a direct connection and a pooled one. */
      prepare: false,
    });

  const db = drizzle(conn, { schema });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.conn = conn;
    globalForDb.db = db;
  }
  return db;
}

/**
 * Looks and behaves exactly like a Drizzle database; the connection is opened
 * on the first property read rather than when this module is imported.
 *
 * Methods are bound to the real instance because Drizzle's builders rely on
 * `this`, and an unbound `db.select` handed around would lose it.
 */
export const db: Db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const real = connect();
    const value = Reflect.get(real, prop, receiver);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export { schema };
