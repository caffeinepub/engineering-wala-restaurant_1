import type { DishData } from "@/data/dishes";
import { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  dish: DishData;
  quantity: number;
  isHalf: boolean;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (dish: DishData, isHalf?: boolean) => void;
  removeFromCart: (dishId: string, isHalf: boolean) => void;
  updateQuantity: (dishId: string, isHalf: boolean, qty: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CART_KEY = "ewala_cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  total: 0,
  itemCount: 0,
});

export function useCartState(): CartContextType {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  const addToCart = (dish: DishData, isHalf = false) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.dish.id === dish.id && i.isHalf === isHalf,
      );
      if (existing) {
        return prev.map((i) =>
          i.dish.id === dish.id && i.isHalf === isHalf
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prev, { dish, quantity: 1, isHalf }];
    });
  };

  const removeFromCart = (dishId: string, isHalf: boolean) => {
    setCartItems((prev) =>
      prev.filter((i) => !(i.dish.id === dishId && i.isHalf === isHalf)),
    );
  };

  const updateQuantity = (dishId: string, isHalf: boolean, qty: number) => {
    if (qty <= 0) {
      removeFromCart(dishId, isHalf);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) =>
        i.dish.id === dishId && i.isHalf === isHalf
          ? { ...i, quantity: qty }
          : i,
      ),
    );
  };

  const clearCart = () => setCartItems([]);

  const total = cartItems.reduce(
    (sum, i) =>
      sum +
      (i.isHalf ? (i.dish.halfPrice ?? i.dish.price) : i.dish.price) *
        i.quantity,
    0,
  );

  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  };
}

export function useCart(): CartContextType {
  return useContext(CartContext);
}
