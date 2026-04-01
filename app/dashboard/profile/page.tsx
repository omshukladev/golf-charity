import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/dashboard/PageHeader";
import GlassCard from "@/components/dashboard/GlassCard";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Profile"
        subtitle="Manage your account details and gameplay preferences."
      />
      <GlassCard>
        <p className="text-sm text-white/70">
          Profile details, handicap settings, and communication preferences will
          be managed here.
        </p>
      </GlassCard>
    </DashboardLayout>
  );
}
