// app/login/page.tsx
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default function Page() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Member Login"
      footer={
        <>
          <p>
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-[#8ff1d2] hover:text-[#baf9e8]"
            >
              Create one
            </Link>
          </p>

          <Link
            href="/"
            className="block text-xs uppercase tracking-[0.14em] text-white/50 hover:text-white/80"
          >
            Back to home
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
