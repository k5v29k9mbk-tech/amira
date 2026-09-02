import { SessionProvider } from "next-auth/react";
import { Logo } from "@/components/Logo";
import { adminHint, adminNotice, adminPanel, adminTitle } from "@/lib/admin/ui";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/password";
import { requireUser } from "@/lib/auth/session";
import { PasswordForm } from "./PasswordForm";

/**
 * Choose a new password.
 *
 * It sits OUTSIDE the `(dash)` group on purpose. That group's layout calls
 * `requireAdmin()`, which redirects while `must_change_password` is set, so a
 * page inside it could never be reached in the state it exists to resolve.
 * Living outside also means no navigation is rendered around it: while the flag
 * is set there is nowhere else to go, and offering links that all redirect back
 * here would be a worse answer than not offering them.
 *
 * `SessionProvider` is here rather than in the admin root layout because this
 * is the only page that needs it -- the form has to re-issue the JWT once the
 * database row has changed, or the proxy keeps reading a token that still says
 * the password must be changed.
 */
export default async function PasswordPage() {
  const user = await requireUser();
  const forced = user.mustChangePassword;

  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo variant="mark" tone="dark" className="h-12 w-auto" />
          <h1 className={`${adminTitle} mt-5`}>
            {forced ? "Scegli la tua password" : "Cambia password"}
          </h1>
          <p className={`${adminHint} mt-1.5`}>{user.email}</p>
        </div>

        {forced ? (
          <p className={`${adminNotice} mb-5`}>
            Questo è il primo accesso. Per proseguire scegli una password che conosci solo
            tu: quella che ti è stata consegnata non sarà più valida.
          </p>
        ) : null}

        <div className={`${adminPanel} p-6`}>
          <SessionProvider>
            <PasswordForm forced={forced} minLength={MIN_PASSWORD_LENGTH} />
          </SessionProvider>
        </div>
      </div>
    </main>
  );
}
