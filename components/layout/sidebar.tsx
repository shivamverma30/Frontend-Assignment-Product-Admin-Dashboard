"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth/auth-context";

export function Sidebar() {
  const router = useRouter();
  const { signOut } = useAuth();

  function handleSignOut() {
    signOut();
    router.replace("/login");
  }

  return (
    <aside className="border-b border-border bg-surface px-5 py-5 lg:min-h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
      <Link className="block text-lg font-semibold tracking-tight text-slate-950" href="/products">
        Product Admin
      </Link>
      <p className="mt-1 text-xs text-muted">Operations workspace</p>
      <nav className="mt-8" aria-label="Primary navigation">
        <Link className="block border-l-2 border-brand bg-orange-50 px-3 py-2 text-sm font-semibold text-brand-strong" href="/products">
          Products
        </Link>
      </nav>
      <button className="mt-8 border-t border-border pt-4 text-left text-sm font-medium text-muted transition hover:text-slate-950" type="button" onClick={handleSignOut}>
        Sign out
      </button>
    </aside>
  );
}