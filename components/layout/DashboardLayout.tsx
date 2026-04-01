"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Background from "./Background";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#08131d] text-white">
      <Background />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
