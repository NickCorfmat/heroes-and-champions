"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import logo from "../../../public/logo.png";

const NAV_ITEMS = [
  {
    label: "New Releases",
    href: "/new-releases",
    children: [
      { label: "Marvel", href: "/new-releases/marvel" },
      { label: "DC", href: "/new-releases/dc" },
      { label: "Image Comics", href: "/new-releases/image" },
      { label: "Indie", href: "/new-releases/indie" },
    ],
  },
  {
    label: "Shop All",
    href: "/shop",
    children: [
      { label: "Comics", href: "/shop/comics" },
      { label: "Trading Cards", href: "/shop/trading-cards" },
      { label: "Collectibles", href: "/shop/collectibles" },
      { label: "Manga", href: "/shop/manga" },
    ],
  },
  {
    label: "Graded Comics",
    href: "/cgc-comics",
    children: [
      { label: "CGC 9.8", href: "/cgc-comics/9-8" },
      { label: "CGC 9.6", href: "/cgc-comics/9-6" },
      { label: "Key Issues", href: "/cgc-comics/key-issues" },
      { label: "Golden Age", href: "/cgc-comics/golden-age" },
    ],
  },
  {
    label: "Sell / Trade",
    href: "/sell-trade",
    children: [
      { label: "Sell Your Comics", href: "/sell-trade/sell" },
      { label: "Trade In", href: "/sell-trade/trade" },
      { label: "Get an Appraisal", href: "/sell-trade/appraisal" },
    ],
  },
  {
    label: "eBay Store",
    href: "https://www.ebay.com/str/ccs1comics",
    children: [
      { label: "Current Listings", href: "https://www.ebay.com/str/ccs1comics" },
      { label: "Ending Soon", href: "https://www.ebay.com/str/ccs1comics" },
    ],
  },
  {
    label: "About",
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

  return (
    <header className="fixed top-0 left-0 w-full z-[100] shadow-xl shadow-black/30">

      {/* Top Navbar */}
      <div className="w-full h-[100px] flex justify-between items-center bg-gradient-to-b from-[#1a1a1a] to-[#262626] px-[50px] border-b border-white/10">
        
        {/* Logo */}
        <Link href="/" aria-label="Go to home page" className="inline-block shrink-0">
          <Image
            src={logo}
            alt="Heroes & Champions logo"
            className="h-[90px] w-[220px] object-scale-down cursor-pointer transition-all duration-500 hover:brightness-125 hover:scale-101 active:scale-98"
            priority
          />
        </Link>

        {/* Search */}
        <div className={`flex items-center h-[44px] w-[480px] rounded-xl border transition-all duration-300 overflow-hidden ${
          searchFocused ? "border-red-500 bg-white" : "border-white/20 bg-white/10"
        }`}>
          <i className={`fa-solid fa-magnifying-glass px-4 text-sm transition-colors duration-300 ${
            searchFocused ? "text-red-500" : "text-white/50"
          }`} />
          <input
            className={`w-full h-full bg-transparent outline-none text-sm transition-colors duration-300 ${
              searchFocused ? "text-[#1a1a1a] placeholder-gray-400" : "text-white placeholder-white/40"
            }`}
            type="text"
            placeholder="Search titles, authors, publishers..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-5 shrink-0">
          
          {/* Auth links */}
          <div className="flex items-center gap-3 text-sm font-semibold">
            <Link
              href="/login"
              className="text-white/75 hover:text-white transition-colors duration-200"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg font-bold transition-colors duration-200"
            >
              Sign Up
            </Link>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-white/20" />

          {/* Cart */}
          <button className="relative text-white/80 hover:text-white transition-colors duration-200 cursor-pointer">
            <i className="fa-solid fa-bag-shopping text-xl" />
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              0
            </span>
          </button>

        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="w-full h-[50px] bg-[#295585] flex items-center justify-center px-8 gap-2">
        {NAV_ITEMS.map((item, index) => (
          <div
            key={item.label}
            className="relative h-full flex items-center"
            onMouseEnter={() => setOpenIndex(index)}
            onMouseLeave={() => setOpenIndex(null)}
          >
            <Link
              href={item.href}
              className="px-4 h-full flex items-center text-white font-semibold text-base hover:bg-white/15 transition-colors duration-150 whitespace-nowrap"
            >
              {item.label}
              <i className="fa-solid fa-chevron-down ml-1.5 text-xs opacity-70" />
            </Link>

            {/* Dropdown */}
            {openIndex === index && (
              <div className="absolute top-full left-0 min-w-[180px] bg-[#1e1e1e] shadow-xl overflow-hidden z-50">
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