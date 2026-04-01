"use client";
import { motion } from "framer-motion";

const drawMechanics = [
  {
    matches: "5 Matches",
    reward: "Jackpot Prize Pool",
    tone: "from-amber-300/30",
  },
  {
    matches: "4 Matches",
    reward: "Performance Bonus",
    tone: "from-emerald-300/30",
  },
  {
    matches: "3 Matches",
    reward: "Entry Reward",
    tone: "from-sky-300/30",
  },
];

export default function DrawMechanics() {
  return (
    <section className="py-24" id="draw-mechanics">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-14 text-center text-4xl font-semibold sm:text-5xl"
      >
        Draw Mechanics
      </motion.h2>

      <div className="grid gap-6 md:grid-cols-3">
        {drawMechanics.map((draw, idx) => (
          <motion.article
            key={draw.matches}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: idx * 0.07 }}
            className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#0f1f2c] p-6"
          >
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b ${draw.tone} to-transparent`}
            />
            <p className="relative text-xs uppercase tracking-[0.18em] text-white/60">
              Match Tier
            </p>
            <h3 className="relative mt-2 text-2xl font-semibold text-[#ffe7a3]">
              {draw.matches}
            </h3>
            <p className="relative mt-4 text-base text-white/80">
              {draw.reward}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
