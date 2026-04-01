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
  { matches: "3 Matches", reward: "Entry Reward", tone: "from-sky-300/30" },
];

const impactStats = [
  { label: "Raised This Quarter", value: "$42,850" },
  { label: "Active Charity Partners", value: "18" },
  { label: "Funded Community Projects", value: "63" },
];

const pricing = [
  {
    name: "Monthly",
    amount: "$10",
    period: "/month",
    detail: "Flexible entry, cancel anytime.",
  },
  {
    name: "Yearly",
    amount: "$100",
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

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08131d] text-[#f5f6f7] scroll-smooth">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#45b394]/30 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-[#f59f00]/25 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_36%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.05),transparent_40%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
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

        <section className="py-24" id="draw-mechanics">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="mb-12 text-center text-4xl font-semibold sm:text-5xl"
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
            Subscribers choose where impact goes first: youth golf access,
            community nutrition, or local health initiatives. Every draw powers
            direct, transparent giving.
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
                <h3 className="text-lg font-semibold text-white/90">
                  {plan.name}
                </h3>
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
              Start with one round, one subscription, and one cause you care
              about.
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
      </div>
    </main>
  );
}
