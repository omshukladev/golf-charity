"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const navItems = [
  { label: "Hero", href: "#hero" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Draw Mechanics", href: "#draw-mechanics" },
  { label: "Charity Impact", href: "#charity-impact" },
  { label: "Pricing Preview", href: "#pricing-preview" },
  { label: "CTA", href: "#cta" },
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="sticky top-4 z-50 mb-6"
    >
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/20 bg-[#0a1a27]/70 px-3 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-5">
        <Link
          href="#hero"
          className="shrink-0 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8ff1d2] transition hover:bg-white/15"
        >
          Golf Charity
        </Link>

        <nav className="scrollbar-hide flex min-w-0 items-center gap-1 overflow-x-auto px-1">
          {navItems.map((item) => (
            <motion.a
              key={item.href}
              href={item.href}
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium text-white/75 transition hover:bg-white/10 hover:text-white sm:text-sm"
            >
              {item.label}
            </motion.a>
          ))}
        </nav>

        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/signup"
            className="shrink-0 rounded-full border border-[#ffe7a3]/70 bg-[#f59f00] px-4 py-2 text-xs font-semibold text-[#1e1400] transition hover:-translate-y-0.5 sm:px-5 sm:text-sm"
          >
            Get Started
          </Link>
        </motion.div>
      </div>
    </motion.header>
  );
}