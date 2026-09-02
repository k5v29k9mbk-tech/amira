import "server-only";
import { db } from "@/lib/db";
import { auditLog } from "@/lib/db/schema";

export type AuditAction =
  | "login"
  | "login_failed"
  | "logout"
  | "password_changed"
  | "publish"
  | "revert"
  | "media_upload"
  | "media_replace";

/**
 * Write one row to the audit log.
 *
 * IT SWALLOWS ITS OWN ERRORS, and that is a deliberate trade rather than
 * sloppiness. This is called from sign-in, from Publish and from upload; if the
 * insert throws -- a dropped connection, a full disk -- the choice is between
 * losing one history row and failing the action the person actually asked for.
 * Losing the row is the lesser harm, so the failure is logged to the server and
 * the caller continues.
 *
 * The one thing it must never do is throw inside `authorize()`, where an
 * exception is reported to the browser as a failed sign-in and would lock
 * somebody out of their own site because a log write failed.
 */
export async function audit(entry: {
  userId?: string | null;
  action: AuditAction;
  entity: string;
  before?: unknown;
  after?: unknown;
}) {
  try {
    await db.insert(auditLog).values({
      userId: entry.userId ?? null,
      action: entry.action,
      entity: entry.entity,
      before: entry.before === undefined ? null : entry.before,
      after: entry.after === undefined ? null : entry.after,
    });
  } catch (error) {
    console.error("[audit] could not write history row", entry.action, entry.entity, error);
  }
}
