import LogoutButton from '@/components/auth/LogoutButton'

export default function DashboardPage() {
  return (
    <div className="p-10 text-white">
      <h1 className="text-2xl mb-4">Dashboard</h1>

      <LogoutButton />
    </div>
  )
}