"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/browser-client";
import { User } from "@supabase/supabase-js";
import { ProductCard, Product } from "./ProductCard";
import { ProductSkeletonCard } from "./ProductSkeletonCard";
import { addToCart } from "@/lib/cart";

export function ProductCarousel({
  title,
  category,
}: {
  title: string;
  category: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category);

      if (!error && data) setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, [category]);

  async function handleAddToCart(product: Product) {
    if (!user) {
      router.push("/email-password");
      return;
    }

    await addToCart(supabase, user.id, product.id);

    window.dispatchEvent(new Event("cart-updated"));

    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  }

  const scroll = (direction: "left" | "right") => {
    containerRef.current?.scrollBy({
      left: direction === "left" ? -500 : 500,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl text-black/80 font-bold">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="px-3 py-1 bg-red-600 text-white font-bold text-xl rounded-md hover:scale-105 active:scale-95 cursor-pointer"
          >
            <i className="fa-solid fa-angle-left" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="px-3 py-1 bg-red-600 text-white font-bold text-xl rounded-md hover:scale-105 active:scale-95 cursor-pointer"
          >
            <i className="fa-solid fa-angle-right" />
          </button>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductSkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth py-1 text-black"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              added={addedId === product.id}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
