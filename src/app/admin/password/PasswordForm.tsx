"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useFormStatus } from "react-dom";
import { adminButton, adminError, adminField, adminFieldLabel, adminHint } from "@/lib/admin/ui";
import { changePassword, type PasswordState } from "./actions";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`${adminButton} w-full`} disabled={pending}>
      {pending ? "Salvataggio…" : label}
    </button>
  );
}

export function PasswordForm({ forced, minLength }: { forced: boolean; minLength: number }) {
  const [state, formAction] = useActionState<PasswordState, FormData>(changePassword, {});
  const { update } = useSession();
  const router = useRouter();

  /**
   * The token still says `mustChangePassword: true` after the database row has
   * been updated, and the proxy reads the token. Without refreshing it, the
   * redirect below bounces straight back to this page.
   *
   * `update()` re-issues the JWT through the `jwt` callback's `trigger ===
   * "update"` branch, which is what clears the flag in the cookie.
   */
  useEffect(() => {
    if (!state.done) return;
    (async () => {
      await update({ mustChangePassword: false });
      router.replace("/admin");
      router.refresh();
    })();
  }, [state.done, update, router]);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.error ? (
        <p className={adminError} role="alert">
          {state.error}
        </p>
      ) : null}

      <div>
        <label htmlFor="current" className={adminFieldLabel}>
          Password attuale
        </label>
        <input
          id="current"
          name="current"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className={adminField}
        />
      </div>

      <div>
        <label htmlFor="next" className={adminFieldLabel}>
          Nuova password
        </label>
        <input
          id="next"
          name="next"
          type="password"
          autoComplete="new-password"
          required
          minLength={minLength}
          className={adminField}
        />
        <p className={`${adminHint} mt-1.5`}>
          Almeno {minLength} caratteri. Non servono numeri o simboli: una frase che ricordi
          è più sicura di una parola breve piena di segni.
        </p>
      </div>

      <div>
        <label htmlFor="confirm" className={adminFieldLabel}>
          Ripeti la nuova password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={minLength}
          className={adminField}
        />
      </div>

      <Submit label={forced ? "Salva e continua" : "Cambia password"} />
    </form>
  );
}
