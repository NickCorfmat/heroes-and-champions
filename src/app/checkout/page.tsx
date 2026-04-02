"use client";

import { useState } from "react";
import Link from "next/link";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  category: string;
}

const MOCK_CART: CartItem[] = [
  {
    id: 1,
    title: "The Amazing Spider-Man #1",
    price: 12.99,
    quantity: 1,
    category: "Comic",
  },
  {
    id: 2,
    title: "Batman Universe #3",
    price: 14.99,
    quantity: 2,
    category: "Comic",
  },
  {
    id: 3,
    title: "Doctor Strange #169",
    price: 18.99,
    quantity: 1,
    category: "Comic",
  },
];

const FIELDS = {
  contact: [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "you@example.com",
    },
    {
      name: "phone",
      label: "Phone",
      type: "tel",
      placeholder: "(555) 000-0000",
    },
  ],
  shipping: [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Peter Parker",
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      placeholder: "123 Main St",
    },
    { name: "city", label: "City", type: "text", placeholder: "Sunnyvale" },
    { name: "state", label: "State", type: "text", placeholder: "CA" },
    { name: "zip", label: "ZIP Code", type: "text", placeholder: "94087" },
  ],
  payment: [
    {
      name: "cardName",
      label: "Name on Card",
      type: "text",
      placeholder: "Peter Parker",
    },
    {
      name: "cardNumber",
      label: "Card Number",
      type: "text",
      placeholder: "1234 5678 9012 3456",
    },
    { name: "expiry", label: "Expiry", type: "text", placeholder: "MM/YY" },
    { name: "cvv", label: "CVV", type: "text", placeholder: "123" },
  ],
};

export default function CheckoutPage() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subtotal = MOCK_CART.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const inputClass = (name: string) =>
    `w-full h-[40px] rounded-lg px-3 text-sm bg-[#f7f7f7] border outline-none transition-all duration-200 placeholder-black/20 text-gray-900 ${
      focused === name
        ? "border-red-500 shadow-[0_0_0_3px_rgba(185,28,28,0.1)]"
        : "border-black/10 hover:border-black/25"
    }`;

  const renderFields = (fields: typeof FIELDS.contact) =>
    fields.map((field) => (
      <div key={field.name} className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs font-semibold">
          {field.label}
        </label>
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

  return (
    <main className="min-h-screen bg-[#f2f2f2] px-4 py-10">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/shopping-cart"
            className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
          >
            ← Back to Cart
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-black/80 -mt-3">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left — Forms */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Contact */}
            <div className="bg-white border border-black/10 rounded-2xl shadow-xl shadow-black/10 overflow-hidden">
              <div className="px-6 pt-5 pb-4 border-b border-black/10">
                <h2 className="text-base font-bold text-black/80">
                  Contact Information
                </h2>
              </div>
              <div className="px-6 py-5 flex flex-col gap-3">
                {renderFields(FIELDS.contact)}
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white border border-black/10 rounded-2xl shadow-xl shadow-black/10 overflow-hidden">
              <div className="px-6 pt-5 pb-4 border-b border-black/10">
                <h2 className="text-base font-bold text-black/80">
                  Shipping Address
                </h2>
              </div>
              <div className="px-6 py-5 flex flex-col gap-3">
                {renderFields(FIELDS.shipping)}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white border border-black/10 rounded-2xl shadow-xl shadow-black/10 overflow-hidden">
              <div className="px-6 pt-5 pb-4 border-b border-black/10">
                <h2 className="text-base font-bold text-black/80">Payment</h2>
              </div>
              <div className="px-6 py-5 flex flex-col gap-3">
                {renderFields(FIELDS.payment)}
              </div>
            </div>
          </div>

          {/* Right — Order Summary */}
          <div className="w-full lg:w-72 shrink-0 bg-white border border-black/10 rounded-2xl shadow-xl shadow-black/10 overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-black/10">
              <h2 className="text-lg font-bold text-black/80">Order Summary</h2>
            </div>
            <div className="px-6 py-5 flex flex-col gap-3">
              {/* Items */}
              {MOCK_CART.map((item) => (
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
              </div>

              <div className="border-t border-black/10 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-black text-lg text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button className="w-full h-[42px] mt-1 bg-red-700 hover:bg-red-600 active:scale-[0.98] text-white font-bold text-sm rounded-lg transition-all duration-200 cursor-pointer">
                Place Order
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
      </div>
    </main>
  );
}
