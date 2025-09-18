import { AxiosInstance } from "axios";
import type { Types } from "../../index";

export interface GetOrderParams {
  _id?: string;
  search?: string;
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

export const getOrders = async (
  axios: AxiosInstance,
  params: GetOrderParams
): Promise<GetOrdersResponse> => {
  try {
    const response = await axios.get("/order", {
      params: {
        search: params.search,
        status: params.status,
        page: params.page,
        limit: params.limit,
        sort_by: params.sort_by,
        order: params.order,
      },
    });

    return {
      result: response.data.result,
      status: response.status,
      message: response.data.message,
      totalCount: response.data.totalCount,
      totalPages: response.data.totalPages,
      currentPage: response.data.currentPage,
    };
  } catch (error: any) {
    console.error("Failed to fetch orders:", error);
    return {
      result: [],
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Failed to fetch orders",
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
};

export const addOrder = async (
  axios: AxiosInstance,
  data: Types.Order.OrderForm
) => {
  try {
    const response = await axios.post("/order", data);
    return response.data;
  } catch (error) {
    console.info("Failed to create order");
    return error;
  }
};

export const updateOrder = async (
  axios: AxiosInstance,
  id: string,
  data: Types.Order.OrderForm
) => {
  try {
    const response = await axios.put(`/order/${id}`, data);
    return response.data;
  } catch (error) {
    console.info("Failed to update order");
    return error;
  }
};

export const deleteOrder = async (axios: AxiosInstance, id: string) => {
  try {
    const response = await axios.delete(`/order/${id}`);
    return response.data;
  } catch (error) {
    console.info("Failed to delete order");
    return error;
  }
};

export const placeOrder = async (
  axios: AxiosInstance,
  orderData: {
    store: Types.Store.StoreType;
    items: Types.Cart.CartItemType[];
    deliveryLocation: {
      lat: number;
      lng: number;
      address: string;
    };
  }
) => {
  try {
    const response = await axios.post("/order", orderData);
    return response.data;
  } catch (error) {
    console.error("Failed to place order to store ", error);
    throw error;
  }
};

export const getUserOrder = async (axios: AxiosInstance) => {
  try {
    const response = await axios.get("/order");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch orders of store ", error);
    throw error;
  }
};
export const getOrderById = async (axios: AxiosInstance, id: string) => {
  try {
    const response = await axios.get(`/order/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch orders of store ", error);
    throw error;
  }
};

export const acceptOrder = async (axios: AxiosInstance, orderId: string) => {
  try {
    const response = await axios.post("/order/accept-order", {
      orderId,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to accept order of store ", error);
    throw error;
  }
};

export const denyOrder = async (axios: AxiosInstance, orderId: string) => {
  try {
    const response = await axios.post("/order/deny-order", { orderId });
    return response.data;
  } catch (error) {
    console.error("Failed to accept order of store ", error);
    throw error;
  }
};

export const getUserOrdersByStores = async (
  axios: AxiosInstance,
  storesId: string[]
) => {
  try {
    const response = await axios.post(`/order/get-store`, {
      stores: storesId,
    });
    return response.data.result ?? [];
  } catch (error) {
    console.error("Failed to fetch orders of store ", error);
    throw error;
  }
};
