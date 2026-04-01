"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full rounded-xl border border-red-300/40 bg-red-500/20 px-4 py-2.5 text-sm font-medium text-red-100 transition hover:bg-red-500/30"
    >
      Logout
    </button>
  );
}
