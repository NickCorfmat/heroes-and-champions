"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { getSupabaseBrowserClient } from "@/lib/browser-client";
import CheckoutForm from "./CheckoutForm";
import convertToSubcurrency from "@/lib/convertToSubcurrency";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  category: string;
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/email-password");
        return;
      }
      fetchCart(data.user.id);
    });
  }, []);

  async function fetchCart(userId: string) {
    const { data, error } = await (supabase as any)
      .from("cart_items")
      .select(
        `
        id,
        quantity,
        products (
          title,
          price,
          category
        )
      `
      )
      .eq("user_id", userId);

    if (error || !data) {
      setLoading(false);
      return;
    }

    const cartItems: CartItem[] = data
      .filter((row: any) => row.products)
      .map((row: any) => ({
        id: row.id,
        title: row.products.title,
        price: row.products.price,
        quantity: row.quantity,
        category: row.products.category,
      }));

    if (cartItems.length === 0) {
      router.replace("/shopping-cart");
      return;
    }

    setItems(cartItems);
    setLoading(false);
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = Math.round((subtotal + shipping) * 100) / 100;

  if (loading) {
    return (
      <main className="h-[80vh] bg-[#f2f2f2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-red-700 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading checkout…</p>
        </div>
      </main>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: convertToSubcurrency(total),
        currency: "usd",
      }}
    >
      <CheckoutForm
        items={items}
        total={total}
        shipping={shipping}
        subtotal={subtotal}
      />
    </Elements>
  );
}
