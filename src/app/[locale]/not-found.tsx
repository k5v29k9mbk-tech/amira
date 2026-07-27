import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { btnPrimary, shell } from "@/lib/ui";

export default async function NotFound() {
  const t = await getTranslations("nav");
  return (
    <div className={`${shell} flex min-h-[70dvh] flex-col justify-center py-32`}>
      <p className="font-mono text-6xl tracking-tighter text-accent">404</p>
      <Link href="/" className={`${btnPrimary} mt-10 self-start`}>
        {t("cta")}
      </Link>
    </div>
  );
}
