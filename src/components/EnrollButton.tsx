"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "@phosphor-icons/react";
import { btnPrimary } from "@/lib/ui";

export function EnrollButton({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const [state, setState] = useState<"idle" | "working" | "unavailable">("idle");

  async function checkout() {
    setState("working");
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, locale }),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok && data.url) {
      window.location.href = data.url;
      return;
    }
    if (res.status === 401 && data.signIn) {
      window.location.href = data.signIn;
      return;
    }
    setState("unavailable");
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={checkout}
        disabled={state === "working"}
        className={`${btnPrimary} w-full sm:w-auto`}
      >
        {state === "working" ? t("checkout.working") : t("catalog.enroll")}
        <ArrowRight size={16} weight="light" className="flip-x" />
      </button>
      {state === "unavailable" && (
        <p role="alert" className="mt-3 text-sm text-muted">
          {t("checkout.unavailable")}
        </p>
      )}
    </div>
  );
}
