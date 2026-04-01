import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/dashboard/PageHeader";
import GlassCard from "@/components/dashboard/GlassCard";

export default function CharityPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Charity"
        subtitle="Choose causes and review where your contributions are going."
      />
      <GlassCard>
        <p className="text-sm text-white/70">
          Your charity allocation dashboard will appear here with cause
          selection, contribution history, and impact milestones.
        </p>
      </GlassCard>
    </DashboardLayout>
  );
}
