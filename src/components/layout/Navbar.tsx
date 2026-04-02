"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import logo from "../../../public/logo.png";
import { getSupabaseBrowserClient } from "@/lib/browser-client";
import { User } from "@supabase/supabase-js";
import { removeFromCart, updateCartQuantity } from "@/lib/cart";

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
    href: "https://shortboxed.com/u/heroes_and_champions_comics",
    children: [
      {
        label: "Visit Shortboxed Store",
        href: "https://shortboxed.com/u/heroes_and_champions_comics",
      },
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
      {
        label: "Current Listings",
        href: "https://www.ebay.com/str/ccs1comics",
      },
      {
        label: "Ending Soon",
        href: "https://www.ebay.com/str/ccs1comics?_sop=1&_tab=shop",
      },
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

interface CartPreviewItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image_ref: string;
}

export function Navbar() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartPreviewItem[]>([]);
  const [query, setQuery] = useState("");
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  async function fetchCart(userId: string) {
    const { data } = await (supabase as any)
      .from("cart_items")
      .select(
        `
        id,
        quantity,
        products (
          title,
          price,
          image_ref
        )
      `
      )
      .eq("user_id", userId);

    const items: CartPreviewItem[] = (data ?? [])
      .filter((row: any) => row.products)
      .map((row: any) => ({
        id: row.id,
        title: row.products.title,
        price: row.products.price,
        quantity: row.quantity,
        image_ref: row.products.image_ref,
      }));

    setCartItems(items);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchCart(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchCart(session.user.id);
      else setCartItems([]);
    });

    const handleCartUpdated = () => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) fetchCart(session.user.id);
      });
    };
    window.addEventListener("cart-updated", handleCartUpdated);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("cart-updated", handleCartUpdated);
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setProfileOpen(false);
    router.push("/");
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleQtyChange = async (item: CartPreviewItem, delta: number) => {
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      await removeFromCart(supabase, item.id);
      setCartItems((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      await updateCartQuantity(supabase, item.id, newQty);
      setCartItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i))
      );
    }

    window.dispatchEvent(new Event("cart-updated"));
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[100] shadow-md shadow-black/20">
      {/* Top Navbar */}
      <div className="w-full h-[100px] flex justify-between items-center bg-gradient-to-b from-[#1a1a1a] to-[#262626] px-[50px] border-b border-white/10">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Go to home page"
          className="inline-block shrink-0"
        >
          <Image
            src={logo}
            alt="Heroes & Champions logo"
            className="h-[90px] w-[220px] object-scale-down cursor-pointer transition-all duration-500 hover:brightness-125"
            priority
          />
        </Link>

        {/* Search */}
        <div className="flex flex-row items-center justify-center gap-2">
          <div
            className={`flex items-center h-[44px] w-[480px] rounded-xl border transition-all duration-300 overflow-hidden ${
              searchFocused
                ? "border-red-500 bg-white"
                : "border-white/20 bg-white/10"
            }`}
          >
            <i
              className={`fa-solid fa-magnifying-glass px-5 mr-1 text-sm transition-colors duration-300 cursor-pointer ${
                searchFocused ? "text-red-500" : "text-white/50"
              }`}
            />
            <input
              className={`w-full h-full bg-transparent outline-none text-sm transition-colors duration-300 ${
                searchFocused
                  ? "text-[#1a1a1a] placeholder-gray-400"
                  : "text-white placeholder-white/40"
              }`}
              type="text"
              placeholder="Search titles, authors, publishers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
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

        <div className="flex items-center gap-5 shrink-0">
          {/* Auth */}
          {user ? (
            <div
              className="relative"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <Link
                href="/account"
                aria-label="My account"
                className="text-white/90 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <i className="fa-solid fa-user text-xl" />
              </Link>

              {profileOpen && (
                <div className="absolute right-0 top-[100%] w-52 bg-[#f2f2f2] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-black/90 text-md font-semibold truncate">
                      {user.user_metadata?.full_name ?? "My Account"}
                    </p>
                    <p className="text-black/50 text-sm truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/account"
                    className="flex items-center gap-3 px-4 py-2.5 font-bold text-sm text-black/80 hover:text-black/60 hover:bg-black/10 transition-colors duration-150"
                  >
                    <i className="fa-solid fa-user w-4 text-center text-md" />
                    My Account
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center gap-3 px-4 py-2.5 font-bold text-sm text-black/80 hover:text-black/60 hover:bg-black/10 transition-colors duration-150"
                  >
                    <i className="fa-solid fa-box w-4 text-center text-md" />
                    My Orders
                  </Link>
                  <div className="border-t border-black/10">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 font-bold text-sm text-red-700 hover:text-red-600 hover:bg-white/10 transition-colors duration-150 cursor-pointer"
                    >
                      <i className="fa-solid fa-right-from-bracket w-4 text-center text-md" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm font-bold">
              <Link
                href="/email-password"
                className="text-white/90 hover:text-white transition-colors duration-200"
              >
                Log In
              </Link>
              <Link
                href="/email-password"
                className="px-4 py-2 bg-red-700 text-white rounded-lg transition duration-200 hover:scale-102 active:scale-98"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Divider */}
          <div className="w-px h-6 bg-white/20" />

          {/* Cart */}
          <div
            className="relative"
            onMouseEnter={() => setCartOpen(true)}
            onMouseLeave={() => setCartOpen(false)}
          >
            <Link
              href="/shopping-cart"
              aria-label="Shopping Cart"
              className="relative text-white/90 hover:text-white transition-colors duration-200 cursor-pointer block"
            >
              <i className="fa-solid fa-cart-shopping text-xl" />
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

            {cartOpen && (
              <div className="absolute right-0 top-[100%] w-80 bg-white border border-black/10 rounded-xl shadow-2xl shadow-black/20 overflow-hidden z-50">
                {/* Header */}
                <div className="px-4 py-3 bg-[#f7f7f7] border-b border-black/10 flex items-center justify-between">
                  <p className="text-black/80 text-sm font-bold">
                    {cartCount === 0 ? "Your cart" : `Your cart (${cartCount})`}
                  </p>
                  {cartItems.length > 0 && (
                    <span className="text-black/40 text-xs font-semibold">
                      ${cartTotal.toFixed(2)} total
                    </span>
                  )}
                </div>

                {/* Items */}
                {cartItems.length > 0 ? (
                  <>
                    {cartItems.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 px-4 py-3 border-b border-black/5 last:border-0 hover:bg-black/[0.02] transition-colors"
                      >
                        <div className="w-9 h-12 bg-gray-100 rounded-md overflow-hidden shrink-0">
                          <Image
                            src={item.image_ref}
                            alt={item.title}
                            width={36}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-black/80 text-xs font-semibold leading-tight line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-black/70 text-xs font-bold tabular-nums mt-0.5">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center border border-black/10 rounded-lg overflow-hidden shrink-0">
                          <button
                            onClick={() => handleQtyChange(item, -1)}
                            className="w-6 h-6 text-gray-500 hover:bg-gray-100 font-bold text-xs transition-colors cursor-pointer"
                          >
                            −
                          </button>
                          <span className="w-6 h-6 flex items-center justify-center text-xs font-semibold text-gray-900 border-x border-black/10">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQtyChange(item, 1)}
                            className="w-6 h-6 text-gray-500 hover:bg-gray-100 font-bold text-xs transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}

                    {cartItems.length > 4 && (
                      <div className="px-4 py-2.5 bg-[#f7f7f7] border-b border-black/10">
                        <Link
                          href="/shopping-cart"
                          className="text-xs text-red-700 hover:text-red-600 font-semibold transition-colors"
                        >
                          + {cartItems.length - 4} more item
                          {cartItems.length - 4 !== 1 ? "s" : ""} — view all in
                          cart →
                        </Link>
                      </div>
                    )}

                    <div className="px-4 py-3 bg-[#f7f7f7] border-t border-black/10 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-black/50 text-xs">Subtotal</span>
                        <span className="text-black/90 text-sm font-bold tabular-nums">
                          ${cartTotal.toFixed(2)}
                        </span>
                      </div>
                      <Link
                        href="/shopping-cart"
                        className="w-full h-[38px] flex items-center justify-center bg-red-700 hover:bg-red-600 active:scale-[0.98] text-white font-bold text-xs rounded-lg transition-all duration-150"
                      >
                        View Cart & Checkout
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-8 flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <i className="fa-solid fa-cart-shopping text-gray-300 text-sm" />
                    </div>
                    <p className="text-black/40 text-xs text-center">
                      {user
                        ? "No items yet — start browsing!"
                        : "Sign in to see your saved cart."}
                    </p>
                    <Link
                      href={user ? "/shop" : "/email-password"}
                      className="h-[34px] px-5 flex items-center bg-red-700 hover:bg-red-600 text-white font-bold text-xs rounded-lg transition-colors duration-200"
                    >
                      {user ? "Browse Comics" : "Log In"}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
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
