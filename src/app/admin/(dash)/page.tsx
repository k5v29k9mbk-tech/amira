import { adminHint, adminLabel, adminNotice, adminPanel, adminTitle } from "@/lib/admin/ui";
import { requireAdmin } from "@/lib/auth/session";

/**
 * The dashboard.
 *
 * A deliberate placeholder: the page list it will hold is generated from the
 * content schemas, and those arrive in phase 3. What it proves today is that
 * the session survives a navigation and that the shell renders.
 */
export default async function AdminHome() {
  const user = await requireAdmin();

  return (
    <div className="space-y-8">
      <div>
        <p className={adminLabel}>Amministrazione</p>
        <h1 className={`${adminTitle} mt-2`}>Ciao, {user.name.split(" ")[0]}</h1>
        <p className={`${adminHint} mt-1.5`}>
          Da qui potrai modificare i testi e le fotografie del sito in italiano, inglese,
          francese e arabo.
        </p>
      </div>

      <div className={`${adminPanel} p-5`}>
        <p className={adminLabel}>Prossimamente</p>
        <p className={`${adminNotice} mt-3`}>
          L’elenco delle pagine modificabili comparirà qui non appena i contenuti del sito
          saranno stati importati.
        </p>
      </div>
    </div>
  );
}
