import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  console.log("API HIT");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const month = new Date().toLocaleString("default", { month: "long" });
  const year = new Date().getFullYear();
  
  const { data: existing } = await supabase
    .from("draws")
    .select("id")
    .eq("month", month)
    .eq("year", year);

  if (existing && existing.length > 0) {
    return NextResponse.json({
      message: "Draw already done for this month",
    });
  }
  // 1. get eligible users
  const { data: users } = await supabase
    .from("profiles")
    .select("id, charity_id, is_subscribed")
    .eq("is_subscribed", true);

  if (!users) return NextResponse.json({ error: "No users" });

  // 2. filter users with 5 scores
  const eligibleUsers = [];

  for (const user of users) {
    console.log("Checking user:", user.id);

    const { data: scores } = await supabase
      .from("scores")
      .select("id")
      .eq("user_id", user.id);
    console.log("Scores count:", scores?.length);
    if (scores && scores.length === 5) {
      eligibleUsers.push(user);
    }
    console.log("Scores count second:", scores?.length);
  }

  if (eligibleUsers.length === 0) {
    return NextResponse.json({ message: "No eligible users" });
  }

  // 3. pick random winner
  const winner =
    eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];

  // 4. insert all participants
  const inserts = eligibleUsers.map((u) => ({
    user_id: u.id,
    charity_id: u.charity_id,
    month,
    year,
    is_winner: u.id === winner.id,
  }));

  await supabase.from("draws").insert(inserts);

  return NextResponse.json({
    success: true,
    winner: winner.id,
    total: eligibleUsers.length,
  });
}
