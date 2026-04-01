"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "../auth/LogoutButton";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Scores", href: "/dashboard/scores" },
  { name: "Subscription", href: "/dashboard/subscription" },
  { name: "Charity", href: "/dashboard/charity" },
  { name: "Winnings", href: "/dashboard/winnings" },
  { name: "Profile", href: "/dashboard/profile" },
];

type SidebarProps = {
  open: boolean;
  onClose: () => void;
  onNavigate: () => void;
  onTouchStart: React.TouchEventHandler<HTMLElement>;
  onTouchEnd: React.TouchEventHandler<HTMLElement>;
};

export default function Sidebar({
  open,
  onClose,
  onNavigate,
  onTouchStart,
  onTouchEnd,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className={`fixed inset-0 z-50 flex h-dvh w-full flex-col border-white/10 bg-[#0a1a27]/95 p-4 backdrop-blur-xl transition-transform duration-300 md:static md:z-auto md:h-auto md:w-64 md:shrink-0 md:border-r md:bg-[#0a1a27]/70 md:p-5 ${
        open
          ? "pointer-events-auto translate-x-0"
          : "pointer-events-none -translate-x-full md:pointer-events-auto md:translate-x-0"
      }`}
    >
      <div className="flex items-center justify-between gap-4 md:block">
        <h1 className="text-xl font-bold text-[#8ff1d2]">Golf Charity</h1>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/10 md:hidden"
          aria-label="Close sidebar"
        >
          <span className="text-xl leading-none">×</span>
        </button>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-2 overflow-y-auto md:mt-8">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={`rounded-xl px-3 py-2.5 transition ${
                isActive
                  ? "border border-[#ffe7a3]/65 bg-[#f59f00] text-[#1e1400]"
                  : "border border-transparent text-white/70 hover:border-white/15 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <LogoutButton />
      </div>
    </aside>
  );
}
