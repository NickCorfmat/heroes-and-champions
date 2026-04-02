import { SupabaseClient } from "@supabase/supabase-js";

export async function addToCart(
  supabase: SupabaseClient,
  userId: string,
  productId: number
) {
  // Check if item already exists in cart
  const { data: existing } = await (supabase as any)
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single();

  if (existing) {
    // Increment quantity
    await (supabase as any)
      .from("cart_items")
      .update({ quantity: existing.quantity + 1 })
      .eq("id", existing.id);
  } else {
    // Insert new row
    await (supabase as any)
      .from("cart_items")
      .insert({ user_id: userId, product_id: productId, quantity: 1 });
  }
}

export async function removeFromCart(
  supabase: SupabaseClient,
  cartItemId: number
) {
  await (supabase as any).from("cart_items").delete().eq("id", cartItemId);
}

export async function updateCartQuantity(
  supabase: SupabaseClient,
  cartItemId: number,
  newQuantity: number
) {
  if (newQuantity <= 0) {
    return removeFromCart(supabase, cartItemId);
  }
  await (supabase as any)
    .from("cart_items")
    .update({ quantity: newQuantity })
    .eq("id", cartItemId);
}
