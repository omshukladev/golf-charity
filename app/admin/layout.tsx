"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0b1220] text-white">
      {/* Sidebar */}
      <AdminSidebar
        open={open}
        onClose={() => setOpen(false)}
        onNavigate={() => setOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 p-6">
        {/* Mobile Toggle Button */}
        <button
          onClick={() => setOpen(true)}
          className="mb-4 md:hidden rounded-lg border border-white/20 px-3 py-2"
        >
          ☰
        </button>

        {children}
      </div>
    </div>
  );
}
