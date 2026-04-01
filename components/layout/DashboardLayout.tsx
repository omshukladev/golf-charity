"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Background from "./Background";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSidebarOpen(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    if (event.touches.length !== 1) return;

    touchStartX.current = event.touches[0].clientX;
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    const startX = touchStartX.current;
    const startY = touchStartY.current;

    if (startX === null || startY === null) return;

    const touchEnd = event.changedTouches[0];
    const deltaX = touchEnd.clientX - startX;
    const deltaY = touchEnd.clientY - startY;

    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(deltaX) < Math.abs(deltaY) || Math.abs(deltaX) < 60) return;

    if (!sidebarOpen && startX <= 28 && deltaX > 60) {
      setSidebarOpen(true);
      return;
    }

    if (sidebarOpen && deltaX < -60) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#08131d] text-white">
      <Background />

      <div className="relative z-10 flex min-h-screen">
        {sidebarOpen ? (
          <div
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] md:hidden"
            onClick={() => setSidebarOpen(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            aria-hidden="true"
          />
        ) : null}

        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNavigate={() => setSidebarOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />

        <main
          className="flex-1 overflow-y-auto p-4 pb-8 sm:p-6 lg:p-8"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/85 shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-white/10 md:hidden"
            aria-label="Open sidebar"
          >
            <span className="relative flex h-4 w-4 items-center justify-center">
              <span className="absolute h-0.5 w-4 rounded-full bg-current" />
              <span className="absolute -translate-y-1.5 h-0.5 w-4 rounded-full bg-current" />
              <span className="absolute translate-y-1.5 h-0.5 w-4 rounded-full bg-current" />
            </span>
          </button>

          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
