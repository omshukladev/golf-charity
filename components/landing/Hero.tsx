"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="hero"
      className="flex min-h-screen flex-col items-center justify-center py-20 text-center"
    >
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className="max-w-5xl text-balance text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl"
      >
        Turn Every Golf Round Into A Win For You And A Win For Charity.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="mt-7 max-w-3xl text-pretty text-base leading-relaxed text-white/75 sm:text-lg"
      >
        A premium monthly draw for golfers where your performance unlocks
        rewards and every subscription funds measurable social impact.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <Link
          href="/signup"
          className="rounded-full border border-[#ffe7a3]/60 bg-[#f59f00] px-7 py-3 text-sm font-semibold text-[#1e1400] transition hover:-translate-y-0.5"
        >
          Join The Draw
        </Link>

        <Link
          href="/login"
          className="rounded-full border border-white/25 bg-white/5 px-7 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10"
        >
          Member Login
        </Link>
      </motion.div>
    </section>
  );
}