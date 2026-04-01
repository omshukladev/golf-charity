"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignup = async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setSuccessMessage(
      "Signup successful. Check your email to confirm your account.",
    );
    setLoading(false);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08131d] px-5 py-10 text-[#f5f6f7] sm:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-[#45b394]/30 blur-3xl" />
        <div className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-[#f59f00]/25 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/20 bg-[#0c1e2d]/80 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-9"
      >
        <p className="mb-3 text-center text-xs uppercase tracking-[0.18em] text-[#8ff1d2]">
          New Member
        </p>
        <h1 className="mb-7 text-center text-3xl font-semibold">
          Create Account
        </h1>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-white/80">Email</span>
            <input
              type="email"
              value={email}
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/45 outline-none transition focus:border-[#45b394]/70 focus:ring-2 focus:ring-[#45b394]/30"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-white/80">Password</span>
            <input
              type="password"
              value={password}
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/45 outline-none transition focus:border-[#45b394]/70 focus:ring-2 focus:ring-[#45b394]/30"
              placeholder="Create a secure password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>

        {errorMessage ? (
          <p className="mt-4 rounded-xl border border-red-300/35 bg-red-400/10 px-3 py-2 text-sm text-red-200">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="mt-4 rounded-xl border border-emerald-300/35 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
            {successMessage}
          </p>
        ) : null}

        <motion.button
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSignup}
          disabled={loading}
          className="mt-6 w-full rounded-xl border border-[#ffe7a3]/70 bg-[#f59f00] py-3 text-sm font-semibold text-[#1e1400] transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </motion.button>

        <p className="mt-5 text-center text-sm text-white/70">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#8ff1d2] transition hover:text-[#baf9e8]"
          >
            Sign in
          </Link>
        </p>

        <div className="mt-5 text-center">
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.14em] text-white/50 transition hover:text-white/80"
          >
            Back to home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
