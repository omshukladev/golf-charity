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
  const sig = headersList.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature error:", err);
    return new Response("Webhook Error", { status: 400 });
  }

  // PAYMENT SUCCESS
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const email = session.customer_email;

    if (!email) {
      return new Response("No email", { status: 400 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (profile) {
      await supabase
        .from("profiles")
        .update({
          is_subscribed: true,
          plan: "monthly", // FIXED BELOW
        })
        .eq("id", profile.id);
    }
  }

  return NextResponse.json({ received: true });
}