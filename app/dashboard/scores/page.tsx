"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/layout/DashboardLayout";

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
      .order("played_at", { ascending: false }); // ✅ better sort

    if (error) {
      console.error("Fetch error:", error);
    } else {
      setScores(data || []);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  // Add score with rolling logic
  const handleAddScore = async () => {
    if (!score || !date) {
      alert("Please enter score and date");
      return;
    }

    const numericScore = Number(score);

    if (numericScore < 1 || numericScore > 45) {
      alert("Score must be between 1 and 45");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("User not logged in");
      setLoading(false);
      return;
    }

    // Get current scores (oldest first)
    const { data: existingScores, error: fetchError } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      setLoading(false);
      return;
    }

    // If already 5 → delete oldest
    if (existingScores && existingScores.length >= 5) {
      const oldest = existingScores[0];

      const { error: deleteError } = await supabase
        .from("scores")
        .delete()
        .eq("id", oldest.id);

      if (deleteError) {
        console.error("Delete error:", deleteError);
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
      alert("Error inserting score");
      setLoading(false);
      return;
    }

    // Refresh UI
    setScore("");
    setDate("");
    setLoading(false);
    fetchScores();
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl">
        <h1 className="text-2xl font-semibold mb-4">Your Scores</h1>

        {/* Form */}
        <div className="flex flex-col gap-3 mb-6">
          <input
            type="number"
            placeholder="Enter score (1–45)"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="p-2 rounded bg-gray-800"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 rounded bg-gray-800"
          />

          <button
            onClick={handleAddScore}
            disabled={loading}
            className="bg-white text-black py-2 rounded disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Score"}
          </button>
        </div>

        {/* Empty state */}
        {scores.length === 0 && (
          <p className="text-gray-400">No scores yet. Add your first score.</p>
        )}

        {/* List */}
        <div className="flex flex-col gap-2">
          {scores.map((s) => (
            <div
              key={s.id}
              className="p-3 bg-gray-900 rounded flex justify-between"
            >
              <span>Score: {s.score}</span>
              <span>{s.played_at}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}