import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  console.log("API HIT");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const month = new Date().toLocaleString("default", { month: "long" });
  const year = new Date().getFullYear();

  // check if draw already executed for this month
  const { data: existing, error: existingError } = await supabase
    .from("draws")
    .select("id")
    .eq("month", month)
    .eq("year", year)
    .limit(1);

  if (existingError) {
    console.error("Existing draw check error:", existingError);
    return NextResponse.json({ error: "Failed to check existing draw" });
  }

  if (existing && existing.length > 0) {
    return NextResponse.json({
      message: "Draw already done for this month",
    });
  }

  // get subscribed users
  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("id, charity_id, is_subscribed")
    .eq("is_subscribed", true);

  if (usersError) {
    console.error("Users fetch error:", usersError);
    return NextResponse.json({ error: "Failed to fetch users" });
  }

  if (!users || users.length === 0) {
    return NextResponse.json({ message: "No subscribed users found" });
  }

  // filter eligible users (>= 5 scores)
  const eligibleUsers = [];

  for (const user of users) {
    const { data: scores, error: scoresError } = await supabase
      .from("scores")
      .select("id")
      .eq("user_id", user.id);

    if (scoresError) {
      console.error("Scores fetch error:", scoresError);
      continue;
    }

    if (scores && scores.length >= 5) {
      eligibleUsers.push(user);
    }
  }

  if (eligibleUsers.length === 0) {
    return NextResponse.json({ message: "No eligible users" });
  }

  // pick random winner
  const winner =
    eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];

  // insert draw entries
  const inserts = eligibleUsers.map((u) => ({
    user_id: u.id,
    charity_id: u.charity_id,
    month,
    year,
    is_winner: u.id === winner.id,
  }));

  const { error: insertError } = await supabase
    .from("draws")
    .insert(inserts);

  if (insertError) {
    console.error("Insert error:", insertError);
    return NextResponse.json({ error: "Failed to store draw results" });
  }

  return NextResponse.json({
    success: true,
    winner: winner.id,
    total: eligibleUsers.length,
  });
}