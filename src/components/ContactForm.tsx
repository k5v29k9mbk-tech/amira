"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { btnPrimary, field, label } from "@/lib/ui";

type State = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const t = useTranslations("contact");
  const [state, setState] = useState<State>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setState(res.ok ? "sent" : "error");
      if (res.ok) e.currentTarget.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <p className="border border-accent bg-surface p-8 text-lg leading-snug tracking-tight text-bone">
        {t("sent")}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className={label} htmlFor="name">
            {t("name")}
          </label>
          <input id="name" name="name" required maxLength={120} className={field} />
        </div>
        <div className="grid gap-2">
          <label className={label} htmlFor="email">
            {t("email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={160}
            className={field}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className={label} htmlFor="subject">
          {t("subject")}
        </label>
        <input id="subject" name="subject" maxLength={160} className={field} />
      </div>

      <div className="grid gap-2">
        <label className={label} htmlFor="message">
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={4000}
          className={`${field} resize-y`}
        />
      </div>

      {state === "error" && (
        <p role="alert" className="text-sm text-accent-hi">
          {t("error")}
        </p>
      )}

      <div>
        <button type="submit" disabled={state === "sending"} className={btnPrimary}>
          {state === "sending" ? t("sending") : t("send")}
        </button>
      </div>
    </form>
  );
}
