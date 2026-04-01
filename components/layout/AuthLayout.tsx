// components/layout/AuthLayout.tsx
import Background from "./Background";

export default function AuthLayout({
  children,
  title,
  subtitle,
  footer,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footer?: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#08131d] px-5 py-10 text-white">
      <Background />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/20 bg-[#0c1e2d]/80 p-7 backdrop-blur-xl">
        <p className="mb-3 text-center text-xs uppercase tracking-wider text-[#8ff1d2]">
          {subtitle}
        </p>

        <h1 className="mb-7 text-center text-3xl font-semibold">{title}</h1>

        {children}

        {footer && (
          <div className="mt-6 text-center text-sm text-white/70 space-y-3">
            {footer}
          </div>
        )}
      </div>
    </main>
  );
}
