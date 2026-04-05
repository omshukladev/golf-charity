import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/admin-check";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// GET all submitted proofs

export async function GET() {
  const auth = await requireAdmin();

  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { data, error } = await supabase
    .from("draws")
    .select(
      `
    id,
    user_id,
    month,
    year,
    status,
    proof_url,
    is_winner,
    charities ( name )
  `,
    )
    .eq("is_winner", true)
    .in("status", ["submitted"]);

  if (error) {
    console.error("Draw fetch error:", error);
    return NextResponse.json([]);
  }

  return NextResponse.json(data || []);
}

// UPDATE status (approve / reject)
export async function PATCH(req: Request) {
  const auth = await requireAdmin();

  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { id, status } = await req.json();

  const { error } = await supabase
    .from("draws")
    .update({ status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Update failed" });
  }

  return NextResponse.json({ success: true });
}
