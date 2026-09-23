"use client";

import { FormEvent, useState } from "react";

const fieldClassName =
  "mt-2 block w-full border border-border bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-orange-100";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form className="border border-border bg-surface p-6 shadow-[0_12px_30px_rgba(16,24,40,0.05)]" onSubmit={handleSubmit}>
      <div className="space-y-5">
        <label className="block text-sm font-medium text-slate-700" htmlFor="username">
          Username
          <input className={fieldClassName} id="username" name="username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
        </label>
        <label className="block text-sm font-medium text-slate-700" htmlFor="password">
          Password
          <input className={fieldClassName} id="password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
        </label>
      </div>
      <button className="mt-6 w-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800" type="submit">
        Continue
      </button>
    </form>
  );
}