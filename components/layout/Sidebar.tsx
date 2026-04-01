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
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-5 flex flex-col">
      <h1 className="text-xl font-bold mb-8">Golf App</h1>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-white text-black"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
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