import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthForm } from "@/components/AuthForm";
import { sectionTitle, shell } from "@/lib/ui";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { locale } = await params;
  const { next } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  return (
    <div className="flex min-h-[100dvh] items-center pt-28 pb-20">
      <div className={`${shell} grid gap-12 lg:grid-cols-12`}>
        <div className="lg:col-span-5">
          <h1 className={sectionTitle}>{t("title")}</h1>
          <p className="mt-5 max-w-[38ch] leading-relaxed text-muted">{t("sub")}</p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <AuthForm next={next} />
        </div>
      </div>
    </div>
  );
}
