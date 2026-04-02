import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async getAll() {
            const cookieStore = await cookies();
            return cookieStore.getAll();
          },
          async setAll(cookiesToSet) {
            try {
              const cookieStore = await cookies();
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;

    const plan =
      priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY
        ? "monthly"
        : "yearly";

    // OPTIONAL BUT GOOD: create/reuse customer
    const customer = await stripe.customers.create({
      email: user.email!,
      metadata: {
        userId: user.id,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",

      customer: customer.id, 

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      // used in checkout event
      metadata: {
        userId: user.id,
        plan: plan,
      },

      // used in subscription lifecycle events (admin cancel, payment fail)
      subscription_data: {
        metadata: {
          userId: user.id,
        },
      },

      success_url: `${baseUrl}/dashboard?success=true`,
      cancel_url: `${baseUrl}/dashboard/subscription?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Stripe error" }, { status: 500 });
  }
}