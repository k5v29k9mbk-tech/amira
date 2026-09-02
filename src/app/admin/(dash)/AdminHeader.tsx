import { Logo } from "@/components/Logo";
import { adminHeader, adminShell } from "@/lib/admin/ui";
import type { User } from "@/lib/db/schema";
import { signOutAction } from "./actions";

const ROLE_LABEL: Record<User["role"], string> = {
  owner: "Titolare",
  editor: "Redazione",
};

export function AdminHeader({ user }: { user: User }) {
  return (
    <header className={adminHeader}>
      <div className={`${adminShell} flex h-14 items-center justify-between gap-4`}>
        <div className="flex items-center gap-3">
          <Logo variant="mark" tone="dark" className="h-7 w-auto" sizes="60px" />
          <span className="font-serif text-[17px] leading-none text-espresso">Aura Academy</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-[12.5px] text-mute sm:inline">
            {user.name}
            <span className="mx-1.5 text-hair">·</span>
            {ROLE_LABEL[user.role]}
          </span>

          {/* A form and not a link, because signing out changes state: a GET
              that ends a session can be triggered by any image tag on any page
              a browser happens to load. */}
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-[12.5px] text-mute underline decoration-hair underline-offset-4 transition-colors hover:text-espresso"
            >
              Esci
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
