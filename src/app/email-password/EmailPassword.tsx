"use client";

import { getSupabaseBrowserClient } from "@/lib/browser-client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type EmailPasswordProps = {
  user: User | null;
};

type Mode = "signin" | "signup";

export default function EmailPassword({ user }: EmailPasswordProps) {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const supabase = getSupabaseBrowserClient();
  const [currentUser, setCurrentUser] = useState<User | null>(user);
  const router = useRouter();

  // Redirect already-logged-in users away immediately
  useEffect(() => {
    if (currentUser) {
      router.replace("/");
    }
  }, [currentUser, router]);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user ?? null);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === "signup" && !name.trim()) {
      setStatus("Please enter your full name.");
      return;
    }

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: name,
          },
        },
      });
      if (error) {
        setStatus(error.message);
      } else {
        setStatus(
          "Account created successfully. Check your inbox to confirm your new account."
        );
      }
      console.log({ data });
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setStatus(error.message);
      } else {
        router.replace("/");
      }
    }
  }

  const inputClass = (fieldName: string) =>
    `w-full h-[40px] rounded-lg px-3 text-sm bg-[#f7f7f7] border outline-none transition-all duration-200 placeholder-black/20 text-gray-900 ${
      focused === fieldName
        ? "border-red-500 shadow-[0_0_0_3px_rgba(185,28,28,0.1)]"
        : "border-black/10 hover:border-black/25"
    }`;

  // Don't render the form at all if already signed in (prevents flash before redirect)
  if (currentUser) return null;

  return (
    <main className="h-[80vh] bg-[#f2f2f2] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-black/10 rounded-2xl shadow-xl shadow-black/10 overflow-hidden">
        {/* Tab toggle */}
        <div className="flex border-b border-black/10">
          {(["signin", "signup"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setStatus("");
              }}
              className={`flex-1 py-4 text-sm font-bold transition-colors duration-200 cursor-pointer ${
                mode === m
                  ? "text-red-700 border-b-2 border-red-700 -mb-px"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {m === "signin" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="px-8 pt-7 pb-5 border-b border-black/10 flex flex-col items-center gap-2">
          <h1 className="text-black/80 text-2xl font-bold">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-500 text-sm">
            {mode === "signin"
              ? "Log in to your Heroes & Champions account"
              : "Join the Heroes & Champions community"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-3">
          {mode === "signup" && (
            <div className="flex flex-col gap-1">
              <label className="text-gray-500 text-xs font-semibold">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Peter Parker"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                className={inputClass("name")}
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-gray-500 text-xs font-semibold">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              className={inputClass("email")}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-500 text-xs font-semibold">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              className={inputClass("password")}
            />
          </div>

          {status && (
            <p
              className={`text-xs font-medium px-1 ${
                status.includes("successfully") ||
                status.includes("Check your inbox")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
              role="status"
              aria-live="polite"
            >
              {status}
            </p>
          )}

          <button
            type="submit"
            className="w-full h-[42px] mt-1 bg-red-700 hover:bg-red-600 active:scale-[0.98] text-white font-bold text-sm rounded-lg transition-all duration-200 cursor-pointer"
          >
            {mode === "signin" ? "Log In" : "Create Account"}
          </button>

          <p className="text-center text-gray-400 text-xs pt-1">
            {mode === "signin"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setStatus("");
              }}
              className="text-red-600 hover:text-red-500 font-semibold transition-colors cursor-pointer"
            >
              {mode === "signin" ? "Sign Up" : "Log In"}
            </button>
          </p>
        </form>
      </div>
    </main>
  );
}
