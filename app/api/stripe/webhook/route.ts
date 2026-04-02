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
    return new Response("No signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return new Response("Webhook Error", { status: 400 });
  }

  // CHECKOUT SUCCESS
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan || "monthly";

    if (!userId) {
      return NextResponse.json({ received: true });
    }

    await supabase
      .from("profiles")
      .update({
        is_subscribed: true,
        plan: plan,
      })
      .eq("id", userId);
  }

  // PAYMENT FAILED
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;

    const subscriptionId = (invoice as any).subscription;

    if (!subscriptionId || typeof subscriptionId !== "string") {
      return NextResponse.json({ received: true });
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const userId = subscription.metadata?.userId;

    if (userId) {
      await supabase
        .from("profiles")
        .update({
          is_subscribed: false,
          plan: null,
        })
        .eq("id", userId);
    }
  }

  // SUBSCRIPTION CANCELLED
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    const userId = subscription.metadata?.userId;

    if (userId) {
      await supabase
        .from("profiles")
        .update({
          is_subscribed: false,
          plan: null,
        })
        .eq("id", userId);
    }
  }

  return NextResponse.json({ received: true });
}
