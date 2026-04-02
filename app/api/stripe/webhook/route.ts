import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();

  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return new Response("No signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response("Webhook Error", { status: 400 });
  }

  // HANDLE CHECKOUT SUCCESS
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const emailRaw =
      session.customer_email || session.customer_details?.email;

    if (!emailRaw) {
      return NextResponse.json({ received: true });
    }

    const email = emailRaw.trim().toLowerCase();

    const plan = session.metadata?.plan || "monthly";

    //  Try exact match
    let { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    // Fallback → case-insensitive match
    if (!profile) {
      const { data: fallbackProfile } = await supabase
        .from("profiles")
        .select("id")
        .ilike("email", email)
        .maybeSingle();

      profile = fallbackProfile;
    }

    // If still not found → DO NOT FAIL
    if (!profile) {
      return NextResponse.json({ received: true });
    }

    //  Update subscription
    await supabase
      .from("profiles")
      .update({
        is_subscribed: true,
        plan: plan,
      })
      .eq("id", profile.id);
  }

  return NextResponse.json({ received: true });
}