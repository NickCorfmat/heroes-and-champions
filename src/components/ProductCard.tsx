"use client";

import Image from "next/image";
import Link from "next/link";

export interface Product {
  id: number;
  created_at: string;
  title: string | null;
  description: string | null;
  price: number | null;
  rating: number | null;
  image_ref: string | null;
  category: string | null;
}

export function ProductCard({
  product,
  added = false,
  onAddToCart,
}: {
  product: Product;
  added?: boolean;
  onAddToCart?: (product: Product) => void;
}) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="w-[170px] shrink-0 bg-white rounded-none shadow hover:scale-101 transition overflow-hidden flex flex-col"
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

      <div className="p-3 flex flex-col flex-1 justify-between text-black">
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
            onAddToCart?.(product);
          }}
          className={`w-full py-1.5 mt-2 text-white text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer active:scale-95 ${
            added
              ? "bg-green-600 cursor-default"
              : "bg-red-600 hover:bg-red-500"
          }`}
        >
          {added ? "✓ Added!" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
}
