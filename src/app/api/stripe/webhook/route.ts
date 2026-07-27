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
  return NextResponse.json({ received: true });
}
