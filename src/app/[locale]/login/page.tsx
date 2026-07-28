import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthForm } from "@/components/AuthForm";
import { sectionTitle, shell } from "@/lib/ui";
import { Stagger, StaggerItem } from "@/components/Stagger";
import { Wordmark } from "@/components/Wordmark";
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
        <Stagger className="lg:col-span-5">
          <StaggerItem>
            <Wordmark />
          </StaggerItem>
          <StaggerItem>
            <h1 className={`${sectionTitle} mt-10`}>{t("title")}</h1>
          </StaggerItem>
          <StaggerItem>
            <span aria-hidden className="mt-6 flex items-center gap-3">
              <span className="h-px w-16 bg-accent/70" />
              <span className="text-[8px] text-accent">◆</span>
            </span>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-6 max-w-[38ch] leading-[1.85] text-muted">{t("sub")}</p>
          </StaggerItem>
        </Stagger>
        <Stagger delay={0.3} className="lg:col-span-5 lg:col-start-8 lg:self-center">
          <StaggerItem>
            {/* The form sits on a panel so the page reads as a composition
                rather than two columns of loose text. */}
            <div className="rounded-[2px] border border-line bg-surface p-8 shadow-[0_18px_50px_color-mix(in_srgb,var(--accent)_10%,transparent)] md:p-10">
              <AuthForm next={next} />
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </div>
  );
}
