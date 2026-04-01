
import CTA from "@/components/landing/CTA";
import DrawMechanics from "@/components/landing/DrawMechanics";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Impact from "@/components/landing/Impact";
import Navbar from "@/components/landing/Navbar";
import Pricing from "@/components/landing/Pricing";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08131d] text-[#f5f6f7] scroll-smooth">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#45b394]/30 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-[#f59f00]/25 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_36%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.05),transparent_40%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <Navbar />
        <Hero />
        <HowItWorks />
        <DrawMechanics />
        <Impact />
        <Pricing />
        <CTA />
      </div>
    </main>
  );
}
