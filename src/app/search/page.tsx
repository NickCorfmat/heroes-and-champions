import { supabaseClient } from "@/lib/supabaseClient";
import { Product, ProductCard } from "@/components/layout/ProductCard";
import { Footer } from "@/components/layout/Footer";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";

  const { data: products, error } = await supabaseClient
    .rpc("search_products", { search_query: query });

  return (
    <>
      <div className="p-8 text-black mb-8">
        <h1 className="text-2xl font-bold mb-6">
          Results for "{query}"
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-y-8">
          {products?.length ? (
            products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-black/60 col-span-full">
              No products found for "{query}".
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}