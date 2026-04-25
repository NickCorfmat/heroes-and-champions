"use client";

import { getSupabaseBrowserClient } from "@/lib/browser-client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { removeFromCart, updateCartQuantity } from "@/lib/cart";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image_ref: string;
  category: string;
}

type PageState = "loading" | "unauthenticated" | "empty" | "has-items";

export default function ShoppingCartPage() {
  const [pageState, setPageState] = useState<PageState>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/sign-in");
      } else {
        setUser(data.user);
        fetchCart(data.user.id);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          router.replace("/sign-in");
        } else {
          setUser(session.user);
          fetchCart(session.user.id);
        }
      }
    );

    return () => listener?.subscription.unsubscribe();
  }, []);

  async function fetchCart(userId: string) {
    const { data, error } = await (supabase as any)
      .from("cart_items")
      .select(
        `
        id,
        quantity,
        products (
          id,
          title,
          price,
          image_ref,
          category
        )
      `
      )
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching cart:", error.message);
      setPageState("empty");
      return;
    }

    const cartItems: CartItem[] = (data ?? [])
      .filter((row: any) => row.products)
      .map((row: any) => ({
        id: row.id,
        title: row.products.title,
        price: row.products.price,
        quantity: row.quantity,
        image_ref: row.products.image_ref,
        category: row.products.category,
      }));

    setItems(cartItems);
    setPageState(cartItems.length === 0 ? "empty" : "has-items");
  }

  async function handleUpdateQuantity(id: number, delta: number) {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const newQty = item.quantity + delta;

    await updateCartQuantity(supabase, id, newQty);
    window.dispatchEvent(new Event("cart-updated"));

    if (newQty <= 0) {
      const next = items.filter((i) => i.id !== id);
      setItems(next);
      if (next.length === 0) setPageState("empty");
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
      );
    }
  }

  async function handleRemoveItem(id: number) {
    await removeFromCart(supabase, id);
    window.dispatchEvent(new Event("cart-updated"));

    const next = items.filter((i) => i.id !== id);
    setItems(next);
    if (next.length === 0) setPageState("empty");
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (pageState === "loading") {
    return (
      <main className="h-[80vh] bg-[#f2f2f2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-red-700 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400 font-medium">
            Loading your cart…
          </p>
        </div>
      </main>
    );
  }

  if (pageState === "unauthenticated") return null;

  if (pageState === "empty") {
    return (
      <main className="min-h-[80vh] bg-[#f2f2f2] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm bg-white border border-black/10 rounded-2xl shadow-xl shadow-black/10 px-8 py-14 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <div>
            <h2 className="text-gray-900 font-bold text-lg">
              Your cart is empty
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Looks like you haven't added any comics yet.
            </p>
          </div>
          <Link
            href="/"
            className="px-6 h-[40px] flex items-center bg-red-700 hover:bg-red-600 active:scale-[0.98] text-white font-bold text-sm rounded-lg transition-all duration-200"
          >
            Browse Comics
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f2f2f2] px-4 py-10">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-black/80">Your Cart</h1>
          <p className="text-gray-400 text-md mt-1">
            {items.length} item{items.length !== 1 ? "s" : ""} · {user?.email}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Cart Items */}
          <div className="flex-1 flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-black/10 rounded-2xl shadow-xl shadow-black/10 p-4 flex gap-4 items-center"
              >
                <div className="w-20 h-30 overflow-hidden shrink-0 flex items-center justify-center">
                  <Image
                    src={item.image_ref}
                    alt={item.title}
                    width={64}
                    height={80}
                    className="h-full w-auto object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                    {item.category}
                  </p>
                  <h3 className="font-semibold text-md text-gray-900 leading-snug mt-0.5 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-base font-black text-gray-900 mt-1">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-gray-400">
                      ${item.price.toFixed(2)} each
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-300 hover:text-red-500 text-xs transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                  <div className="flex items-center border border-black/10 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, -1)}
                      className="w-8 h-8 text-gray-500 hover:bg-gray-100 font-bold transition-colors cursor-pointer"
                    >
                      −
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-gray-900 border-x border-black/10">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, 1)}
                      className="w-8 h-8 text-gray-500 hover:bg-gray-100 font-bold transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-72 shrink-0 bg-white border border-black/10 rounded-2xl shadow-xl shadow-black/10 overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-black/10">
              <h2 className="text-lg font-bold text-black/80">Order Summary</h2>
            </div>
            <div className="px-6 py-5 flex flex-col gap-3">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span className="font-semibold text-gray-900">
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">
                  Free shipping on orders over $50
                </p>
              )}
              <div className="border-t border-black/10 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-black text-lg text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </div>
              <Link
                href="/checkout"
                aria-label="Go to checkout"
                className="w-full h-[42px] flex justify-center items-center mt-1 bg-red-700 hover:bg-red-600 active:scale-[0.98] text-white font-bold text-sm rounded-lg transition-all duration-200 cursor-pointer"
              >
                Checkout
              </Link>
              <Link
                href="/"
                className="text-center text-gray-400 hover:text-gray-600 text-xs transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
