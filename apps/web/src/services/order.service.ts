import authorizedAxios from "@/utils/request/authorizedRequest";
import type { Types } from "@my-monorepo/shared";

export interface GetOrderParams {
  search?: string;
  status?: string; // optional filter by order status
  page?: number;
  limit?: number;
  sort_by?: keyof Types.Order.OrderType;
  order?: "asc" | "desc";
}

export interface GetOrdersResponse {
  status: number;
  message: string;
  result: Types.Order.OrderType[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const getOrders = async (
  params: GetOrderParams
): Promise<GetOrdersResponse> => {
  try {
    const response = await authorizedAxios.get("/order", {
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

export const addOrder = async (data: Types.Order.OrderForm) => {
  try {
    const response = await authorizedAxios.post("/order", data);
    return response.data;
  } catch (error) {
    console.info("Failed to create order");
    return error;
  }
};

export const updateOrder = async (id: string, data: Types.Order.OrderForm) => {
  try {
    const response = await authorizedAxios.put(`/order/${id}`, data);
    return response.data;
  } catch (error) {
    console.info("Failed to update order");
    return error;
  }
};

export const deleteOrder = async (id: string) => {
  try {
    const response = await authorizedAxios.delete(`/order/${id}`);
    return response.data;
  } catch (error) {
    console.info("Failed to delete order");
    return error;
  }
};
