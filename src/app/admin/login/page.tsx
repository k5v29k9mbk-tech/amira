import { Logo } from "@/components/Logo";
import { adminHint, adminPanel, adminTitle } from "@/lib/admin/ui";
import { ADMIN_HOME } from "@/lib/auth/config";
import { LoginForm } from "./LoginForm";

/**
 * The sign-in page.
 *
 * The proxy already sends a signed-in visitor away from here, so this renders
 * for anonymous traffic only and does not need its own session check.
 *
 * `callbackUrl` is read here and passed through the form so that being bounced
 * out of a deep page and back in returns to that page. It is validated in the
 * action rather than trusted from the query string.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-[380px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo variant="mark" tone="dark" className="h-12 w-auto" />
          <h1 className={`${adminTitle} mt-5`}>Amministrazione</h1>
          <p className={`${adminHint} mt-1.5`}>
            Accedi per modificare i testi e le fotografie del sito.
          </p>
        </div>

        <div className={`${adminPanel} p-6`}>
          <LoginForm callbackUrl={callbackUrl ?? ADMIN_HOME} />
        </div>
      </div>
    </main>
  );
}
