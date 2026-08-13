"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { btnSolid, field, fieldLabel } from "@/lib/ui";

type State = "idle" | "sending" | "sent" | "error";

/**
 * The enquiry form.
 *
 * Three things beyond the fields themselves, and each of them earns its line:
 *
 * The form element is held in a ref rather than read off the event. `reset()`
 * ran against `e.currentTarget` after an await, and React nulls that out the
 * moment the handler returns: the fields kept their contents after a
 * successful send, which is only invisible because the form is replaced by the
 * confirmation.
 *
 * The honeypot is a real input, positioned off screen, hidden from assistive
 * technology and excluded from tab order. Bots fill every field they find; a
 * person never sees this one. The server drops anything that arrives with it
 * set, and answers 200 anyway, because telling a bot it was caught is how it
 * learns to stop filling it in. There is no other spam control on a form that
 * posts to a real inbox.
 *
 * The state lives in a polite live region. Sending, failing and succeeding were
 * all visual only, so a screen reader pressed send and heard nothing at all.
 */
export function ContactForm() {
  const t = useTranslations("contact");
  const [state, setState] = useState<State>("idle");
  const form = useRef<HTMLFormElement>(null);

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
      if (res.ok) form.current?.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <p
        role="status"
        className="border border-espresso bg-paper p-8 text-lg leading-snug tracking-tight text-espresso"
      >
        {t("sent")}
      </p>
    );
  }

  const required = (
    <span className="text-bronze-ink" title={t("required")}>
      <span aria-hidden>*</span>
      <span className="sr-only">{t("required")}</span>
    </span>
  );

  return (
    <form ref={form} onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className={fieldLabel} htmlFor="name">
            {t("name")} {required}
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            className={field}
          />
        </div>
        <div className="grid gap-2">
          <label className={fieldLabel} htmlFor="email">
            {t("email")} {required}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            dir="ltr"
            required
            maxLength={160}
            className={field}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className={fieldLabel} htmlFor="subject">
          {t("subject")}
        </label>
        <input id="subject" name="subject" maxLength={160} className={field} />
      </div>

      <div className="grid gap-2">
        <label className={fieldLabel} htmlFor="message">
          {t("message")} {required}
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

      {/* Never seen, never focused, never announced. `display: none` would be
          worse: the simpler bots skip hidden fields and fill the rest.

          Clipped rather than pushed off screen. A honeypot parked at
          `left: -9999px` is off screen in a left-to-right document and 9999px
          of horizontal scroll in a right-to-left one, which would have made
          the Arabic contact page pan sideways for no visible reason. */}
      <div aria-hidden className="sr-only">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <p aria-live="polite" className="sr-only">
        {state === "sending" ? t("sending") : state === "error" ? t("error") : ""}
      </p>

      {state === "error" && (
        <p role="alert" className="text-sm text-bronze-ink">
          {t("error")}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={state === "sending"}
          className={`${btnSolid} w-full sm:w-auto`}
        >
          {state === "sending" ? t("sending") : t("send")}
        </button>
      </div>
    </form>
  );
}
