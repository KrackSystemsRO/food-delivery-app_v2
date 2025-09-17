import { OrderType } from "@/types/order.type";
import axiosInstance from "@/utils/request/authorizedRequest";
import { GetOrdersParams, GetOrdersResponse } from "./order.service";

/* ------------------ Services ------------------ */

export const getOrders = async (
  params: GetOrdersParams = {}
): Promise<GetOrdersResponse> => {
  try {
    const response = await axiosInstance.get("/order", { params });
    return {
      result: response.data.result || [],
      status: response.status,
      message: response.data.message,
      totalCount: response.data.totalCount || 0,
      totalPages: response.data.totalPages || 1,
      currentPage: response.data.currentPage || 1,
    } as GetOrdersResponse;
  } catch (error: any) {
    console.error("Failed to fetch orders:", error);
    return {
      result: [],
      status: 500,
      message: "Failed to fetch orders.",
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
};

// Fetch a single order by ID
export const getOrderById = async (orderId: string): Promise<OrderType> => {
  try {
    const response = await axiosInstance.get(`/order/${orderId}`);
    return response.data.result;
  } catch (error: any) {
    console.error(`Failed to fetch order ${orderId}:`, error);
    throw error;
  }
};

// Accept an order
export const acceptOrder = async (orderId: string): Promise<OrderType> => {
  try {
    const response = await axiosInstance.post("/order/accept-order", {
      orderId,
    });
    return response.data.result;
  } catch (error: any) {
    console.log(error);
    return error;
  }
};

// Deny an order
export const denyOrder = async (orderId: string): Promise<OrderType> => {
  const response = await axiosInstance.post("/order/deny-order", { orderId });
  return response.data.result;
};
