import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  customType,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { locales } from "../../i18n/routing.ts";

/**
 * The admin panel's four tables. Nothing the public site renders lives here
 * yet -- that arrives in phase 3 -- so an empty database is a site that still
 * serves exactly the copy in `messages/*.json`.
 */

/**
 * Case-insensitive text, for the one column that has to be: an email address.
 *
 * Drizzle has no citext type, so it is declared here rather than worked around
 * in application code. The alternative -- `text` plus `lower(email)` in every
 * query and a functional unique index -- is the same guarantee spelled out in
 * four places instead of one, and it fails the moment somebody writes a query
 * that forgets. `AMIRA@…` and `amira@…` are one account at the database level
 * or they are eventually two accounts.
 *
 * The extension it needs is created by the first migration.
 */
const citext = customType<{ data: string }>({
  dataType: () => "citext",
});

/**
 * The four published languages, inlined into a CHECK constraint.
 *
 * `sql.raw` rather than a bound parameter because this becomes DDL: a
 * parameterised value cannot appear in a table definition. The list is read
 * from `i18n/routing.ts`, so the languages the database accepts and the
 * languages the site routes are one declaration. Adding a fifth is then a
 * migration, which is the right amount of friction for a decision that also
 * needs 443 new strings.
 */
const localeList = sql.raw(`(${locales.map((l) => `'${l}'`).join(", ")})`);

/** The two accounts the brief asks for. Owner outranks editor; nothing else. */
export const userRole = pgEnum("user_role", ["owner", "editor"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: citext("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: userRole("role").notNull().default("editor"),
  /**
   * Set on every seeded and every reset account, cleared once the person has
   * chosen their own password. Phase 7 turns this into a forced redirect; it
   * is written from the start so those accounts do not need a backfill.
   */
  mustChangePassword: boolean("must_change_password").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * One row per page per language, holding the whole page as JSON.
 *
 * TWO COLUMNS, AND THE SEPARATION IS THE FEATURE. `draft` is what the editor
 * autosaves into and what preview renders; `published` is what the public site
 * reads and is only ever written by Publish. So Amira can leave a half-rewritten
 * Arabic page sitting for a week and the live site never knows.
 *
 * `published` is nullable and null means never published -- not "published as
 * empty". The phase 3 migration writes both columns from today's copy, so the
 * live site is fully published from the first moment the table has rows.
 *
 * The shape inside each column is decided by that page's Zod schema, which is
 * the subject of phase 3. The database deliberately does not know it: a schema
 * change is then a code change and a re-validate, not a migration.
 */
export const content = pgTable(
  "content",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    page: text("page").notNull(),
    locale: text("locale").notNull(),
    draft: jsonb("draft").notNull().default({}),
    published: jsonb("published"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    /**
     * Null when the row was written by a seed script rather than a person.
     * `set null` on delete rather than cascade, because removing an editor must
     * not remove the site's content.
     */
    updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
  },
  (t) => [
    unique("content_page_locale_key").on(t.page, t.locale),
    /* The public read is always (page, locale); the unique index above already
       serves it, so this one only covers the admin's "every language of this
       page" listing. */
    index("content_page_idx").on(t.page),
    check("content_locale_check", sql`${t.locale} in ${localeList}`),
  ],
);

export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** The Vercel Blob URL. Absolute, public, and immutable once written. */
  url: text("url").notNull().unique(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  bytes: integer("bytes").notNull(),
  mime: text("mime").notNull(),
  /**
   * Alt text per language: `{ "it": "…", "en": "…", "fr": "…", "ar": "…" }`.
   *
   * Per-locale rather than one string because alt text is read aloud to a
   * person using a screen reader, in the language of the page they are on. A
   * single shared string would read Italian to an Arabic reader.
   */
  alt: jsonb("alt").notNull().default({}),
  uploadedBy: uuid("uploaded_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Who changed what, and what it looked like before.
 *
 * `user_id` is `set null` on delete and NOT cascade. An audit log that deletes
 * itself when an account is removed is not an audit log; the row must outlive
 * the person, which is most of the reason to keep one.
 */
export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    /** `publish`, `login`, `upload`, `revert`, … */
    action: text("action").notNull(),
    /** What it happened to: `content:home:it`, `media:<id>`, `user:<id>`. */
    entity: text("entity").notNull(),
    before: jsonb("before"),
    after: jsonb("after"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    /* The history view at /admin/history reads newest-first, unfiltered. */
    index("audit_log_created_at_idx").on(t.createdAt.desc()),
    index("audit_log_entity_idx").on(t.entity),
  ],
);

/**
 * One row per FAILED sign-in attempt, counted inside a moving window.
 *
 * A TABLE RATHER THAN A COUNTER IN MEMORY, and that is forced by where this
 * runs. Serverless invocations do not share memory: a Map on the module scope
 * is per-instance, so five attempts spread across five cold starts each see a
 * count of one and the limit never fires. The database is the only thing every
 * invocation can agree on.
 *
 * ROWS RATHER THAN A COUNTER COLUMN, because the window has to move. A counter
 * needs a reset timestamp and a decision about what to do with an attempt that
 * straddles the boundary; counting rows newer than `now() - 15 minutes` has no
 * boundary to get wrong, and the lockout expires gradually as the oldest
 * attempts age out rather than all at once.
 *
 * `key` is namespaced -- `ip:203.0.113.4` or `email:amira@example.com` -- so
 * one table serves both limits the brief asks for. A successful sign-in clears
 * the rows for that email, so a person who mistypes twice and then gets it
 * right is not carrying four attempts into their next session.
 *
 * NOTHING HERE IS A SECRET, but an email address is personal data, so
 * `prune()` in `lib/auth/rate-limit.ts` deletes rows past the window rather
 * than letting a log of who tried to sign in accumulate forever.
 */
export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** `ip:<address>` or `email:<address>`. */
    key: text("key").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    /* The only read is "how many rows for this key since T", and the only
       write after that is "delete rows older than T". Both are served by this. */
    index("login_attempts_key_created_at_idx").on(t.key, t.createdAt),
  ],
);

export type User = typeof users.$inferSelect;
export type ContentRow = typeof content.$inferSelect;
export type MediaRow = typeof media.$inferSelect;
export type AuditRow = typeof auditLog.$inferSelect;
export type LoginAttemptRow = typeof loginAttempts.$inferSelect;
