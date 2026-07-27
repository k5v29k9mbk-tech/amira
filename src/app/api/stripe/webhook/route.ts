import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServiceSupabase } from "@/lib/supabase/server";

// Access is granted here and nowhere else. A client that says "I paid" is not enough.
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!key || !secret || !signature) {
    return NextResponse.json({ error: "stripe not configured" }, { status: 503 });
  }

  const stripe = new Stripe(key);
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, signature, secret);
  } catch {
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object;
  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true });
  }

  const userId = session.metadata?.user_id;
  const courseSlug = session.metadata?.course_slug;
  const supabase = getServiceSupabase();
  if (!userId || !courseSlug || !supabase) {
    return NextResponse.json({ error: "missing enrollment data" }, { status: 400 });
  }

  // stripe_session_id is unique, so a retried webhook cannot double-enrol.
  const { error } = await supabase.from("enrollments").upsert(
    {
      user_id: userId,
      course_slug: courseSlug,
      stripe_session_id: session.id,
    },
    { onConflict: "user_id,course_slug", ignoreDuplicates: true },
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await sendConfirmation(session);
  return NextResponse.json({ received: true });
}

/**
 * Course-access confirmation. Stripe already emails the payment receipt when
 * customer emails are on in the dashboard, so this one is about access, not money.
 * Never throws: a mail failure must not make Stripe retry a completed enrollment.
 */
async function sendConfirmation(session: Stripe.Checkout.Session) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = session.customer_details?.email ?? session.customer_email;
  if (!to) return;

  const locale = session.metadata?.locale ?? "en";
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://amira-bechini.com";
  const link = `${site}/${locale}/dashboard`;

  if (!apiKey) {
    // ponytail: no mail provider wired yet. Log it so nothing is silently dropped.
    console.info("[enrollment-email]", { to, link, course: session.metadata?.course_slug });
    return;
  }

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "site@amira-bechini.com",
        to,
        subject: "Your course is unlocked",
        text: `Your payment went through and your course is ready.\n\nOpen your studio: ${link}\n\nAmira Bechini Masterclass`,
      }),
    });
  } catch (e) {
    console.error("[enrollment-email] failed", e);
  }
}
