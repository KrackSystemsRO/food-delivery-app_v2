import { Types } from "../../index";
import { AxiosInstance } from "axios";

export const addToCart = async (
  axios: AxiosInstance,
  {
    product,
    quantity,
    store,
    observations,
  }: {
    product: string;
    quantity: number;
    store: string;
    observations?: string;
  }
) => {
  try {
    const response = await axios.post("/cart/up", {
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

export const fetchCart = async (axios: AxiosInstance) => {
  const response = await axios.get(`/cart`);
  return response.data.result;
};

export const updateCartItemQuantity = async (
  axios: AxiosInstance,
  product: string,
  quantity: number,
  store: Types.Store.StoreType
) => {
  const response = await axios.post(`/cart/up`, {
    product,
    quantity,
    store,
    updateQuantity: true,
  });

  if (response.status === 500) throw new Error("Failed to update quantity");
  return response.data;
};

export const removeItemFromCart = async (
  axios: AxiosInstance,
  product: string
) => {
  const response = await axios.delete(`/cart/item/${product}`);
  return response.data.result;
};

export const clearCart = async (axios: AxiosInstance) => {
  const response = await axios.delete(`/cart`);
  return response.data.message;
};
