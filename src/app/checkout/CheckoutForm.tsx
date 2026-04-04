"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  category: string;
}

interface CheckoutFormProps {
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
}

const FIELDS = {
  contact: [
    { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
    { name: "phone", label: "Phone", type: "tel", placeholder: "(555) 000-0000" },
  ],
  shipping: [
    { name: "name", label: "Full Name", type: "text", placeholder: "Peter Parker" },
    { name: "address", label: "Address", type: "text", placeholder: "123 Main St" },
    { name: "city", label: "City", type: "text", placeholder: "Sunnyvale" },
    { name: "state", label: "State", type: "text", placeholder: "CA" },
    { name: "zip", label: "ZIP Code", type: "text", placeholder: "94087" },
  ],
};

export default function CheckoutForm({ items, total, subtotal, shipping }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [form, setForm] = useState<Record<string, string>>({});
  const [focused, setFocused] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: convertToSubcurrency(total) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [total]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?amount=${total}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  const inputClass = (name: string) =>
    `w-full h-[40px] rounded-lg px-3 text-sm bg-[#f7f7f7] border outline-none transition-all duration-200 placeholder-black/20 text-gray-900 ${
      focused === name
        ? "border-red-500 shadow-[0_0_0_3px_rgba(185,28,28,0.1)]"
        : "border-black/10 hover:border-black/25"
    }`;

  const renderFields = (fields: typeof FIELDS.contact) =>
    fields.map((field) => (
      <div key={field.name} className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs font-semibold">{field.label}</label>
        <input
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          value={form[field.name] ?? ""}
          onChange={handleChange}
          onFocus={() => setFocused(field.name)}
          onBlur={() => setFocused(null)}
          className={inputClass(field.name)}
        />
      </div>
    ));

    if (!clientSecret || !stripe || !elements) {
      return (
        <div className="flex items-center justify-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      );
    }

  return (
    <main className="min-h-screen bg-[#f2f2f2] px-4 py-10">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/shopping-cart" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
            ← Back to Cart
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-black/80 -mt-3">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* Left — Forms */}
            <div className="flex-1 flex flex-col gap-4">

              {/* Contact */}
              <div className="bg-white border border-black/10 rounded-2xl shadow-xl shadow-black/10 overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-black/10">
                  <h2 className="text-base font-bold text-black/80">Contact Information</h2>
                </div>
                <div className="px-6 py-5 flex flex-col gap-3">
                  {renderFields(FIELDS.contact)}
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-white border border-black/10 rounded-2xl shadow-xl shadow-black/10 overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-black/10">
                  <h2 className="text-base font-bold text-black/80">Shipping Address</h2>
                </div>
                <div className="px-6 py-5 flex flex-col gap-3">
                  {renderFields(FIELDS.shipping)}
                </div>
              </div>

              {/* Stripe Payment */}
              <div className="bg-white border border-black/10 rounded-2xl shadow-xl shadow-black/10 overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-black/10">
                  <h2 className="text-base font-bold text-black/80">Payment</h2>
                </div>
                <div className="px-6 py-5">
                  {clientSecret ? (
                    <PaymentElement />
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
                      Loading payment form…
                    </div>
                  )}

                  {errorMessage && <div>{errorMessage}</div>}
                </div>
              </div>

              {errorMessage && (
                <p className="text-red-600 text-sm font-medium px-1">{errorMessage}</p>
              )}
            </div>

            {/* Right — Order Summary */}
            <div className="w-full lg:w-72 shrink-0 bg-white border border-black/10 rounded-2xl shadow-xl shadow-black/10 overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-black/10">
                <h2 className="text-lg font-bold text-black/80">Order Summary</h2>
              </div>
              <div className="px-6 py-5 flex flex-col gap-3">

                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-500 line-clamp-1 flex-1 pr-2">
                      {item.title}
                      {item.quantity > 1 && (
                        <span className="text-gray-400"> ×{item.quantity}</span>
                      )}
                    </span>
                    <span className="font-semibold text-gray-900 shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <div className="border-t border-black/10 pt-3 flex flex-col gap-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Shipping</span>
                    <span className="font-semibold text-gray-900">
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-black/10 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-black text-lg text-gray-900">${total.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={!stripe || !clientSecret || loading}
                  className="w-full h-[42px] mt-1 bg-red-700 hover:bg-red-600 active:scale-[0.98] text-white font-bold text-sm rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-pulse"
                >
                  {loading ? "Processing…" : `Pay $${total.toFixed(2)}`}
                </button>

                <Link
                  href="/shopping-cart"
                  className="text-center text-gray-400 hover:text-gray-600 text-xs transition-colors"
                >
                  ← Back to Cart
                </Link>
              </div>
            </div>

          </div>
        </form>
      </div>
    </main>
  );
}
