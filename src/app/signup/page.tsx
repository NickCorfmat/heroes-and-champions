"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-black/10 bg-background p-6 shadow-sm dark:border-white/15 sm:p-8">
        <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Join Heroes &amp; Champions to save wishlists and get updates.
        </p>

        <form
          className="mt-6 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div>
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-transparent px-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-[#295585]/60 dark:border-white/15"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-transparent px-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-[#295585]/60 dark:border-white/15"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="mt-2 flex h-11 items-center rounded-xl border border-black/10 pr-1 dark:border-white/15">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                className="h-full w-full bg-transparent px-3 text-sm outline-none"
                placeholder="At least 8 characters"
              />
              <button
                type="button"
                className="h-9 shrink-0 rounded-lg px-3 text-xs font-semibold text-foreground/80 hover:bg-black/[.05] dark:hover:bg-white/[.07]"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p className="mt-2 text-xs text-foreground/60">
              Use 8+ characters. Don’t reuse a password from another site.
            </p>
          </div>

          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#295585] px-4 text-sm font-semibold text-white hover:opacity-95"
          >
            Create account
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-foreground/70">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#295585] hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}

