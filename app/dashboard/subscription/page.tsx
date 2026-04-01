import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/dashboard/PageHeader";
import GlassCard from "@/components/dashboard/GlassCard";

export default function SubscriptionPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Subscription"
        subtitle="Review your active plan, billing cycle, and renewal status."
      />
      <GlassCard>
        <p className="text-sm text-white/70">
          Subscription details and upgrade options will be available here.
        </p>
      </GlassCard>
    </DashboardLayout>
  );
}
