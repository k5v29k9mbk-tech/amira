import { adminShell } from "@/lib/admin/ui";
import { requireAdmin } from "@/lib/auth/session";
import { AdminHeader } from "./AdminHeader";

/**
 * The signed-in shell.
 *
 * `requireAdmin()` runs here as well as in the proxy. The proxy checked a
 * signed token; this checks the database, so an account deleted or set back to
 * "must change password" ten seconds ago is stopped on the next render rather
 * than at the end of the token's thirty days.
 */
export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="flex min-h-dvh flex-col">
      <AdminHeader user={user} />
      <main className={`${adminShell} w-full flex-1 py-8`}>{children}</main>
    </div>
  );
}
