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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-white/10 bg-[#0a1a27]/70 p-5 backdrop-blur-xl">
      <h1 className="mb-8 text-xl font-bold text-[#8ff1d2]">Golf Charity</h1>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
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

      {/* Logout at bottom */}
      <div className="mt-auto pt-6">
        <LogoutButton />
      </div>
    </aside>
  );
}
