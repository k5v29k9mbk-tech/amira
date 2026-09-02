"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { audit } from "@/lib/auth/audit";
import { hashPassword, passwordProblem, verifyPassword } from "@/lib/auth/password";
import { requireUser } from "@/lib/auth/session";

export type PasswordState = { error?: string; done?: boolean };

export async function changePassword(
  _prev: PasswordState,
  form: FormData,
): Promise<PasswordState> {
  /* `requireUser`, not `requireAdmin`: this is the one page that has to work
     while `must_change_password` is still set, and `requireAdmin` would bounce
     it back here forever. */
  const user = await requireUser();

  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  const confirm = String(form.get("confirm") ?? "");

  /**
   * The current password is required even though the person is already signed
   * in. A session cookie is not proof that the person at the keyboard is the
   * account holder -- an unlocked laptop is the ordinary case -- and without
   * this, changing the password is a one-click account takeover for anyone who
   * walks past.
   */
  if (!(await verifyPassword(user.passwordHash, current))) {
    return { error: "La password attuale non è corretta." };
  }

  const problem = passwordProblem(next);
  if (problem) return { error: problem };

  if (next !== confirm) {
    return { error: "Le due nuove password non coincidono." };
  }

  if (await verifyPassword(user.passwordHash, next)) {
    return { error: "La nuova password deve essere diversa da quella attuale." };
  }

  await db
    .update(users)
    .set({ passwordHash: await hashPassword(next), mustChangePassword: false })
    .where(eq(users.id, user.id));

  /* No password, old or new, and no hash goes into the history row. It records
     that the change happened and by whom, which is all an audit log needs. */
  await audit({ userId: user.id, action: "password_changed", entity: `user:${user.id}` });

  return { done: true };
}
