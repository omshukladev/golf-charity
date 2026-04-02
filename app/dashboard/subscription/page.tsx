"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/dashboard/PageHeader";
import GlassCard from "@/components/dashboard/GlassCard";

export default function SubscriptionPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSubscription = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("plan, subscription_expires_at")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      const isActive =
        data.subscription_expires_at &&
        new Date(data.subscription_expires_at) > new Date();

      setIsSubscribed(!!isActive);
      setPlan(data.plan);
      setExpiresAt(data.subscription_expires_at);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleSubscribe = async (priceId: string) => {
    setLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error(data);
        alert("Failed to start checkout");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
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
                  onClick={() =>
                    handleSubscribe(
                      process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY!,
                    )
                  }
                  disabled={loading}
                  className="px-5 py-3 bg-yellow-400 text-black rounded"
                >
                  {loading ? "Processing..." : "Subscribe Monthly"}
                </button>

                <button
                  onClick={() =>
                    handleSubscribe(
                      process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY!,
                    )
                  }
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

              {expiresAt && (
                <p className="text-white/60 text-sm">
                  Expires on: {new Date(expiresAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
