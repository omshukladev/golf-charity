"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Users", href: "/admin" },
  { name: "Run Draw", href: "/admin/draw" },
  { name: "Charity", href: "/admin/charity" },
];

type SidebarProps = {
  open: boolean;
  onClose: () => void;
  onNavigate: () => void;
};

export default function AdminSidebar({
  open,
  onClose,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-0 z-50 flex h-dvh w-full flex-col bg-[#0a1a27]/95 p-4 backdrop-blur-xl transition-transform duration-300 md:static md:z-auto md:h-auto md:w-64 md:shrink-0 md:border-r md:border-white/10 md:bg-[#0a1a27]/70 md:p-5 ${
        open
          ? "translate-x-0"
          : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="flex items-center justify-between md:block">
        <h1 className="text-xl font-bold text-[#8ff1d2]">Admin Panel</h1>

        <button
          onClick={onClose}
          className="md:hidden text-white text-xl"
        >
          ×
        </button>
      </div>

      <nav className="mt-6 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={`rounded-xl px-3 py-2.5 transition ${
                isActive
                  ? "bg-[#f59f00] text-black"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}