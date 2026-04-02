"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/dashboard/PageHeader";
import GlassCard from "@/components/dashboard/GlassCard";

type Draw = {
  id: string;
  month: string;
  year: number;
  is_winner: boolean;
  created_at: string;
  charities?: {
    name: string;
  }[] | null;
};

export default function WinningsPage() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDraws = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("draws")
      .select(`
        id,
        month,
        year,
        is_winner,
        created_at,
        charities(name)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Draw fetch error:", error);
    }

    setDraws((data as Draw[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDraws();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Your Winnings"
          subtitle="Track your participation and results in monthly draws."
        />

        <GlassCard>
          {loading ? (
            <p className="text-white/70">Loading...</p>
          ) : draws.length === 0 ? (
            <p className="text-white/70">No draw history yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {draws.map((draw) => (
                <div
                  key={draw.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">
                      {draw.month} {draw.year}
                    </p>

                    <p className="text-sm text-white/60">
                      Charity:{" "}
                      {draw.charities?.[0]?.name || "Not selected"}
                    </p>
                  </div>

                  <span
                    className={`text-sm font-semibold ${
                      draw.is_winner
                        ? "text-green-400"
                        : "text-yellow-300"
                    }`}
                  >
                    {draw.is_winner ? "Won" : "Participated"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}