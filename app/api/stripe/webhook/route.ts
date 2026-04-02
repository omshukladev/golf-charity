import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  const body = await req.text();

  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    console.error("No Stripe signature found");
    return new Response("No signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature error:", err);
    return new Response("Webhook Error", { status: 400 });
  }

  console.log("Webhook received:", event.type);

  // PAYMENT SUCCESS
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // safer email extraction
    const email = (
      session.customer_email || session.customer_details?.email
    )?.toLowerCase();

    console.log("Customer email:", email);

    if (!email) {
      console.error("No email found in session");
      return new Response("No email", { status: 400 });
    }

    // get plan from metadata (fallback to monthly)
    const plan = session.metadata?.plan || "monthly";

    console.log("Plan:", plan);

    // find profile
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (fetchError || !profile) {
      console.error("Profile not found:", fetchError);
      return new Response("Profile not found", { status: 404 });
    }

    // update subscription
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        is_subscribed: true,
        plan: plan,
      })
      .eq("id", profile.id);

    if (updateError) {
      console.error("Update failed:", updateError);
      return new Response("Update failed", { status: 500 });
    }

    console.log("Subscription updated for:", email);
  }

  return NextResponse.json({ received: true });
}
