"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 px-4 py-2 rounded text-white hover:opacity-80"
    >
      Logout
    </button>
  );
}
