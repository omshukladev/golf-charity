"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/dashboard/GlassCard";
import PageHeader from "@/components/dashboard/PageHeader";

type User = {
  id: string;
  full_name: string;
  email: string;
  plan: string | null;
  subscription_expires_at: string | null;
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

  const toggleSubscription = async (userId: string, isActive: boolean) => {
    setLoading(true);

    await fetch("/api/admin/toggle-subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        makeActive: !isActive,
      }),
    });

    await fetchUsers();
    setLoading(false);
  };

  const isActive = (user: User) =>
    user.subscription_expires_at &&
    new Date(user.subscription_expires_at) > new Date();

  const total = users.length;
  const active = users.filter((u) => isActive(u)).length;
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
              {users.map((user) => {
                const activeStatus = isActive(user);

                return (
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
                          activeStatus
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {activeStatus ? "Active" : "Expired"}
                      </span>
                    </td>

                    <td className="text-right">
                      <button
                        disabled={loading}
                        onClick={() =>
                          toggleSubscription(user.id, activeStatus)
                        }
                        className="rounded-xl bg-[#f59f00] px-4 py-2 text-sm font-semibold text-[#1e1400] transition hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        {activeStatus ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
