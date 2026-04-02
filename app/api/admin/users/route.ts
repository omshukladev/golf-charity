import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET → fetch all users
export async function GET() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, is_subscribed, plan");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// PATCH → toggle subscription
export async function PATCH(req: Request) {
  const { userId, is_subscribed } = await req.json();

  const { error } = await supabase
    .from("profiles")
    .update({
      is_subscribed,
      plan: is_subscribed ? "manual" : null,
    })
    .eq("id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}