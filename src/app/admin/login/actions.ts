"use server";

import { AuthError } from "next-auth";
import { INVALID_CREDENTIALS, signIn } from "@/lib/auth";
import { ADMIN_HOME } from "@/lib/auth/config";

export type LoginState = { error?: string };

/**
 * A callbackUrl is only ever used if it is a path on this site.
 *
 * `//evil.example` and `https://evil.example` are both absolute to a browser,
 * and both would take a freshly signed-in admin off the property. So the test
 * is not "does it look safe" but "is it a single slash followed by something
 * that is not another slash", which no absolute URL can satisfy.
 */
function safeCallback(raw: FormDataEntryValue | null): string {
  const value = typeof raw === "string" ? raw : "";
  if (!value.startsWith("/") || value.startsWith("//")) return ADMIN_HOME;
  return value;
}

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  const redirectTo = safeCallback(form.get("callbackUrl"));

  try {
    await signIn("credentials", { email, password, redirectTo });
    return {};
  } catch (error) {
    /**
     * ONLY AuthError IS HANDLED HERE, AND EVERYTHING ELSE IS RETHROWN.
     *
     * A SUCCESSFUL sign-in also leaves through this catch: `signIn` navigates
     * by throwing Next's redirect, which is not an `AuthError`. Swallowing it
     * would turn every correct password into a silent no-op on a form that
     * never navigates. Rethrowing is what makes the happy path work, so the
     * order of these two branches is load-bearing.
     */
    if (error instanceof AuthError) {
      /* `authorize()` puts its message in `code`; anything else -- a
         misconfigured secret, a database that is down -- must not be echoed to
         the browser, so it falls back to the generic wording. */
      const code = (error as AuthError & { code?: string }).code;
      return { error: code && code !== "credentials" ? code : INVALID_CREDENTIALS };
    }
    throw error;
  }
}
