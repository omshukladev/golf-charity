"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/dashboard/PageHeader";
import GlassCard from "@/components/dashboard/GlassCard";
import MetricCard from "@/components/dashboard/MetricCard";
import Link from "next/link";

type Score = {
  id: string;
  score: number;
  played_at: string;
  created_at: string;
};

export default function DashboardPage() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    setScores(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const loadScores = async () => {
      await fetchScores();
    };

    void loadScores();
  }, []);

  const latestScore = scores[0];
  const isEligible = scores.length === 5;
  const averageScore =
    scores.length > 0
      ? (
          scores.reduce((sum, item) => sum + item.score, 0) / scores.length
        ).toFixed(1)
      : "-";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          subtitle="Your latest performance snapshot and draw readiness in one view."
        />

        <GlassCard>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-white/70">
              Keep your latest 5 scores updated to stay draw-ready every month.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/dashboard/scores"
                className="rounded-full border border-[#ffe7a3]/70 bg-[#f59f00] px-4 py-2 text-sm font-semibold text-[#1e1400] transition hover:-translate-y-0.5"
              >
                Manage Scores
              </Link>
              <Link
                href="/dashboard/winnings"
                className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10"
              >
                View Winnings
              </Link>
            </div>
          </div>
        </GlassCard>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Active Scores"
            value={`${scores.length}/5`}
            hint="Latest scores considered"
          />
          <MetricCard
            label="Latest Score"
            value={latestScore ? String(latestScore.score) : "-"}
            hint={latestScore ? latestScore.played_at : "No score yet"}
          />
          <MetricCard
            label="Draw Eligibility"
            value={isEligible ? "Eligible" : "Not Eligible"}
            valueClassName={isEligible ? "text-[#8ff1d2]" : "text-red-300"}
            hint={
              isEligible
                ? "Ready for monthly draw"
                : "Add more scores to qualify"
            }
          />
          <MetricCard
            label="Average Score"
            value={String(averageScore)}
            hint="Calculated from latest entries"
          />
        </div>

        <GlassCard>
          <h2 className="text-lg font-semibold">Recent Scores</h2>

          {loading ? (
            <p className="mt-3 text-sm text-white/65">Loading...</p>
          ) : scores.length === 0 ? (
            <p className="mt-3 text-sm text-white/65">No scores yet.</p>
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
