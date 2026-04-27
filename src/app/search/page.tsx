import { getSupabaseClient } from "@/lib/supabaseClient";
import { SearchResults } from "@components/SearchResults";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";

  const { data: products } = await getSupabaseClient().rpc("search_products", {
    search_query: query,
  });

  return (
    <>
      {/* Results */}
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <SearchResults products={products ?? []} query={query} />
        </div>
      </div>
    </>
  );
}
