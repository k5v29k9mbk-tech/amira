"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  adminButton,
  adminError,
  adminField,
  adminFieldLabel,
  adminHint,
} from "@/lib/admin/ui";
import { login, type LoginState } from "./actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`${adminButton} w-full`} disabled={pending}>
      {pending ? "Accesso in corso…" : "Accedi"}
    </button>
  );
}

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {state.error ? (
        /**
         * `role="alert"` and not merely red text. The person who most needs to
         * be told the password was wrong is the one who cannot see the form
         * change colour, and without a live region a screen reader announces
         * nothing at all when this appears after a submit.
         */
        <p className={adminError} role="alert">
          {state.error}
        </p>
      ) : null}

      <div>
        <label htmlFor="email" className={adminFieldLabel}>
          Indirizzo email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          spellCheck={false}
          /* An address typed on a phone arrives capitalised otherwise, and the
             lookup is case-insensitive anyway -- this is about what the person
             sees in the box matching what they think they typed. */
          autoCapitalize="none"
          className={adminField}
        />
      </div>

      <div>
        <label htmlFor="password" className={adminFieldLabel}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={adminField}
        />
      </div>

      <Submit />

      <p className={adminHint}>
        Hai dimenticato la password? Scrivi a chi gestisce il sito: può inviarti un nuovo
        accesso.
      </p>
    </form>
  );
}
