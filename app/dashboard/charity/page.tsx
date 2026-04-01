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
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch charities + user profile
  const fetchData = async () => {
    setInitialLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setInitialLoading(false);
      return;
    }

    // Fetch charities
    const { data: charitiesData, error: charitiesError } = await supabase
      .from("charities")
      .select("*")
      .order("created_at", { ascending: false });

    // Fetch profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("charity_id")
      .eq("id", user.id)
      .single();

    if (charitiesError) {
      console.error("Charities fetch error:", charitiesError);
    }

    if (profileError) {
      console.error("Profile fetch error:", profileError);
    }

    if (charitiesData) setCharities(charitiesData);
    if (profileData?.charity_id) setSelected(profileData.charity_id);

    setInitialLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save selected charity
  const handleSave = async () => {
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
      console.error("Update error:", error);
      alert("Failed to save selection");
    } else {
      alert("Charity selection saved");
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
                  onClick={() => setSelected(charity.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    selected === charity.id
                      ? "border-[#ffe7a3] bg-[#ffe7a3]/10"
                      : "border-white/10 hover:border-white/30"
                  }`}
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
