"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/dashboard/PageHeader";
import GlassCard from "@/components/dashboard/GlassCard";

type Charity = {
  id: string;
  name: string;
  description: string | null;
};

export default function CharityPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // FETCH DATA
  const fetchData = async () => {
    setInitialLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setInitialLoading(false);
      return;
    }

    // GET CHARITIES
    const { data: charitiesData } = await supabase
      .from("charities")
      .select("*")
      .order("created_at", { ascending: false });

    // GET PROFILE
    const { data: profileData } = await supabase
      .from("profiles")
      .select("charity_id, is_subscribed")
      .eq("id", user.id)
      .single();

    if (charitiesData) setCharities(charitiesData);

    if (profileData) {
      setSelected(profileData.charity_id);
      setIsPremium(profileData.is_subscribed === true);
    }

    setInitialLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // SELECT CHARITY
  const handleSelect = (id: string) => {
    if (!isPremium) {
      alert(
        "You are not a premium member. Please subscribe to select a charity.",
      );
      return;
    }

    setSelected(id);
  };

  // SAVE
  const handleSave = async () => {
    if (!isPremium) {
      alert("You are not a premium member. Please subscribe to save.");
      return;
    }

    if (!selected) {
      alert("Please select a charity");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ charity_id: selected })
      .eq("id", user.id);

    if (error) {
      alert("Failed to save");
    } else {
      alert("Charity saved");
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Charity Selection"
          subtitle="Choose a charity to support with your subscription."
        />

        {!isPremium && (
          <div className="rounded-xl border border-yellow-300/30 bg-yellow-400/10 px-4 py-2 text-sm text-yellow-300">
            You are not a premium member. You can view charities but cannot
            select.
          </div>
        )}

        <GlassCard>
          {initialLoading ? (
            <p className="text-white/70">Loading...</p>
          ) : charities.length === 0 ? (
            <p className="text-white/70">No charities available</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {charities.map((charity) => (
                <div
                  key={charity.id}
                  onClick={() => handleSelect(charity.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    selected === charity.id
                      ? "border-[#ffe7a3] bg-[#ffe7a3]/10"
                      : "border-white/10 hover:border-white/30"
                  } ${!isPremium ? "opacity-70" : ""}`}
                >
                  <h3 className="text-lg font-semibold text-white">
                    {charity.name}
                  </h3>

                  <p className="mt-2 text-sm text-white/70">
                    {charity.description || "No description available"}
                  </p>

                  {selected === charity.id && (
                    <p className="mt-3 text-xs text-[#ffe7a3]">Selected</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-xl border border-[#ffe7a3]/70 bg-[#f59f00] px-6 py-3 text-sm font-semibold text-[#1e1400] transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Selection"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
