"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth/auth-context";

export function AuthGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const { isHydrated, session } = useAuth();

  useEffect(() => {
    if (isHydrated && !session) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isHydrated, pathname, router, session]);

  if (!isHydrated || !session) {
    return <div className="min-h-screen bg-background" aria-busy="true" aria-label="Checking authentication" />;
  }

  return children;
}