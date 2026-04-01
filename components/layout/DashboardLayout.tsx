"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Background from "./Background";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSidebarOpen(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#08131d] text-white">
      <Background />

      <div className="relative z-10 flex min-h-screen">
        {sidebarOpen ? (
          <div
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        ) : null}

        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNavigate={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 pb-8 sm:p-6 lg:p-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="mb-4 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 md:hidden"
          >
            Menu
          </button>

          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
