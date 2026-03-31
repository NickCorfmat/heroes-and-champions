"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <main className="h-[80vh] bg-[#f2f2f2] flex items-center justify-center px-4">

      <div className="w-full max-w-sm bg-white border border-black/10 rounded-2xl shadow-xl shadow-black/10 overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-7 pb-5 border-b border-black/10 flex flex-col items-center gap-2">
          <h1 className="text-black/80 text-2xl font-bold">Create Account</h1>
          <p className="text-gray-500 text-sm">Join the Heroes & Champions community</p>
        </div>

        {/* Form */}
        <div className="px-8 py-6 flex flex-col gap-3">
          {[
            { name: "name", label: "Full Name", type: "text", placeholder: "Peter Parker" },
            { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
            { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
            { name: "confirm", label: "Confirm Password", type: "password", placeholder: "••••••••" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <label className="text-gray-500 text-xs font-semibold">{field.label}</label>
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                onFocus={() => setFocused(field.name)}
                onBlur={() => setFocused(null)}
                className={`w-full h-[40px] rounded-lg px-3 text-sm bg-[#f7f7f7] border outline-none transition-all duration-200 placeholder-black/20 text-gray-900 ${
                  focused === field.name
                    ? "border-red-500 shadow-[0_0_0_3px_rgba(185,28,28,0.1)]"
                    : "border-black/10 hover:border-black/25"
                }`}
              />
            </div>
          ))}

          <button className="w-full h-[42px] mt-1 bg-red-700 hover:bg-red-600 active:scale-[0.98] text-white font-bold text-sm rounded-lg transition-all duration-200 cursor-pointer">
            Create Account
          </button>

          <p className="text-center text-gray-400 text-xs pt-1">
            Already have an account?{" "}
            <Link href="/login" className="text-red-600 hover:text-red-500 font-semibold transition-colors">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}