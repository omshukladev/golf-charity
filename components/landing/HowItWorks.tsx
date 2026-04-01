"use client";
import { motion } from "framer-motion";

const howItWorks = [
  {
    title: "Submit Your Last 5 Rounds",
    description:
      "We use your recent scores to create a fair performance fingerprint before every monthly draw.",
  },
  {
    title: "Get Matched Into The Draw",
    description:
      "Your numbers are mapped to a weighted draw bucket designed to reward consistency, not luck alone.",
  },
  {
    title: "Compete For Monthly Rewards",
    description:
      "The closer your projected and actual performance align, the better your chance to unlock bigger prizes.",
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

export default function HowItWorks() {
  return (
    <section className="py-24" id="how-it-works">
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mb-12 text-center text-4xl font-semibold sm:text-5xl"
      >
        How It Works
      </motion.h2>

      <div className="grid gap-6 md:grid-cols-3">
        {howItWorks.map((step, index) => (
          <motion.article
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: index * 0.08 }}
            className="group rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-md transition hover:border-[#45b394]/55 hover:bg-white/10"
          >
            <span className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#45b394]/25 text-sm font-semibold text-[#8ff1d2]">
              {index + 1}
            </span>
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              {step.description}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
