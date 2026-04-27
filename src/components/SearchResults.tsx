"use client";

import { useState, useMemo } from "react";
import { Product, ProductCard } from "@/components/ProductCard";

type SortOption = "relevance" | "price-asc" | "price-desc";

export function SearchResults({
  products,
  query,
}: {
  products: Product[];
  query: string;
}) {
  const [sort, setSort] = useState<SortOption>("relevance");

  const sorted = useMemo(() => {
    if (sort === "price-asc") {
      return [...products].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    }
    if (sort === "price-desc") {
      return [...products].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }
    return products;
  }, [products, sort]);

  if (!products.length) {
    return (
      <div className="bg-white shadow-md rounded-lg px-8 py-16 text-center">
        <i className="fa-solid fa-magnifying-glass text-3xl text-gray-700 mb-2"></i>
        <p className="text-gray-900 font-extrabold text-lg">
          No results for "{query}"
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Try a different search term or browse our store.
        </p>
        <a
          href="/"
          className="inline-block mt-6 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2.5 rounded transition-colors"
        >
          Browse All Comics
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-14">
      {/* Toolbar */}
      <div className="px-5 flex items-center justify-between gap-4">
        <p className="text-gray-500 text-md">
          <span className="font-bold text-gray-900">{products.length}</span>{" "}
          result{products.length !== 1 ? "s" : ""} for{" "}
          <span className="font-bold text-gray-900">"{query}"</span>
        </p>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
            Sort by
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent bg-white cursor-pointer"
          >
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
          {sorted.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
