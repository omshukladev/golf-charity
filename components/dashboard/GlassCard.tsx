type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function GlassCard({
  children,
  className = "",
}: GlassCardProps) {
  return (
    <div
      className={`rounded-3xl border border-white/15 bg-[#0c1e2d]/70 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}
