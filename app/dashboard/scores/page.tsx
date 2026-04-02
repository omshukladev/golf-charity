"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/dashboard/PageHeader";
import GlassCard from "@/components/dashboard/GlassCard";
import Button from "@/components/ui/Button";

type Score = {
  id: string;
  score: number;
  played_at: string;
  created_at: string;
};

export default function ScoresPage() {
  const router = useRouter();

  const [scores, setScores] = useState<Score[]>([]);
  const [score, setScore] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // CHECK SUBSCRIPTION FIRST
  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_subscribed")
        .eq("id", user.id)
        .single();

      if (!profile?.is_subscribed) {
        alert("You are not a premium member. Please subscribe first.");
        router.push("/dashboard/subscription?required=true");
        return;
      }

      //  ONLY LOAD DATA AFTER ACCESS CONFIRMED
      await fetchScores();
      setPageLoading(false);
    };

    checkAccess();
  }, []);

  // Fetch scores
  const fetchScores = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error) {
      setScores(data || []);
    }
  };

  // Add score
  const handleAddScore = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!score || !date) {
      setErrorMessage("Please enter score and date.");
      return;
    }

    const numericScore = Number(score);

    if (numericScore < 1 || numericScore > 45) {
      setErrorMessage("Score must be between 1 and 45.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: existingScores } = await supabase
      .from("scores")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (existingScores && existingScores.length >= 5) {
      const idsToDelete = existingScores.slice(4).map((s) => s.id);

      await supabase.from("scores").delete().in("id", idsToDelete);
    }

    await supabase.from("scores").insert([
      {
        user_id: user.id,
        score: numericScore,
        played_at: date,
      },
    ]);

    setScore("");
    setDate("");
    setSuccessMessage("Score added successfully.");
    setLoading(false);
    fetchScores();
  };

  if (pageLoading) {
    return <p className="text-white p-6">Checking access...</p>;
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Your Scores"
        subtitle="Add your recent rounds. We keep only your latest 5 entries."
      />

      <div className="grid gap-5 lg:grid-cols-[1.05fr_1.4fr]">
        <GlassCard>
          <h2 className="text-lg font-semibold">Add Score</h2>

          <div className="mt-4 flex flex-col gap-3">
            <input
              type="number"
              placeholder="Score (1-45)"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full p-3 rounded bg-white/5"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 rounded bg-white/5"
            />
          </div>

          {errorMessage && <p className="text-red-400 mt-2">{errorMessage}</p>}
          {successMessage && (
            <p className="text-green-400 mt-2">{successMessage}</p>
          )}

          <Button onClick={handleAddScore} loading={loading}>
            Add Score
          </Button>
        </GlassCard>

        <GlassCard>
          <h2 className="text-lg font-semibold">Latest Scores</h2>

          {scores.map((s) => (
            <div key={s.id} className="mt-3 flex justify-between">
              <span>Score: {s.score}</span>
              <span>{s.played_at}</span>
            </div>
          ))}
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}