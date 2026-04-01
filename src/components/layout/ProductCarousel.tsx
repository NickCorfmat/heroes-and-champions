"use client";

import { useEffect, useState, useRef } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { ProductCard, Product } from "./ProductCard";
import { ProductSkeletonCard } from "./ProductSkeletonCard";

export function ProductCarousel({
  title,
  category,
  onAddToCart,
}: {
  title: string;
  category: string;
  onAddToCart?: (product: Product) => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .eq("category", category); // (you probably meant this)

      if (!error && data) {
        setProducts(data);
      }

      setLoading(false);
    };

    fetchProducts();
  }, [category]);

  const scroll = (direction: "left" | "right") => {
    containerRef.current?.scrollBy({
      left: direction === "left" ? -500 : 500,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full py-8">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl text-black/80 font-bold">{title}</h2>

        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="px-3 py-1 bg-red-600 text-white font-bold text-xl rounded-md hover:scale-105 active:scale-95"
          >
            <i className="fa-solid fa-angle-left"></i>
          </button>

          <button
            onClick={() => scroll("right")}
            className="px-3 py-1 bg-red-600 text-white font-bold text-xl rounded-md hover:scale-105 active:scale-95"
          >
            <i className="fa-solid fa-angle-right"></i>
          </button>
        </div>
      </div>

      {/* body */}
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
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}