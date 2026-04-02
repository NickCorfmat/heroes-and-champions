"use client";

import { getSupabaseBrowserClient } from "@/lib/browser-client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/email-password");
      } else {
        setUser(data.user);
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          router.replace("/email-password");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => listener?.subscription.unsubscribe();
  }, [supabase, router]);

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.replace("/email-password");
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (user?.email?.[0]?.toUpperCase() ?? "?");

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? "Hero";

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const lastSignIn = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  if (loading) {
    return (
      <main className="h-[80vh] bg-[#f2f2f2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-red-700 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400 font-medium">
            Loading your account…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[80vh] bg-[#f2f2f2] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm flex flex-col gap-4">
        {/* Profile card */}
        <div className="bg-white border border-black/10 rounded-2xl shadow-xl shadow-black/10 overflow-hidden">
          {/* Red banner + avatar */}
          <div className="relative h-24 bg-red-700">
            <div className="absolute -bottom-7 left-6">
              <div className="w-14 h-14 rounded-full bg-white border-[3px] border-white shadow-md flex items-center justify-center">
                <span className="text-red-700 text-lg font-bold leading-none">
                  {initials}
                </span>
              </div>
            </div>
          </div>

          {/* Name + email */}
          <div className="pt-10 px-6 pb-5 border-b border-black/10">
            <h1 className="text-gray-900 text-xl font-bold leading-tight">
              {displayName}
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">{user?.email}</p>
            <span className="inline-flex items-center gap-1.5 mt-3 bg-red-50 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-red-100">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
              Active Member
            </span>
          </div>

          {/* Account details */}
          <div className="px-6 py-5 flex flex-col gap-3">
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Account Details
            </h2>

            <DetailRow
              label="User ID"
              value={user?.id?.slice(0, 8) + "…"}
              mono
            />

            {joinedDate && (
              <DetailRow label="Member Since" value={joinedDate} />
            )}

            {lastSignIn && (
              <DetailRow label="Last Sign In" value={lastSignIn} />
            )}

            <DetailRow
              label="Email Verified"
              value={user?.email_confirmed_at ? "Verified" : "Not verified"}
              highlight={user?.email_confirmed_at ? "green" : "red"}
            />

            <DetailRow
              label="Auth Provider"
              value={user?.app_metadata?.provider ?? "email"}
              mono
            />
          </div>
        </div>

        {/* Sign out button */}
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full h-[42px] bg-white border border-black/10 hover:border-red-200 hover:bg-red-50 active:scale-[0.98] text-red-700 font-bold text-sm rounded-xl transition-all duration-200 shadow-sm shadow-black/5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {signingOut ? "Signing out…" : "Sign Out"}
        </button>

        <p className="text-center text-gray-400 text-xs">
          Heroes &amp; Champions · Your account is secure
        </p>
      </div>
    </main>
  );
}

/* ── small helper ── */
type HighlightColor = "green" | "red";

function DetailRow({
  label,
  value,
  mono = false,
  highlight,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: HighlightColor;
}) {
  const valueClass = highlight
    ? highlight === "green"
      ? "text-green-600 font-semibold"
      : "text-red-600 font-semibold"
    : mono
      ? "text-gray-700 font-mono text-xs"
      : "text-gray-700";

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-gray-400 text-sm shrink-0">{label}</span>
      <span className={`text-sm text-right truncate ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}
