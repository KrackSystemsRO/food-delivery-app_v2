// src/services/deliveryLocation.service.ts
import type { AxiosInstance } from "axios";
import type { Types } from "../../index";

// ---------- Query params ----------
export interface GetDeliveryLocationParams {
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: keyof Types.DeliveryLocation.DeliveryLocation;
  order?: "asc" | "desc";
}

// ---------- Response shape ----------
export interface GetDeliveryLocationsResponse {
  status: number;
  message: string;
  result: Types.DeliveryLocation.DeliveryLocation[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// ---------- CRUD services ----------
export const getDeliveryLocations = async (
  axios: AxiosInstance,
  params: GetDeliveryLocationParams
): Promise<GetDeliveryLocationsResponse> => {
  try {
    const response = await axios.get("/locations", {
      params: {
        search: params.search,
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
    console.error("Failed to fetch delivery locations:", error);
    return {
      result: [],
      status: error?.response?.status || 500,
      message:
        error?.response?.data?.message || "Failed to fetch delivery locations",
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
};

export const addDeliveryLocation = async (
  axios: AxiosInstance,
  data: Types.DeliveryLocation.DeliveryLocation
) => {
  try {
    const response = await axios.post("/locations", data);
    return response.data;
  } catch (error) {
    console.info("Failed to create delivery location");
    return error;
  }
};

export const updateDeliveryLocation = async (
  axios: AxiosInstance,
  id: string,
  data: Partial<Types.DeliveryLocation.DeliveryLocation>
) => {
  try {
    const response = await axios.put(`/locations/${id}`, data);
    return response.data;
  } catch (error) {
    console.info("Failed to update delivery location");
    return error;
  }
};

export const deleteDeliveryLocation = async (
  axios: AxiosInstance,
  id: string
) => {
  try {
    const response = await axios.delete(`/locations/${id}`);
    return response.data;
  } catch (error) {
    console.info("Failed to delete delivery location");
    return error;
  }
};
