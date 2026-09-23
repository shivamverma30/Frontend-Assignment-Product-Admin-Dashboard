"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";

import { STORAGE_KEYS } from "@/lib/constants";

export function AuthGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener("product-admin:unauthorized", onStoreChange);

      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener("product-admin:unauthorized", onStoreChange);
      };
    },
    () => window.localStorage.getItem(STORAGE_KEYS.authSession),
    () => null,
  );

  useEffect(() => {
    if (!session) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router, session]);

  if (!session) {
    return <div className="min-h-screen bg-background" aria-busy="true" />;
  }

  return children;
}