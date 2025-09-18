import React, { createContext, useContext, useEffect, useReducer } from "react";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";

type Action =
  | { type: "SET_CART"; cart: Types.Cart.CartStateType }
  | { type: "CLEAR_CART" };

const CartContext = createContext<{
  state: Types.Cart.CartStateType;
  dispatch: React.Dispatch<Action>;
  syncAddToCart: (
    item: Types.Cart.CartItemType,
    store: string
  ) => Promise<boolean>;
  syncUpdateQuantity: (product: string, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}>({
  state: { store: null, items: [] },
  dispatch: () => {},
  syncAddToCart: async () => false,
  syncUpdateQuantity: async () => {},
  refreshCart: async () => {},
});

const cartReducer = (
  state: Types.Cart.CartStateType,
  action: Action
): Types.Cart.CartStateType => {
  switch (action.type) {
    case "SET_CART":
      return {
        store: action.cart.store,
        items: action.cart.items,
      };
    case "CLEAR_CART":
      return { store: null, items: [] };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, {
    store: null,
    items: [],
  });

  const refreshCart = async () => {
    try {
      const cartData = await Services.Cart.fetchCart(axiosInstance);
      if (cartData) {
        const CartStateType: Types.Cart.CartStateType = {
          store: cartData.store?._id || cartData.store,
          items: cartData.items.map((i: any) => ({
            product: i.product._id || i.product,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            observations: i.observations,
          })),
        };

        dispatch({ type: "SET_CART", cart: CartStateType });
      }
    } catch (err) {
      console.error("Failed to refresh cart:", err);
    }
  };

  const initializeCart = async () => {
    await refreshCart();
  };

  const syncAddToCart = async (
    item: Types.Cart.CartItemType,
    store: string
  ): Promise<boolean> => {
    const addToCart = await Services.Cart.addToCart(axiosInstance, {
      product: item.product,
      quantity: item.quantity,
      store,
      observations: item.observations,
    });

    if (!addToCart.success) {
      console.log("Add to cart error:", addToCart.message);
      return false;
    }

    await refreshCart();

    return true;
  };

  const syncUpdateQuantity = async (product: string, quantity: number) => {
    if (!state.store) throw new Error("No store set");

    await Services.Cart.updateCartItemQuantity(
      axiosInstance,
      product,
      quantity,
      state.store
    );

    await refreshCart();
  };

  useEffect(() => {
    initializeCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        syncAddToCart,
        syncUpdateQuantity,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
