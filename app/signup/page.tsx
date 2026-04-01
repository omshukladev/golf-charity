// app/signup/page.tsx
import AuthLayout from "@/components/layout/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";
import Link from "next/link";

export default function Page() {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="New Member"
      footer={
        <>
          <p>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#8ff1d2] hover:text-[#baf9e8]"
            >
              Sign in
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
      <SignupForm />
    </AuthLayout>
  );
}
