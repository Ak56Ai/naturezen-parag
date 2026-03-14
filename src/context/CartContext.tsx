import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, Product } from "../lib/supabase";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCart = async () => {
    setIsLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      setCart([]);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        quantity,
        product:products(*)
      `)
      .eq("user_id", user.id);

    if (error) {
      console.error("Load cart error:", error);
    } else {
      const formatted = data.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
      }));
      setCart(formatted);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addToCart = async (product: Product, quantity = 1) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      console.error("User not logged in");
      return;
    }

    const { data: existingItem, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .maybeSingle();

    if (error) {
      console.error("Fetch cart error:", error);
      return;
    }

    if (existingItem) {
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({
          quantity: existingItem.quantity + quantity,
          updated_at: new Date()
        })
        .eq("id", existingItem.id);

      if (updateError) console.error(updateError);
    } else {
      const { error: insertError } = await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: product.id,
          quantity: quantity
        });

      if (insertError) console.error("Insert error:", insertError);
    }

    loadCart();
  };

  const removeFromCart = async (productId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (error) console.error(error);

    loadCart();
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .update({
        quantity,
        updated_at: new Date()
      })
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (error) console.error(error);

    loadCart();
  };

  const clearCart = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    if (error) console.error(error);

    setCart([]);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};