import { Types } from "@my-monorepo/shared";
import axiosInstance from "../utils/request/authorizedRequest";

export const addToCart = async ({
  product,
  quantity,
  store,
  observations,
}: {
  product: string;
  quantity: number;
  store: string;
  observations?: string;
}) => {
  try {
    const response = await axiosInstance.post("/cart/up", {
      product,
      quantity,
      store,
      observations,
    });

    return { success: true, data: response.data.result };
  } catch (error: any) {
    const message = error.response?.data?.message || "Something went wrong.";
    return { success: false, message, status: error.response?.status || 500 };
  }
};

export const fetchCart = async () => {
  const response = await axiosInstance.get(`/cart`);
  return response.data.result;
};

export const updateCartItemQuantity = async (
  product: string,
  quantity: number,
  store: Types.Store.StoreType
) => {
  const response = await axiosInstance.post(`/cart/up`, {
    product,
    quantity,
    store,
    updateQuantity: true,
  });

  if (response.status === 500) throw new Error("Failed to update quantity");
  return response.data;
};

export const removeItemFromCart = async (product: string) => {
  const response = await axiosInstance.delete(`/cart/item/${product}`);
  return response.data.result;
};

export const clearCart = async () => {
  const response = await axiosInstance.delete(`/cart`);
  return response.data.message;
};
