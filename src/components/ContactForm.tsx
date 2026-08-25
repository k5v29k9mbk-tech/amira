"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { courses } from "@/lib/courses";
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
 *
 * THE COURSE ARRIVES WITH THE VISITOR. Every "request a seat" on a programme
 * page carries `?course=<slug>`, and the subject field opens with that
 * discipline's name already in it, in the language the visitor is reading. It
 * is the difference between a form that asks a decided reader to type out what
 * she has just spent four minutes reading about, and one that has been
 * listening.
 *
 * WHY IT IS AN EFFECT AND NOT `useSearchParams`, WHICH IS THE INTERESTING PART.
 * The obvious implementation reads the hook and passes `defaultValue`. It costs
 * the page its form. `useSearchParams` opts its component out of static
 * rendering, so it has to sit inside a Suspense boundary, and what gets
 * prerendered into the static shell of /contact is then the boundary's
 * fallback: the enquiry form, on the page whose entire job is the enquiry form,
 * is absent from the HTML until JavaScript has run. That is worse for a crawler
 * and worse for anyone whose script fails, and it buys nothing the effect
 * cannot do.
 *
 * Reading `window.location.search` after mount keeps the whole form server
 * rendered and makes the prefill exactly what it should be: an enhancement.
 * With no JavaScript the form is a working form with an empty subject line,
 * which is where it started.
 *
 * The field is written through the ref rather than held in state for the same
 * reason `defaultValue` would have been right: it is prefilled and then hers. A
 * reader who followed the lip blush page and has decided on powder brows types
 * over it, and nothing fights her for the value.
 *
 * The slug is validated against the catalogue before it is used, so the field
 * cannot be filled from the query string with arbitrary text. That matters more
 * than it looks: the value is posted to a real inbox, and an unchecked
 * parameter reflected into a form is how a link becomes a way to put words in
 * someone else's message.
 */
export function ContactForm() {
  const t = useTranslations("contact");
  const catalog = useTranslations("catalog");
  const [state, setState] = useState<State>("idle");
  const subject = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("course");
    // Only a slug the catalogue actually publishes. Anything else is ignored
    // and the field stays as the server rendered it, which is empty.
    if (!slug || !courses.some((c) => c.slug === slug)) return;
    const el = subject.current;
    // Never overwrite something the visitor has already typed: the effect runs
    // after paint, and a fast typist can be ahead of it.
    if (el && !el.value) el.value = catalog(`courses.${slug}`);
  }, [catalog]);
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
        <input
          ref={subject}
          id="subject"
          name="subject"
          maxLength={160}
          className={field}
        />
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
