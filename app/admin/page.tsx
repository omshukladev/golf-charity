import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          const cookieStore = await cookies();
          return cookieStore.getAll();
        },
        async setAll() {},
      },
    }
  );

  // 1. Get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Get profile (IMPORTANT)
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  // 3. BLOCK non-admin
  if (!profile?.is_admin) {
    redirect("/dashboard");
  }

  // 4. If admin → show page
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>You are admin</p>
    </div>
  );
}