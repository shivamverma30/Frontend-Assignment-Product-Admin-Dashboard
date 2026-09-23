import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-brand">
            Product Admin
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Sign in to your workspace
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Use your account credentials to manage the product catalog.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}