"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/dashboard/PageHeader";
import GlassCard from "@/components/dashboard/GlassCard";

type Charity = {
  id: string;
  name: string;
  description: string | null;
};

export default function CharityPage() {
  const router = useRouter();

  const [charities, setCharities] = useState<Charity[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

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

      await fetchData();
      setPageLoading(false);
    };

    checkAccess();
  }, []);

  const fetchData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: charitiesData } = await supabase
      .from("charities")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: profileData } = await supabase
      .from("profiles")
      .select("charity_id")
      .eq("id", user.id)
      .single();

    if (charitiesData) setCharities(charitiesData);
    if (profileData?.charity_id) setSelected(profileData.charity_id);
  };

  const handleSave = async () => {
    if (!selected) {
      alert("Please select a charity");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("profiles")
      .update({ charity_id: selected })
      .eq("id", user.id);

    alert("Charity selection saved");
    setLoading(false);
  };

  if (pageLoading) {
    return <p className="text-white p-6">Checking access...</p>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Charity Selection"
          subtitle="Choose a charity to support."
        />

        <GlassCard>
          {charities.map((charity) => (
            <div
              key={charity.id}
              onClick={() => setSelected(charity.id)}
              className={`p-4 border rounded cursor-pointer ${
                selected === charity.id ? "bg-yellow-300/10" : ""
              }`}
            >
              <h3>{charity.name}</h3>
              <p>{charity.description}</p>
            </div>
          ))}
        </GlassCard>

        <button onClick={handleSave}>
          {loading ? "Saving..." : "Save Selection"}
        </button>
      </div>
    </DashboardLayout>
  );
}