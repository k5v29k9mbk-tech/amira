"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { supabaseBrowser, supabaseConfigured } from "@/lib/supabase/client";
import { btnPrimary, field, label } from "@/lib/ui";

export function AuthForm({ next }: { next?: string }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [status, setStatus] = useState<"idle" | "working" | "check" | "error">("idle");
  const [message, setMessage] = useState("");

  if (!supabaseConfigured) {
    return (
      <p className="border border-line bg-surface p-6 leading-relaxed text-muted">
        {t("demoMode")}
      </p>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const supabase = supabaseBrowser();
    if (!supabase) return;

    const data = new FormData(e.currentTarget);
    const email = String(data.get("email"));
    const password = String(data.get("password"));
    setStatus("working");

    const { error } =
      mode === "signIn"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/dashboard` },
          });

    if (error) {
      setMessage(error.message || t("error"));
      setStatus("error");
      return;
    }

    if (mode === "signUp") {
      setStatus("check");
      return;
    }

    router.replace(next ?? "/dashboard");
    router.refresh();
  }

  if (status === "check") {
    return (
      <p className="border border-accent bg-surface p-6 leading-relaxed text-bone">
        {t("checkEmail")}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <label className={label} htmlFor="email">
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={field}
        />
      </div>

      <div className="grid gap-2">
        <label className={label} htmlFor="password">
          {t("password")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={8}
          autoComplete={mode === "signIn" ? "current-password" : "new-password"}
          required
          className={field}
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-accent-hi">
          {message}
        </p>
      )}

      <button type="submit" disabled={status === "working"} className={btnPrimary}>
        {status === "working" ? t("working") : t(mode)}
      </button>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "signIn" ? "signUp" : "signIn");
          setStatus("idle");
        }}
        className="text-start text-sm text-muted underline underline-offset-4 hover:text-bone"
      >
        {mode === "signIn" ? t("toggleToSignUp") : t("toggleToSignIn")}
      </button>
    </form>
  );
}
