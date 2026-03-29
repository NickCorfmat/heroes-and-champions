"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabaseClient";

interface Product {
  id: number;           // int8 → number
  created_at: string;
  title: string | null;
  description: string | null;
  price: number | null;
  rating: number | null;
  image_ref: string | null; // renamed from image_url
  category: string | null;
}

export function ProductCarousel({
  title,
  category,
}: {
  title: string;
  category: string;
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

        console.log("category filter:", category);
        console.log("data:", data);
        console.log("error:", error);

      if (error) {
        console.error(error);
      } else {
        setProducts(data as Product[]);
      }

      setLoading(false);
    };

    fetchProducts();
  }, [category]);

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({
      left: direction === "left" ? -500 : 500,
      behavior: "smooth",
    });
  };

  const SkeletonCard = () => (
    <div className="w-[200px] shrink-0 bg-white rounded-xl shadow animate-pulse">
      <div className="w-full h-64 bg-gray-300 rounded-t-xl" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 bg-gray-300 rounded w-4/5" />
        <div className="h-3 bg-gray-300 rounded w-3/5" />
        <div className="h-5 bg-gray-300 rounded w-2/5 mt-1" />
      </div>
    </div>
  );

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-4xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="px-3 py-1 bg-red-700 text-white font-bold text-xl rounded-md cursor-pointer transition-transform duration-250 hover:scale-110 active:scale-95"
          >
            <i className="fa-solid fa-angle-left"></i>
          </button>
          <button
            onClick={() => scroll("right")}
            className="px-3 py-1 bg-red-700 text-white font-bold text-xl rounded-md cursor-pointer transition-transform duration-250 hover:scale-110 active:scale-95"
          >
            <i className="fa-solid fa-angle-right"></i>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto overflow-y-visible scroll-smooth py-2"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="w-[200px] shrink-0 bg-white rounded-xl shadow hover:scale-105 transition overflow-hidden"
            >
              <div className="relative w-full h-64">
                {product.image_ref && (
                  <Image
                    src={product.image_ref}
                    alt={product.title ?? "Product image"}
                    fill
                    className="object-cover rounded-t-xl"
                    sizes="200px"
                  />
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm line-clamp-2">
                  {product.title ?? "Untitled"}
                </h3>
                <p className="text-lg font-bold">
                  {product.price != null ? `$${product.price.toFixed(2)}` : "—"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
