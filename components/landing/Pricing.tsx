"use client";
import { motion } from "framer-motion";

const pricing = [
  {
    name: "Monthly",
    amount: "$10",
    period: "/month",
    detail: "Flexible entry, cancel anytime.",
  },
  {
    name: "Yearly",
    amount: "$15",
    period: "/year",
    detail: "2 months free + boosted draw credits.",
    highlight: true,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Pricing() {
  return (
    <section className="py-24" id="pricing-preview">
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mb-12 text-center text-4xl font-semibold sm:text-5xl"
      >
        Pricing Preview
      </motion.h2>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        {pricing.map((plan, idx) => (
          <motion.article
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className={`rounded-3xl border p-8 ${
              plan.highlight
                ? "border-[#f59f00]/60 bg-[#2b220d]"
                : "border-white/15 bg-white/5"
            }`}
          >
            <h3 className="text-lg font-semibold text-white/90">{plan.name}</h3>
            <p className="mt-4 text-4xl font-semibold text-[#ffe7a3]">
              {plan.amount}
              <span className="text-base font-medium text-white/60">
                {plan.period}
              </span>
            </p>
            <p className="mt-4 text-sm text-white/70">{plan.detail}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
