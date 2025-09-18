import type { Types } from "../../index";
import { AxiosInstance } from "axios";

export interface GetStoresResponse {
  status: number;
  message: string;
  result: Types.Store.StoreType[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const getStores = async (
  axios: AxiosInstance,
  params: Types.Store.StoreListQuery
): Promise<GetStoresResponse> => {
  try {
    const response = await axios.get("/store", {
      params,
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
    console.error("Failed to fetch stores:", error);
    return {
      result: [],
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Failed to fetch stores",
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
};

export const addStore = async (
  axios: AxiosInstance,
  data: Types.Store.StoreForm
) => {
  try {
    const response = await axios.post(`/store`, data);
    return response.data;
  } catch (error) {
    console.info("Failed to create store");
    return error;
  }
};

export const updateStore = async (
  axios: AxiosInstance,
  id: string,
  data: Types.Store.StoreForm
) => {
  try {
    const response = await axios.put(`/store/${id}`, data);
    return response.data;
  } catch (error) {
    console.info("Failed to update store");
    return error;
  }
};

export const deleteStore = async (axios: AxiosInstance, id: string) => {
  try {
    const response = await axios.delete(`/store/${id}`);
    return response.data;
  } catch (error) {
    console.info("Failed to delete store");
    return error;
  }
};
