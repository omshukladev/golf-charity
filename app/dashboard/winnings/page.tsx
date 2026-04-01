import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/dashboard/PageHeader";
import GlassCard from "@/components/dashboard/GlassCard";

export default function WinningsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Winnings"
        subtitle="Track your monthly draw performance and reward history."
      />
      <GlassCard>
        <p className="text-sm text-white/70">
          Winnings history, pending rewards, and tier summaries will be listed
          here.
        </p>
      </GlassCard>
    </DashboardLayout>
  );
}
