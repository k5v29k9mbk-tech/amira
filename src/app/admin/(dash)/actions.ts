"use server";

import { signOut } from "@/lib/auth";
import { audit } from "@/lib/auth/audit";
import { currentUser } from "@/lib/auth/session";
import { LOGIN_PATH } from "@/lib/auth/config";

/**
 * Sign out, and record that it happened.
 *
 * The audit row is written BEFORE `signOut`, because `signOut` navigates by
 * throwing a redirect and nothing after it runs.
 */
export async function signOutAction() {
  const user = await currentUser();
  if (user) {
    await audit({ userId: user.id, action: "logout", entity: `user:${user.id}` });
  }
  await signOut({ redirectTo: LOGIN_PATH });
}
