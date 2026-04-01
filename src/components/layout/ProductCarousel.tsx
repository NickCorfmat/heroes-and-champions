"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabaseClient";

interface Product {
  id: number;
  created_at: string;
  title: string | null;
  description: string | null;
  price: number | null;
  rating: number | null;
  image_ref: string | null;
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
        .select("*");

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
    <div className="w-[170px] shrink-0 bg-white rounded-xs shadow animate-pulse">
      <div className="w-full h-64 bg-gray-300" />
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
        <h2 className="text-3xl text-black/80 font-bold">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="px-3 py-1 bg-red-600 text-white font-bold text-xl rounded-md cursor-pointer transition-transform duration-250 hover:scale-105 active:scale-95"
          >
            <i className="fa-solid fa-angle-left"></i>
          </button>
          <button
            onClick={() => scroll("right")}
            className="px-3 py-1 bg-red-600 text-white font-bold text-xl rounded-md cursor-pointer transition-transform duration-250 hover:scale-105 active:scale-95"
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
          className="flex text-black gap-4 overflow-x-auto overflow-y-hidden scroll-smooth py-1"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((product) => (
            <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="w-[170px] shrink-0 bg-white rounded-xs shadow hover:scale-101 transition overflow-hidden flex flex-col"
          >
            <div className="relative w-full h-64">
              {product.image_ref && (
                <Image
                  src={product.image_ref}
                  alt={product.title ?? "Product image"}
                  fill
                  className="object-cover"
                  sizes="170px"
                />
              )}
            </div>
            <div className="p-3 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="font-semibold text-sm line-clamp-2">
                  {product.title ?? "Untitled"}
                </h3>
                <p className="text-sm text-black/60 font-bold mt-1">
                  {product.price != null ? `$${product.price.toFixed(2)}` : "—"}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // add to cart logic here
                }}
                className="w-full py-1.5 mt-2 bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer"
              >
                Add to Cart
              </button>
            </div>
          </Link>
          ))}
        </div>
      )}
    </div>
  );
}