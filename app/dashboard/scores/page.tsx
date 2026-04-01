"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
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
  const [scores, setScores] = useState<Score[]>([]);
  const [score, setScore] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch scores (ONLY current user)
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

    if (error) {
      console.error("Fetch error:", error);
    } else {
      setScores(data || []);
    }
  };

  useEffect(() => {
    const loadScores = async () => {
      await fetchScores();
    };

    void loadScores();
  }, []);

  // Add score with rolling logic
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

    if (!user) {
      setErrorMessage("User is not logged in.");
      setLoading(false);
      return;
    }

    // Get current scores (newest first)
    const { data: existingScores, error: fetchError } = await supabase
      .from("scores")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      setErrorMessage("Could not load existing scores.");
      setLoading(false);
      return;
    }

    // Keep only 4 newest before insert so total always stays at 5.
    if (existingScores && existingScores.length >= 5) {
      const idsToDelete = existingScores.slice(4).map((s) => s.id);

      const { error: deleteError } = await supabase
        .from("scores")
        .delete()
        .in("id", idsToDelete);

      if (deleteError) {
        console.error("Delete error:", deleteError);
        setErrorMessage("Could not update rolling score window.");
        setLoading(false);
        return;
      }
    }

    // Insert new score
    const { error: insertError } = await supabase.from("scores").insert([
      {
        user_id: user.id,
        score: numericScore,
        played_at: date,
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError);
      setErrorMessage("Error inserting score.");
      setLoading(false);
      return;
    }

    // Refresh UI
    setScore("");
    setDate("");
    setSuccessMessage("Score added successfully.");
    setLoading(false);
    fetchScores();
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Your Scores"
        subtitle="Add your recent rounds. We keep only your latest 5 entries for draw matching."
      />

      <div className="grid gap-5 lg:grid-cols-[1.05fr_1.4fr]">
        <GlassCard>
          <h2 className="text-lg font-semibold">Add Score</h2>

          <div className="mt-4 flex flex-col gap-3">
            <label className="block">
              <span className="mb-2 block text-sm text-white/80">Score</span>
              <input
                type="number"
                placeholder="Enter score (1-45)"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/45 outline-none transition focus:border-[#45b394]/70 focus:ring-2 focus:ring-[#45b394]/30"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-white/80">
                Played At
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#45b394]/70 focus:ring-2 focus:ring-[#45b394]/30"
              />
            </label>
          </div>

          {errorMessage ? (
            <p className="mt-4 rounded-xl border border-red-300/35 bg-red-400/10 px-3 py-2 text-sm text-red-200">
              {errorMessage}
            </p>
          ) : null}

          {successMessage ? (
            <p className="mt-4 rounded-xl border border-emerald-300/35 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
              {successMessage}
            </p>
          ) : null}

          <Button onClick={handleAddScore} loading={loading}>
            Add Score
          </Button>
        </GlassCard>

        <GlassCard>
          <h2 className="text-lg font-semibold">Latest Scores</h2>

          {scores.length === 0 ? (
            <p className="mt-4 text-sm text-white/65">
              No scores yet. Add your first score.
            </p>
          ) : (
            <div className="mt-4 flex flex-col gap-2">
              {scores.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <span className="font-medium text-[#ffe7a3]">
                    Score: {s.score}
                  </span>
                  <span className="text-sm text-white/70">{s.played_at}</span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
