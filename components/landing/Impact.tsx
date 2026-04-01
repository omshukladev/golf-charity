"use client";
import { motion } from "framer-motion";

const impactStats = [
  { label: "Raised This Quarter", value: "$42,850" },
  { label: "Active Charity Partners", value: "18" },
  { label: "Funded Community Projects", value: "63" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Impact() {
  return (
    <section className="py-24" id="charity-impact">
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mb-4 text-center text-4xl font-semibold sm:text-5xl"
      >
        Charity Impact
      </motion.h2>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto mb-12 max-w-3xl text-center text-white/75"
      >
        Subscribers choose where impact goes first: youth golf access, community
        nutrition, or local health initiatives. Every draw powers direct,
        transparent giving.
      </motion.p>

      <div className="grid gap-6 md:grid-cols-3">
        {impactStats.map((stat, idx) => (
          <motion.article
            key={stat.label}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
            className="rounded-3xl border border-white/10 bg-[#102635] p-7 text-center"
          >
            <p className="text-3xl font-semibold text-[#8ff1d2]">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-white/70">{stat.label}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
