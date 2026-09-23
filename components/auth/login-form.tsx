"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { normalizeApiError } from "@/lib/api/errors";
import { useAuth } from "@/lib/auth/auth-context";

const fieldClassName =
  "mt-2 block w-full border border-border bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-orange-100";

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password) {
      setErrorMessage("Enter your username and password to continue.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await signIn({ username: trimmedUsername, password });
      router.replace(getSafeNextPath());
    } catch (error) {
      const normalizedError = normalizeApiError(error);
      setErrorMessage(getLoginErrorMessage(normalizedError.status, normalizedError.message));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="border border-border bg-surface p-6 shadow-[0_12px_30px_rgba(16,24,40,0.05)]" onSubmit={handleSubmit} noValidate>
      <div className="space-y-5">
        <label className="block text-sm font-medium text-slate-700" htmlFor="username">
          Username
          <input className={fieldClassName} id="username" name="username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" aria-invalid={Boolean(errorMessage)} />
        </label>
        <label className="block text-sm font-medium text-slate-700" htmlFor="password">
          Password
          <input className={fieldClassName} id="password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" aria-invalid={Boolean(errorMessage)} />
        </label>
      </div>
      {errorMessage ? (
        <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2.5 text-sm leading-5 text-red-700" role="alert">
          {errorMessage}
        </p>
      ) : null}
      <button className="mt-6 w-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Continue"}
      </button>
    </form>
  );
}

function getSafeNextPath() {
  if (typeof window === "undefined") return "/products";

  const nextPath = new URLSearchParams(window.location.search).get("next");
  return nextPath?.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/products";
}

function getLoginErrorMessage(status: number | null, message: string) {
  if (status === 400 || status === 401) return "Those credentials were not recognized. Check them and try again.";
  return message;
}