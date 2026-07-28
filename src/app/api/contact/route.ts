import { NextResponse } from "next/server";

// No default. The only address the academy supplied is a PEC, and Italian PEC
// mailboxes reject ordinary mail, so defaulting to it would drop every enquiry
// silently. Until CONTACT_TO holds a real inbox, messages are logged instead.
const STUDIO_EMAIL = process.env.CONTACT_TO;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "bad request" }, { status: 400 });

  const name = String(body.name ?? "").trim().slice(0, 120);
  const email = String(body.email ?? "").trim().slice(0, 160);
  const subject = String(body.subject ?? "").trim().slice(0, 160);
  const message = String(body.message ?? "").trim().slice(0, 4000);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !STUDIO_EMAIL) {
    // ponytail: no mail provider or no destination inbox yet. Log it so nothing
    // is silently dropped.
    console.info("[contact]", { name, email, subject, message });
    return NextResponse.json({ ok: true, delivered: false });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "site@amira-bechini.com",
      to: STUDIO_EMAIL,
      reply_to: email,
      subject: subject || `Website message from ${name}`,
      text: `${name} <${email}>\n\n${message}`,
    }),
  });

  if (!res.ok) return NextResponse.json({ error: "send failed" }, { status: 502 });
  return NextResponse.json({ ok: true, delivered: true });
}
