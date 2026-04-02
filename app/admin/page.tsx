"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/dashboard/GlassCard";
import PageHeader from "@/components/dashboard/PageHeader";

type User = {
  id: string;
  full_name: string;
  email: string;
  is_subscribed: boolean;
  plan: string | null;
};

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data || []);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchUsers();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const toggleSubscription = async (userId: string, current: boolean) => {
    setLoading(true);

    await fetch("/api/admin/toggle-subscription", {
      method: "POST",
      body: JSON.stringify({
        userId,
        is_subscribed: !current,
      }),
    });

    await fetchUsers();
    setLoading(false);
  };

  const total = users.length;
  const active = users.filter((u) => u.is_subscribed).length;
  const inactive = total - active;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Panel"
        subtitle="Manage users and subscriptions"
      />

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-3">
        <GlassCard>
          <p className="text-sm text-white/60">TOTAL USERS</p>
          <h2 className="text-2xl font-bold text-white">{total}</h2>
        </GlassCard>

        <GlassCard>
          <p className="text-sm text-white/60">ACTIVE</p>
          <h2 className="text-2xl font-bold text-green-400">{active}</h2>
        </GlassCard>

        <GlassCard>
          <p className="text-sm text-white/60">INACTIVE</p>
          <h2 className="text-2xl font-bold text-red-400">{inactive}</h2>
        </GlassCard>
      </div>

      {/* USERS TABLE */}
      <GlassCard>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Users</h3>

          <button
            onClick={fetchUsers}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead className="border-b border-white/10 text-white/60">
              <tr>
                <th className="py-3">Name</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Subscription</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="py-4">{user.full_name}</td>

                  <td className="text-white/70">{user.email}</td>

                  <td className="text-white/70">{user.plan || "None"}</td>

                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        user.is_subscribed
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {user.is_subscribed ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="text-right">
                    <button
                      disabled={loading}
                      onClick={() =>
                        toggleSubscription(user.id, user.is_subscribed)
                      }
                      className="rounded-xl bg-[#f59f00] px-4 py-2 text-sm font-semibold text-[#1e1400] transition hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      {user.is_subscribed ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
