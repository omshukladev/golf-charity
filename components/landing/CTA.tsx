"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function CTA() {
  return (
    <section className="pb-28 pt-10 text-center" id="cta">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        className="rounded-4xl border border-white/20 bg-[linear-gradient(135deg,rgba(69,179,148,0.28),rgba(245,159,0,0.22))] p-10 backdrop-blur"
      >
        <h2 className="mx-auto max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl">
          Ready To Play Better, Win Bigger, And Fund Real Change?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/80">
          Start with one round, one subscription, and one cause you care about.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-full border border-[#ffe7a3]/70 bg-[#f59f00] px-8 py-3 text-sm font-semibold text-[#1e1400] transition hover:-translate-y-0.5"
          >
            Start Now
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/30 bg-white/10 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            See Dashboard Preview
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
