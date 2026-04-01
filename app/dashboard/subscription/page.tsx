"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/dashboard/PageHeader";
import GlassCard from "@/components/dashboard/GlassCard";

export default function SubscriptionPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch subscription
  const fetchSubscription = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("is_subscribed, plan")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setIsSubscribed(data.is_subscribed);
      setPlan(data.plan);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  // Subscribe (fake)
  const handleSubscribe = async (selectedPlan: string) => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      is_subscribed: true,
      plan: selectedPlan,
    });

    if (error) {
      console.error(error);
      alert("Subscription failed");
    } else {
      setIsSubscribed(true);
      setPlan(selectedPlan);
      alert("Subscribed successfully");
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Subscription"
          subtitle="Manage your subscription plan."
        />

        <GlassCard>
          {!isSubscribed ? (
            <div className="space-y-4">
              <p className="text-white/70">Choose a plan:</p>

              <div className="flex gap-4">
                <button
                  onClick={() => handleSubscribe("monthly")}
                  disabled={loading}
                  className="px-5 py-3 bg-yellow-400 text-black rounded"
                >
                  {loading ? "Processing..." : "Subscribe Monthly"}
                </button>

                <button
                  onClick={() => handleSubscribe("yearly")}
                  disabled={loading}
                  className="px-5 py-3 bg-yellow-400 text-black rounded"
                >
                  {loading ? "Processing..." : "Subscribe Yearly"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-green-400 font-semibold">
                Subscription Active
              </p>
              <p className="text-white/70">Plan: {plan}</p>
            </div>
          )}
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
