import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/admin-check";

export async function POST(req: Request) {
  const auth = await requireAdmin();

  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { userId, makeActive } = await req.json();

  let updateData;

  if (makeActive) {
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);

    updateData = {
      is_subscribed: true,
      plan: "manual",
      subscription_expires_at: expires.toISOString(),
    };
  } else {
    updateData = {
      is_subscribed: false,
      plan: null,
      subscription_expires_at: null,
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", userId);

  if (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
