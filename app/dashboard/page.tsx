import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/dashboard/PageHeader";
import GlassCard from "@/components/dashboard/GlassCard";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Track performance, subscriptions, impact, and monthly rewards in one place."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.14em] text-white/55">
            Scores Window
          </p>
          <p className="mt-3 text-3xl font-semibold text-[#8ff1d2]">5</p>
          <p className="mt-1 text-sm text-white/70">Latest rounds tracked</p>
        </GlassCard>

        <GlassCard>
          <p className="text-xs uppercase tracking-[0.14em] text-white/55">
            Current Tier
          </p>
          <p className="mt-3 text-3xl font-semibold text-[#ffe7a3]">Gold</p>
          <p className="mt-1 text-sm text-white/70">
            Based on your monthly trend
          </p>
        </GlassCard>

        <GlassCard>
          <p className="text-xs uppercase tracking-[0.14em] text-white/55">
            Impact This Month
          </p>
          <p className="mt-3 text-3xl font-semibold text-[#8ff1d2]">$24</p>
          <p className="mt-1 text-sm text-white/70">
            Automatically allocated to charity
          </p>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
