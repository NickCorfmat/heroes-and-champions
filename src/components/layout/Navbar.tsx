"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import logo from "../../../public/logo.png";
import { getSupabaseBrowserClient } from "@/lib/browser-client";
import { User } from "@supabase/supabase-js";

const NAV_ITEMS = [
  {
    label: "NEW RELEASES",
    href: "/new-releases",
    children: [
      { label: "Marvel", href: "/new-releases/marvel" },
      { label: "DC", href: "/new-releases/dc" },
      { label: "Image Comics", href: "/new-releases/image" },
      { label: "Indie", href: "/new-releases/indie" },
    ],
  },
  {
    label: "SHOP ALL",
    href: "/shop",
    children: [
      { label: "Comics", href: "/shop/comics" },
      { label: "Trading Cards", href: "/shop/trading-cards" },
      { label: "Collectibles", href: "/shop/collectibles" },
      { label: "Manga", href: "/shop/manga" },
    ],
  },
  {
    label: "GRADED COMICS",
    href: "/cgc-comics",
    children: [
      { label: "CGC 9.8", href: "/cgc-comics/9-8" },
      { label: "CGC 9.6", href: "/cgc-comics/9-6" },
      { label: "Key Issues", href: "/cgc-comics/key-issues" },
      { label: "Golden Age", href: "/cgc-comics/golden-age" },
    ],
  },
  {
    label: "SELL / TRADE",
    href: "/sell-trade",
    children: [
      { label: "Sell Your Comics", href: "/sell-trade/sell" },
      { label: "Trade In", href: "/sell-trade/trade" },
      { label: "Get an Appraisal", href: "/sell-trade/appraisal" },
    ],
  },
  {
    label: "EBAY STORE",
    href: "https://www.ebay.com/str/ccs1comics",
    children: [
      { label: "Current Listings", href: "https://www.ebay.com/str/ccs1comics" },
      { label: "Ending Soon", href: "https://www.ebay.com/str/ccs1comics?_sop=1&_tab=shop" },
    ],
  },
  {
    label: "ABOUT",
    href: "/about",
    children: [
      { label: "Our Story", href: "/about" },
      { label: "Locations", href: "/about/locations" },
      { label: "Contact Us", href: "/about/contact" },
    ],
  },
];

export function Navbar() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Keep in sync on login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setProfileOpen(false);
    router.push("/");
  };

  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  // Derive initials for avatar
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.[0].toUpperCase() ?? "?";

  return (
    <header className="fixed top-0 left-0 w-full z-[100] shadow-xl shadow-black/30">

      {/* Top Navbar */}
      <div className="w-full h-[100px] flex justify-between items-center bg-gradient-to-b from-[#1a1a1a] to-[#262626] px-[50px] border-b border-white/10">

        {/* Logo */}
        <Link href="/" aria-label="Go to home page" className="inline-block shrink-0">
          <Image
            src={logo}
            alt="Heroes & Champions logo"
            className="h-[90px] w-[220px] object-scale-down cursor-pointer transition-all duration-500 hover:brightness-125"
            priority
          />
        </Link>

        {/* Search */}
        <div className="flex flex-row items-center justify-center gap-2">
          <div className={`flex items-center h-[44px] w-[480px] rounded-xl border transition-all duration-300 overflow-hidden ${
            searchFocused ? "border-red-500 bg-white" : "border-white/20 bg-white/10"
          }`}>
            <i className={`fa-solid fa-magnifying-glass px-5 mr-1 text-sm transition-colors duration-300 cursor-pointer ${
              searchFocused ? "text-red-500" : "text-white/50"
            }`} />
            <input
              className={`w-full h-full bg-transparent outline-none text-sm transition-colors duration-300 ${
                searchFocused ? "text-[#1a1a1a] placeholder-gray-400" : "text-white placeholder-white/40"
              }`}
              type="text"
              placeholder="Search titles, authors, publishers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter") handleSearch();
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
          <button
            className="w-[120px] h-[44px] bg-red-700 rounded-xl text-white font-bold cursor-pointer transition duration-200 hover:scale-102 active:scale-98"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-5 shrink-0">

          {/* Auth */}
          {user ? (
            // Signed in — avatar + dropdown
            <div className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 cursor-pointer group"
              >
                {/* Avatar circle */}
                <div className="w-9 h-9 rounded-full bg-red-700 flex items-center justify-center text-white text-sm font-bold group-hover:bg-red-600 transition-colors duration-200">
                  {initials}
                </div>
                <i className={`fa-solid fa-chevron-down text-white/60 text-xs transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] w-52 bg-[#1e1e1e] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white text-sm font-semibold truncate">
                      {user.user_metadata?.full_name ?? "My Account"}
                    </p>
                    <p className="text-white/40 text-xs truncate mt-0.5">{user.email}</p>
                  </div>

                  {/* Menu items */}
                  <Link
                    href="/account"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-150"
                  >
                    <i className="fa-solid fa-user w-4 text-center" />
                    My Account
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-150"
                  >
                    <i className="fa-solid fa-box w-4 text-center" />
                    My Orders
                  </Link>

                  {/* Sign out */}
                  <div className="border-t border-white/10">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors duration-150 cursor-pointer"
                    >
                      <i className="fa-solid fa-right-from-bracket w-4 text-center" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Signed out — log in / sign up
            <div className="flex items-center gap-3 text-sm font-bold">
              <Link
                href="/email-password"
                className="text-white/90 hover:text-white transition-colors duration-200"
              >
                Log In
              </Link>
              <Link
                href="/email-password"
                className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg font-bold transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Divider */}
          <div className="w-px h-6 bg-white/20" />

          {/* Cart */}
          <Link href="/shopping-cart" aria-label="Shopping Cart" className="relative text-white/90 hover:text-white transition-colors duration-200 cursor-pointer">
            <i className="fa-solid fa-bag-shopping text-xl" />
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              0
            </span>
          </Link>
        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="w-full h-[50px] bg-[#29548a] flex items-center justify-center px-8">
        {NAV_ITEMS.map((item, index) => (
          <div
            key={item.label}
            className="relative h-full flex items-center"
            onMouseEnter={() => setOpenIndex(index)}
            onMouseLeave={() => setOpenIndex(null)}
          >
            <Link
              href={item.href}
              className="px-5 h-full flex items-center text-white font-semibold text-sm hover:bg-white/15 transition-colors duration-150 whitespace-nowrap"
            >
              {item.label}
              <i className="fa-solid fa-chevron-down ml-1.5 text-xs opacity-70" />
            </Link>

            {/* Dropdown */}
            {openIndex === index && (
              <div className="absolute top-full left-0 w-full bg-[#1e1e1e] shadow-xl overflow-hidden z-50">
                {item.children.map((child) => (
                  <Link
                    key={child.label}
                    href={child.href}
                    className="block px-5 py-3 text-sm text-white/80 hover:text-white hover:bg-[#295585] transition-colors duration-150 whitespace-nowrap"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </header>
  );
}