import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCourse } from "@/lib/courses";
import { getUser } from "@/lib/supabase/server";
import { locales } from "@/i18n/routing";

export async function POST(req: Request) {
  const { slug, locale } = await req.json().catch(() => ({}));
  const lang = locales.includes(locale) ? locale : "en";
  const course = getCourse(slug);
  if (!course) return NextResponse.json({ error: "unknown course" }, { status: 404 });

  const user = await getUser();
  if (!user) {
    return NextResponse.json(
      { signIn: `/${lang}/login?next=/courses/${slug}` },
      { status: 401 },
    );
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return NextResponse.json({ error: "stripe not configured" }, { status: 503 });

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const stripe = new Stripe(key);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: course.priceId, quantity: 1 }],
    customer_email: user.email,
    locale: lang as Stripe.Checkout.SessionCreateParams.Locale,
    // The webhook is the only thing that grants access, so it needs both ids.
    metadata: { user_id: user.id, course_slug: course.slug },
    success_url: `${origin}/${lang}/dashboard?checkout=success`,
    cancel_url: `${origin}/${lang}/courses/${course.slug}?checkout=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
