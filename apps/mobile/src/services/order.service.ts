import { Types } from "@my-monorepo/shared";
import axiosInstance from "../utils/request/authorizedRequest";

export interface GetOrdersParams {
  _id?: string;
  user?: string;
  store?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  order?: "asc" | "desc";
}

export interface GetOrdersResponse {
  result: Types.Order.OrderType[];
  status: number;
  message: string;
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface AcceptDenyOrderResponse {
  result: Types.Order.OrderType;
  status: number;
  message: string;
}

export const placeOrder = async (orderData: {
  store: Types.Store.StoreType;
  items: Types.Cart.CartItemType[];
  deliveryLocation: {
    lat: number;
    lng: number;
    address: string;
  };
}) => {
  try {
    const response = await axiosInstance.post("/order", orderData);
    return response.data;
  } catch (error) {
    console.error("Failed to place order to store ", error);
    throw error;
  }
};

export const getUserOrder = async () => {
  try {
    const response = await axiosInstance.get("/order");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch orders of store ", error);
    throw error;
  }
};
export const getOrderById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/order/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch orders of store ", error);
    throw error;
  }
};

export const acceptOrder = async (orderId: string) => {
  try {
    const response = await axiosInstance.post("/order/accept-order", {
      orderId,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to accept order of store ", error);
    throw error;
  }
};

export const denyOrder = async (orderId: string) => {
  try {
    const response = await axiosInstance.post("/order/deny-order", { orderId });
    return response.data;
  } catch (error) {
    console.error("Failed to accept order of store ", error);
    throw error;
  }
};

export const getUserOrdersByStores = async (storesId: string[]) => {
  try {
    const response = await axiosInstance.post(`/order/get-store`, {
      stores: storesId,
    });
    return response.data.result ?? [];
  } catch (error) {
    console.error("Failed to fetch orders of store ", error);
    throw error;
  }
};
